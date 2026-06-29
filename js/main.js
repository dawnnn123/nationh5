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

  function getActiveSectionScrollEl() {
    var section = sections[currentIndex];
    if (!section) return null;
    var candidates = section.querySelectorAll('.section-inner, .map-inner, .messages-inner');
    for (var i = 0; i < candidates.length; i++) {
      var el = candidates[i];
      var style = window.getComputedStyle(el);
      var overflowY = style.overflowY;
      if ((overflowY === 'auto' || overflowY === 'scroll') &&
          el.scrollHeight > el.clientHeight + 2) {
        return el;
      }
    }
    return null;
  }

  function isMobileViewport() {
    return window.matchMedia('(max-width: 768px)').matches;
  }

  function canSwitchSectionOnSwipe(scrollEl, diff) {
    if (!scrollEl) return true;
    var maxScroll = scrollEl.scrollHeight - scrollEl.clientHeight;
    if (maxScroll <= 1) return true;
    var top = scrollEl.scrollTop;
    if (diff > 0) return top >= maxScroll - 12;
    return top <= 12;
  }

  function handleWheel(e) {
    if (e.target.closest('textarea, input, select, .messages-form')) return;

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
  var touchDidInnerScroll = false;

  document.addEventListener('touchstart', function (e) {
    touchStartY = e.touches[0].clientY;
    touchDidInnerScroll = false;
    var scrollEl = getActiveSectionScrollEl();
    touchStartScrollTop = scrollEl ? scrollEl.scrollTop : 0;
  }, { passive: true });

  document.addEventListener('touchmove', function () {
    var scrollEl = getActiveSectionScrollEl();
    if (scrollEl && Math.abs(scrollEl.scrollTop - touchStartScrollTop) > 4) {
      touchDidInnerScroll = true;
    }
  }, { passive: true });

  document.addEventListener('touchend', function (e) {
    if (isAnimating || wheelLocked) return;
    var diff = touchStartY - e.changedTouches[0].clientY;
    if (Math.abs(diff) < 50) return;

    if (touchDidInnerScroll) return;

    var scrollEl = getActiveSectionScrollEl();
    if (isMobileViewport() && scrollEl) {
      if (!canSwitchSectionOnSwipe(scrollEl, diff)) return;
    } else if (scrollEl && shouldScrollInside(scrollEl, diff)) {
      return;
    }

    wheelLocked = true;
    if (diff > 0) goToSection(currentIndex + 1);
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
  var videoSoundOn = false;
  var videoPlayBound = false;

  function isVideoSlide(index) {
    return slides[index] && slides[index].classList.contains('carousel-slide-video');
  }

  function tryPlayVideo(video) {
    if (!video) return;
    var playPromise = video.play();
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(function () {});
    }
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

    document.addEventListener('click', resumeOnGesture, { once: true, passive: true });
    document.addEventListener('touchstart', resumeOnGesture, { once: true, passive: true });

    slideVideo.addEventListener('loadeddata', function () {
      if (isVideoSlide(slideIndex)) tryPlayVideo(slideVideo);
    });

    slideVideo.addEventListener('canplay', function () {
      if (isVideoSlide(slideIndex)) tryPlayVideo(slideVideo);
    });

    document.addEventListener('visibilitychange', function () {
      if (!document.hidden && isVideoSlide(slideIndex)) {
        tryPlayVideo(slideVideo);
      }
    });
  }

  function clearAuto() {
    clearInterval(autoTimer);
    autoTimer = null;
  }

  function scheduleAuto() {
    clearAuto();
    if (isVideoSlide(slideIndex) && slideVideo) {
      slideVideo.currentTime = 0;
      tryPlayVideo(slideVideo);
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
    var onVideoSlide = slides[slideIndex] && slides[slideIndex].classList.contains('carousel-slide-video');
    soundBtn.classList.toggle('is-visible', onVideoSlide);
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
        tryPlayVideo(video);
      } else {
        video.pause();
        video.currentTime = 0;
      }
    });
  }

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
      if (e.target.closest('.carousel-btn') || e.target.closest('.carousel-dots')) {
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
