(function () {
  'use strict';

  var sections = Array.prototype.slice.call(document.querySelectorAll('.section'));
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.main-nav a'));
  var backTop = document.getElementById('backTop');

  var currentIndex = 0;
  var isAnimating = false;
  var wheelLocked = false;
  var WHEEL_COOLDOWN = 900;
  var ANIM_DURATION = 800;

  function updateUI(index) {
    sections.forEach(function (sec, i) {
      var active = i === index;
      sec.classList.toggle('active', active);
      sec.classList.toggle('in-view', active);
      if (!active) {
        sec.scrollTop = 0;
        sec.querySelectorAll('.section-inner, .map-inner, .messages-inner').forEach(function (el) {
          el.scrollTop = 0;
        });
      }
    });

    navLinks.forEach(function (link) {
      var target = document.querySelector(link.getAttribute('href'));
      if (target) {
        var idx = sections.indexOf(target);
        link.classList.toggle('active', idx === index);
      }
    });

    if (backTop) {
      backTop.classList.toggle('visible', index > 0);
    }

    try {
      window.dispatchEvent(new CustomEvent('fullpage-section', {
        detail: {
          index: index,
          section: sections[index] || null,
          id: sections[index] ? sections[index].id : ''
        }
      }));
    } catch (e) { /* ignore */ }
  }

  function goToSection(index, force) {
    if (index < 0 || index >= sections.length) return;
    if (!force && (index === currentIndex || isAnimating)) return;

    isAnimating = true;
    currentIndex = index;
    updateUI(index);

    setTimeout(function () {
      isAnimating = false;
    }, ANIM_DURATION);
  }

  function shouldScrollInside(scrollEl, delta) {
    if (!scrollEl) return false;
    var maxScroll = scrollEl.scrollHeight - scrollEl.clientHeight;
    if (maxScroll <= 1) return false;
    if (delta > 0 && scrollEl.scrollTop < maxScroll - 2) return true;
    if (delta < 0 && scrollEl.scrollTop > 2) return true;
    return false;
  }

  function isMobileViewport() {
    return window.matchMedia('(max-width: 768px)').matches;
  }

  function findScrollableFromTarget(section, target) {
    if (!section || !target) return null;
    if (section.id === 'section-banner' || section.id === 'section-projects') {
      return null;
    }
    var node = target;
    while (node && node !== section && node !== document.body) {
      if (node.nodeType !== 1) {
        node = node.parentNode;
        continue;
      }
      var style = window.getComputedStyle(node);
      var overflowY = style.overflowY;
      if ((overflowY === 'auto' || overflowY === 'scroll') &&
          node.scrollHeight > node.clientHeight + 2) {
        return node;
      }
      node = node.parentNode;
    }
    return null;
  }

  function getScrollableInSection(section) {
    if (!section) return null;

    /* 轮播、项目名录：不做屏内滚动，避免手机/微信滑不回去 */
    if (section.id === 'section-banner' || section.id === 'section-projects') {
      return null;
    }

    if (section.id === 'section-messages' && isMobileViewport()) {
      var secStyle = window.getComputedStyle(section);
      if ((secStyle.overflowY === 'auto' || secStyle.overflowY === 'scroll') &&
          section.scrollHeight > section.clientHeight + 2) {
        return section;
      }
    }

    var selectors = ['.messages-inner', '.section-inner', '.map-inner'];
    for (var s = 0; s < selectors.length; s++) {
      var nodes = section.querySelectorAll(selectors[s]);
      for (var i = 0; i < nodes.length; i++) {
        var el = nodes[i];
        var style = window.getComputedStyle(el);
        var overflowY = style.overflowY;
        if ((overflowY === 'auto' || overflowY === 'scroll') &&
            el.scrollHeight > el.clientHeight + 2) {
          return el;
        }
      }
    }
    return null;
  }

  function getActiveSectionScrollEl() {
    return getScrollableInSection(sections[currentIndex]);
  }

  function handleWheel(e) {
    if (e.target.closest('textarea, input, select, .messages-form, .messages-board, .slide-video-play')) return;

    var scrollEl = getActiveSectionScrollEl();
    if (scrollEl && shouldScrollInside(scrollEl, e.deltaY)) return;

    e.preventDefault();
    if (wheelLocked || isAnimating) return;

    var delta = e.deltaY;
    if (Math.abs(delta) < 30) return;

    wheelLocked = true;
    if (delta > 0) {
      goToSection(currentIndex + 1);
    } else {
      goToSection(currentIndex - 1);
    }

    setTimeout(function () {
      wheelLocked = false;
    }, WHEEL_COOLDOWN);
  }

  var touchStartY = 0;
  var touchStartScrollTop = 0;
  var touchStartScrollEl = null;
  var touchDidInnerScroll = false;

  document.addEventListener('touchstart', function (e) {
    touchStartY = e.touches[0].clientY;
    touchDidInnerScroll = false;
    var section = sections[currentIndex];
    touchStartScrollEl = findScrollableFromTarget(section, e.target) || getActiveSectionScrollEl();
    touchStartScrollTop = touchStartScrollEl ? touchStartScrollEl.scrollTop : 0;
  }, { passive: true });

  document.addEventListener('touchmove', function () {
    if (touchStartScrollEl && Math.abs(touchStartScrollEl.scrollTop - touchStartScrollTop) > 4) {
      touchDidInnerScroll = true;
    }
  }, { passive: true });

  document.addEventListener('touchend', function (e) {
    if (isAnimating || wheelLocked) return;
    var diff = touchStartY - e.changedTouches[0].clientY;
    if (Math.abs(diff) < 50) return;

    var scrollEl = touchStartScrollEl;
    var wantNext = diff > 0;
    var wantPrev = diff < 0;

    if (scrollEl) {
      var maxScroll = scrollEl.scrollHeight - scrollEl.clientHeight;
      if (maxScroll > 1) {
        var atTop = scrollEl.scrollTop <= 12;
        var atBottom = scrollEl.scrollTop >= maxScroll - 12;
        if (wantNext && !atBottom) return;
        if (wantPrev && !atTop) return;
      }
    } else if (touchDidInnerScroll) {
      return;
    }

    wheelLocked = true;
    if (wantNext) goToSection(currentIndex + 1);
    else goToSection(currentIndex - 1);
    setTimeout(function () { wheelLocked = false; }, WHEEL_COOLDOWN);
  }, { passive: true });

  window.addEventListener('wheel', handleWheel, { passive: false });

  navLinks.forEach(function (link) {
    link.addEventListener('click', function (e) {
      var href = link.getAttribute('href') || '';
      /* 仅拦截页内锚点；culture.html 等外链正常跳转 */
      if (href.charAt(0) !== '#') return;
      e.preventDefault();
      var target = document.querySelector(href);
      if (target) {
        var idx = sections.indexOf(target);
        if (idx >= 0) goToSection(idx, true);
      }
    });
  });

  function goToHashSection() {
    var hash = window.location.hash;
    if (!hash) return;
    var target = document.querySelector(hash);
    if (target) {
      var idx = sections.indexOf(target);
      if (idx >= 0) goToSection(idx, true);
    }
  }

  if (backTop) {
    backTop.addEventListener('click', function () {
      goToSection(0, true);
    });
  }

  window.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowDown' || e.key === 'PageDown') {
      e.preventDefault();
      goToSection(currentIndex + 1);
    } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
      e.preventDefault();
      goToSection(currentIndex - 1);
    } else if (e.key === 'Home') {
      goToSection(0, true);
    }
  });

  if (window.location.hash) {
    goToHashSection();
  } else {
    goToSection(0, true);
  }

  window.addEventListener('hashchange', goToHashSection);

  /* ========== 轮播 ========== */
  var track = document.getElementById('carouselTrack');
  if (!track) return;

  var slides = Array.prototype.slice.call(track.querySelectorAll('.carousel-slide'));
  var prevBtn = document.getElementById('carouselPrev');
  var nextBtn = document.getElementById('carouselNext');
  var dotsContainer = document.getElementById('carouselDots');
  var slideIndex = 0;
  var autoTimer = null;
  var AUTO_INTERVAL = 5000;

  slides.forEach(function (_, i) {
    var dot = document.createElement('span');
    dot.className = 'dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      goToSlide(i);
      resetAuto();
    });
    dotsContainer.appendChild(dot);
  });

  var dots = Array.prototype.slice.call(dotsContainer.querySelectorAll('.dot'));
  var slideVideo = document.querySelector('.slide-video');
  var soundBtn = document.getElementById('slideVideoSound');
  var playBtn = document.getElementById('slideVideoPlay');
  var videoSoundOn = false;
  var videoPlayBound = false;

  function isWeChatBrowser() {
    return /MicroMessenger/i.test(navigator.userAgent || '');
  }

  function isVideoSlide(index) {
    return slides[index] && slides[index].classList.contains('carousel-slide-video');
  }

  function tryPlayVideo(video) {
    if (!video) return Promise.resolve();
    var playPromise = video.play();
    if (playPromise && typeof playPromise.then === 'function') {
      return playPromise.then(function () {
        updateVideoPlayBtn();
      }).catch(function () {
        updateVideoPlayBtn();
      });
    }
    updateVideoPlayBtn();
    return Promise.resolve();
  }

  function updateVideoPlayBtn() {
    if (!playBtn || !slideVideo) return;
    var show = isWeChatBrowser() && isVideoSlide(slideIndex) &&
      (slideVideo.paused || slideVideo.readyState < 2);
    playBtn.classList.toggle('is-visible', show);
    playBtn.hidden = !show;
    refreshSoundBtnVisibility();
  }

  function hideVideoPlayBtn() {
    if (!playBtn) return;
    playBtn.classList.remove('is-visible');
    playBtn.hidden = true;
    refreshSoundBtnVisibility();
  }

  function refreshSoundBtnVisibility() {
    if (!soundBtn) return;
    var onVideoSlide = isVideoSlide(slideIndex);
    var playVisible = playBtn && playBtn.classList.contains('is-visible');
    soundBtn.classList.toggle('is-visible', onVideoSlide && !playVisible && !isWeChatBrowser());
  }

  function bindVideoPlayFallback() {
    if (videoPlayBound || !slideVideo) return;
    videoPlayBound = true;

    var resumeOnGesture = function () {
      if (isVideoSlide(slideIndex)) {
        tryPlayVideo(slideVideo);
      }
      document.removeEventListener('click', resumeOnGesture);
      document.removeEventListener('touchstart', resumeOnGesture);
    };

    if (!isWeChatBrowser()) {
      document.addEventListener('click', resumeOnGesture, { once: true, passive: true });
      document.addEventListener('touchstart', resumeOnGesture, { once: true, passive: true });
    }

    var onVideoReady = function () {
      if (!isVideoSlide(slideIndex)) return;
      if (isWeChatBrowser()) {
        updateVideoPlayBtn();
        return;
      }
      tryPlayVideo(slideVideo);
    };

    slideVideo.addEventListener('loadeddata', onVideoReady, { once: true });
    slideVideo.addEventListener('canplay', onVideoReady, { once: true });

    slideVideo.addEventListener('playing', hideVideoPlayBtn);
    slideVideo.addEventListener('pause', updateVideoPlayBtn);
    slideVideo.addEventListener('ended', updateVideoPlayBtn);

    document.addEventListener('WeixinJSBridgeReady', function () {
      if (isVideoSlide(slideIndex)) updateVideoPlayBtn();
    }, false);

    document.addEventListener('visibilitychange', function () {
      if (!document.hidden && isVideoSlide(slideIndex)) {
        if (isWeChatBrowser()) updateVideoPlayBtn();
        else tryPlayVideo(slideVideo);
      }
    });

    if (isWeChatBrowser()) {
      window.setTimeout(updateVideoPlayBtn, 300);
      window.setTimeout(updateVideoPlayBtn, 1200);
    }
  }

  function clearAuto() {
    clearInterval(autoTimer);
    autoTimer = null;
  }

  function scheduleAuto() {
    clearAuto();
    if (isVideoSlide(slideIndex) && slideVideo) {
      if (!isWeChatBrowser()) {
        slideVideo.currentTime = 0;
        tryPlayVideo(slideVideo);
      } else {
        updateVideoPlayBtn();
      }
      return;
    }
    autoTimer = setInterval(function () {
      goToSlide(slideIndex + 1);
    }, AUTO_INTERVAL);
  }

  function resetAuto() {
    scheduleAuto();
  }

  function updateSoundBtn() {
    if (!soundBtn) return;
    refreshSoundBtnVisibility();
    soundBtn.classList.toggle('is-unmuted', videoSoundOn);
    soundBtn.setAttribute('aria-label', videoSoundOn ? '关闭声音' : '开启声音');
    soundBtn.title = videoSoundOn ? '关闭声音' : '开启声音';
  }

  function toggleVideoSound() {
    if (!slideVideo) return;
    videoSoundOn = !videoSoundOn;
    slideVideo.muted = !videoSoundOn;
    slideVideo.volume = videoSoundOn ? 1 : 0;
    updateSoundBtn();
    tryPlayVideo(slideVideo);
  }

  function goToSlide(index) {
    slideIndex = (index + slides.length) % slides.length;
    slides.forEach(function (s, i) {
      s.classList.toggle('active', i === slideIndex);
    });
    dots.forEach(function (d, i) {
      d.classList.toggle('active', i === slideIndex);
    });
    syncSlideVideos();
    updateSoundBtn();
    scheduleAuto();
  }

  function syncSlideVideos() {
    slides.forEach(function (s, i) {
      var video = s.querySelector('video');
      if (!video) return;
      video.muted = !videoSoundOn;
      if (videoSoundOn) video.volume = 1;
      if (i === slideIndex) {
        if (isWeChatBrowser()) {
          updateVideoPlayBtn();
        } else {
          tryPlayVideo(video);
        }
      } else {
        video.pause();
        video.currentTime = 0;
      }
    });
  }

  function pauseVideoWhenLeaveBanner() {
    if (!slideVideo) return;
    videoSoundOn = false;
    slideVideo.muted = true;
    slideVideo.volume = 0;
    slideVideo.pause();
    updateSoundBtn();
    updateVideoPlayBtn();
  }

  function resumeVideoOnBanner() {
    if (!slideVideo || !isVideoSlide(slideIndex)) return;
    videoSoundOn = false;
    slideVideo.muted = true;
    slideVideo.volume = 0;
    if (isWeChatBrowser()) {
      updateVideoPlayBtn();
      return;
    }
    tryPlayVideo(slideVideo);
    updateSoundBtn();
  }

  window.addEventListener('fullpage-section', function (e) {
    var detail = e.detail || {};
    if (detail.index !== 0) {
      pauseVideoWhenLeaveBanner();
    } else {
      resumeVideoOnBanner();
    }
  });

  if (slideVideo) {
    bindVideoPlayFallback();

    slideVideo.addEventListener('ended', function () {
      if (!isVideoSlide(slideIndex)) return;
      goToSlide(slideIndex + 1);
    });
  }

  if (soundBtn && slideVideo) {
    soundBtn.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      toggleVideoSound();
    });
  }

  if (playBtn && slideVideo) {
    playBtn.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      videoSoundOn = true;
      slideVideo.muted = false;
      slideVideo.volume = 1;
      tryPlayVideo(slideVideo).then(function () {
        hideVideoPlayBtn();
        updateSoundBtn();
      });
    });
    playBtn.addEventListener('mousedown', function (e) {
      e.stopPropagation();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      goToSlide(slideIndex - 1);
      resetAuto();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      goToSlide(slideIndex + 1);
      resetAuto();
    });
  }

  slides.forEach(function (slide) {
    slide.addEventListener('click', function (e) {
      if (e.target.closest('.carousel-btn') || e.target.closest('.carousel-dots') ||
          e.target.closest('.slide-video-play') || e.target.closest('.slide-video-sound')) {
        e.preventDefault();
      }
    });
  });

  if (soundBtn) {
    soundBtn.addEventListener('mousedown', function (e) {
      e.stopPropagation();
    });
  }

  scheduleAuto();
  updateSoundBtn();

})();
