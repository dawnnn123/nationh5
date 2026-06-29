/**
 * 同心寄语留言板 — rAF 驱动飘动（兼容 Android / Vivo 等不支持 keyframes 内 CSS 变量的浏览器）
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'nationh53-messages';
  var FLOAT_SPEED = 92;
  var LANE_GAP_MIN = 56;
  var LANE_GAP_MAX = 76;
  var LANE_GAP_JITTER_MIN = 0.18;
  var LANE_GAP_JITTER_MAX = 0.42;
  var LANE_MAX = 2;
  var LANE_START_MIN = 0.15;
  var LANE_START_MAX = 2.2;
  var LANE_RETRY_SEC = 0.2;
  var WATCHDOG_MS = 2000;

  function getLaneCount() {
    return window.matchMedia('(max-width: 768px)').matches ? 4 : 5;
  }

  var form = document.getElementById('messageForm');
  var board = document.getElementById('messageBoard');
  var section = document.getElementById('section-messages');
  var tipEl = document.getElementById('messageTip');
  var nicknameInput = document.getElementById('messageNickname');
  var contentInput = document.getElementById('messageContent');

  if (!form || !board) return;

  var laneEls = [];
  var laneTimers = [];
  var laneNextTimer = [];
  var floatAnims = [];
  var rafId = null;
  var resizeTimer = null;
  var watchdogTimer = null;
  var currentList = [];
  var spawning = false;
  var boardActive = false;

  var defaultMessages = [
    { id: 'seed-1', nickname: '阿依古丽', content: '民族团结就是你把我的孩子当你的孩子。', createdAt: 0 },
    { id: 'seed-2', nickname: '扎西顿珠', content: '在社区住了20年，各族邻居就是我的家人。', createdAt: 0 },
    { id: 'seed-3', nickname: '其其格', content: '草原上的蒙古包永远为各族兄弟姐妹敞开！', createdAt: 0 },
    { id: 'seed-4', nickname: '阿牛木果', content: '火把节点亮了彝家山寨，也温暖了四方来客。', createdAt: 0 },
    { id: 'seed-5', nickname: '米娜瓦尔', content: '各民族的孩子坐在一个教室里，就是我们最大的幸福。', createdAt: 0 },
    { id: 'seed-6', nickname: '洛桑卓玛', content: '酥油茶里飘着汉藏一家亲的香味，来我家喝一碗吧！', createdAt: 0 },
    { id: 'seed-7', nickname: '马哈木', content: '古尔邦节的羊肉，分给各族邻居才最香。', createdAt: 0 },
    { id: 'seed-8', nickname: '朴贞淑', content: '辣白菜和酸菜鱼在一个桌上，就是最丰盛的家宴。', createdAt: 0 },
    { id: 'seed-9', nickname: '覃桂芳', content: '三月三的歌圩上，不分民族大家一起唱山歌！', createdAt: 0 },
    { id: 'seed-10', nickname: '杨开旺', content: '苗寨的芦笙吹起来，欢迎各族朋友来做客。', createdAt: 0 },
    { id: 'seed-11', nickname: '图雅', content: '额尔古纳河畔的鄂温克人，永远珍惜民族团结之花。', createdAt: 0 },
    { id: 'seed-12', nickname: '刀梦罕', content: '泼水节的水花洒向各族同胞，祝福大家幸福安康！', createdAt: 0 }
  ];

  function randomBetween(min, max) {
    return min + Math.random() * (max - min);
  }

  function loadMessages() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return defaultMessages.slice();
      var stored = JSON.parse(raw);
      if (!Array.isArray(stored) || stored.length === 0) return defaultMessages.slice();

      var merged = [];
      var seen = {};

      defaultMessages.forEach(function (m) {
        seen[m.id] = true;
        merged.push(m);
      });

      stored.forEach(function (m) {
        if (!seen[m.id] && m.id && m.id.indexOf('msg-') === 0) {
          seen[m.id] = true;
          merged.push(m);
        }
      });

      return merged;
    } catch (e) {
      return defaultMessages.slice();
    }
  }

  function saveMessages(list) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch (e) { /* ignore */ }
  }

  function showTip(msg) {
    if (!tipEl) return;
    tipEl.textContent = msg;
    tipEl.hidden = !msg;
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function isSectionActive() {
    return section && section.classList.contains('active');
  }

  function clearLaneTimers() {
    laneTimers.forEach(function (timer) {
      window.clearTimeout(timer);
    });
    laneTimers = [];
    laneNextTimer.forEach(function (timer, i) {
      if (timer) window.clearTimeout(timer);
      laneNextTimer[i] = null;
    });
  }

  function clearFloatAnims() {
    floatAnims.forEach(function (anim) {
      if (anim.fallbackTimer) window.clearTimeout(anim.fallbackTimer);
    });
    floatAnims = [];
    if (rafId !== null) {
      window.cancelAnimationFrame(rafId);
      rafId = null;
    }
  }

  function trackLaneTimer(timer) {
    laneTimers.push(timer);
    return timer;
  }

  function scheduleLaneSpawn(laneIdx, delaySec) {
    if (!spawning || !currentList.length) return;
    if (laneNextTimer[laneIdx]) {
      window.clearTimeout(laneNextTimer[laneIdx]);
    }
    var timer = window.setTimeout(function () {
      laneNextTimer[laneIdx] = null;
      spawnOnLane(laneIdx);
    }, Math.max(0, delaySec) * 1000);
    laneNextTimer[laneIdx] = timer;
    trackLaneTimer(timer);
  }

  function calcFollowDelaySec(bubbleWidth) {
    var gapPx = randomBetween(LANE_GAP_MIN, LANE_GAP_MAX);
    var jitterSec = randomBetween(LANE_GAP_JITTER_MIN, LANE_GAP_JITTER_MAX);
    return (bubbleWidth + gapPx) / FLOAT_SPEED + jitterSec;
  }

  function scheduleLaneFollow(laneIdx, bubbleWidth) {
    scheduleLaneSpawn(laneIdx, calcFollowDelaySec(bubbleWidth));
  }

  function pickRandomMessage(list) {
    return list[Math.floor(Math.random() * list.length)];
  }

  function buildLanes() {
    board.innerHTML = '';
    laneEls = [];
    laneNextTimer = [];
    var count = getLaneCount();
    for (var i = 0; i < count; i++) {
      var lane = document.createElement('div');
      lane.className = 'message-lane';
      lane.setAttribute('data-lane', String(i));
      board.appendChild(lane);
      laneEls.push(lane);
      laneNextTimer.push(null);
    }
  }

  function getLaneBubbleCount(laneIdx) {
    var lane = laneEls[laneIdx];
    if (!lane) return 0;
    return lane.querySelectorAll('.message-bubble').length;
  }

  function getBoardLaneWidth(laneEl) {
    var w = laneEl.clientWidth;
    if (w >= 48) return w;
    w = board.clientWidth;
    if (w >= 48) return w;
    var rect = board.getBoundingClientRect();
    return rect.width >= 48 ? rect.width : 0;
  }

  function createBubbleEl(msg, laneIdx) {
    var bubble = document.createElement('div');
    bubble.className = 'message-bubble';
    bubble.setAttribute('data-id', msg.id);
    bubble.setAttribute('data-lane', String(laneIdx));
    bubble.innerHTML =
      '<button type="button" class="message-delete" title="删除这条留言" aria-label="删除这条留言">×</button>' +
      '<p class="message-body">' +
      '<span class="message-author">' + escapeHtml(msg.nickname) + '</span>' +
      '<span class="message-colon">：</span>' +
      '<span class="message-text">' + escapeHtml(msg.content) + '</span>' +
      '</p>';
    return bubble;
  }

  function removeBubble(bubble) {
    if (!bubble || !bubble.parentNode) return;
    bubble.parentNode.removeChild(bubble);
  }

  function removeBubblesById(id) {
    board.querySelectorAll('.message-bubble[data-id="' + id + '"]').forEach(removeBubble);
    floatAnims = floatAnims.filter(function (anim) {
      if (anim.el.getAttribute('data-id') === id) {
        if (anim.fallbackTimer) window.clearTimeout(anim.fallbackTimer);
        anim.done = true;
        return false;
      }
      return true;
    });
  }

  function setBubbleTransform(bubble, x) {
    bubble.style.transform = 'translateY(-50%) translateX(' + x + 'px)';
  }

  function finishAnim(anim) {
    if (anim.done) return;
    anim.done = true;
    if (anim.fallbackTimer) window.clearTimeout(anim.fallbackTimer);
    var laneIdx = anim.laneIdx;
    removeBubble(anim.el);
    floatAnims = floatAnims.filter(function (a) { return a !== anim; });
    if (spawning && getLaneBubbleCount(laneIdx) === 0 && !laneNextTimer[laneIdx]) {
      scheduleLaneSpawn(laneIdx, randomBetween(0.35, 0.9));
    }
  }

  function tickFloat(now) {
    if (!spawning) {
      rafId = null;
      return;
    }

    for (var i = floatAnims.length - 1; i >= 0; i--) {
      var anim = floatAnims[i];
      if (anim.done || !anim.el.parentNode) {
        floatAnims.splice(i, 1);
        continue;
      }

      if (anim.paused) {
        if (!anim.pauseStart) anim.pauseStart = now;
        continue;
      }

      if (anim.pauseStart) {
        anim.t0 += (now - anim.pauseStart);
        anim.pauseStart = 0;
      }

      if (!anim.t0) anim.t0 = now;
      var elapsed = now - anim.t0;
      var progress = Math.min(elapsed / anim.duration, 1);
      var x = anim.startX + (anim.endX - anim.startX) * progress;
      setBubbleTransform(anim.el, x);

      if (progress >= 1) {
        finishAnim(anim);
      }
    }

    if (spawning) {
      rafId = window.requestAnimationFrame(tickFloat);
    } else {
      rafId = null;
    }
  }

  function startRafLoop() {
    if (rafId === null) {
      rafId = window.requestAnimationFrame(tickFloat);
    }
  }

  function bindBubbleHover(anim) {
    anim.el.addEventListener('mouseenter', function () {
      anim.paused = true;
    });
    anim.el.addEventListener('mouseleave', function () {
      anim.paused = false;
    });
  }

  function spawnOnLane(laneIdx) {
    if (!spawning || !currentList.length || !isSectionActive()) return;

    var laneEl = laneEls[laneIdx];
    if (!laneEl) return;

    if (getLaneBubbleCount(laneIdx) >= LANE_MAX) {
      scheduleLaneSpawn(laneIdx, LANE_RETRY_SEC);
      return;
    }

    var laneWidth = getBoardLaneWidth(laneEl);
    if (laneWidth < 48) {
      scheduleLaneSpawn(laneIdx, LANE_RETRY_SEC);
      return;
    }

    var msg = pickRandomMessage(currentList);
    var bubble = createBubbleEl(msg, laneIdx);

    laneEl.appendChild(bubble);
    setBubbleTransform(bubble, 0);
    bubble.style.top = (50 + randomBetween(-7, 7)) + '%';

    var bubbleWidth = bubble.offsetWidth || 200;
    var endX = -(laneWidth + bubbleWidth + 24);
    var durationMs = ((laneWidth + bubbleWidth + 24) / FLOAT_SPEED) * 1000;

    var anim = {
      el: bubble,
      laneIdx: laneIdx,
      startX: 0,
      endX: endX,
      duration: durationMs,
      t0: 0,
      paused: false,
      pauseStart: 0,
      done: false,
      fallbackTimer: null
    };

    anim.fallbackTimer = window.setTimeout(function () {
      finishAnim(anim);
    }, durationMs + 1000);

    floatAnims.push(anim);
    bindBubbleHover(anim);
    startRafLoop();
    scheduleLaneFollow(laneIdx, bubbleWidth);
  }

  function startFloating(list) {
    currentList = list.slice();
    spawning = true;
    clearLaneTimers();
    clearFloatAnims();
    buildLanes();

    if (!currentList.length) {
      spawning = false;
      return;
    }

    laneEls.forEach(function (_, laneIdx) {
      scheduleLaneSpawn(laneIdx, randomBetween(LANE_START_MIN, LANE_START_MAX));
    });

    startWatchdog();
    startRafLoop();
  }

  function stopFloating() {
    spawning = false;
    clearLaneTimers();
    clearFloatAnims();
    stopWatchdog();
  }

  function renderBoard(list) {
    stopFloating();
    startFloating(list);
  }

  function fillEmptyLanes() {
    if (!spawning || !isSectionActive()) return;
    laneEls.forEach(function (_, laneIdx) {
      if (getLaneBubbleCount(laneIdx) === 0 && !laneNextTimer[laneIdx]) {
        scheduleLaneSpawn(laneIdx, randomBetween(0.2, 0.8));
      }
    });
    if (floatAnims.length) startRafLoop();
  }

  function startWatchdog() {
    stopWatchdog();
    watchdogTimer = window.setInterval(fillEmptyLanes, WATCHDOG_MS);
  }

  function stopWatchdog() {
    if (watchdogTimer) {
      window.clearInterval(watchdogTimer);
      watchdogTimer = null;
    }
  }

  function activateBoard() {
    if (!isSectionActive()) return;
    if (boardActive && spawning) {
      fillEmptyLanes();
      return;
    }
    boardActive = true;
    window.requestAnimationFrame(function () {
      window.requestAnimationFrame(function () {
        if (!isSectionActive()) return;
        renderBoard(loadMessages());
      });
    });
  }

  function deactivateBoard() {
    if (!boardActive && !spawning) return;
    boardActive = false;
    stopFloating();
    board.innerHTML = '';
    laneEls = [];
  }

  function deleteMessage(id) {
    var list = loadMessages().filter(function (msg) {
      return msg.id !== id;
    });
    saveMessages(list);
    removeBubblesById(id);
    currentList = list.slice();
    if (!currentList.length) {
      deactivateBoard();
      return;
    }
    fillEmptyLanes();
    showTip('已删除该条留言');
    window.setTimeout(function () { showTip(''); }, 2000);
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var nickname = (nicknameInput && nicknameInput.value || '').trim();
    var content = (contentInput && contentInput.value || '').trim();

    if (!nickname) {
      showTip('请输入昵称');
      if (nicknameInput) nicknameInput.focus();
      return;
    }

    if (!content) {
      showTip('请输入留言内容');
      if (contentInput) contentInput.focus();
      return;
    }

    showTip('');

    var list = loadMessages();
    var newMsg = {
      id: 'msg-' + Date.now(),
      nickname: nickname,
      content: content,
      createdAt: Date.now()
    };

    list.push(newMsg);
    saveMessages(list);
    currentList = list.slice();
    if (!spawning) {
      activateBoard();
    } else {
      fillEmptyLanes();
    }
    form.reset();
  });

  board.addEventListener('click', function (e) {
    var btn = e.target.closest('.message-delete');
    if (!btn) return;
    e.preventDefault();
    e.stopPropagation();
    var bubble = btn.closest('.message-bubble');
    if (!bubble) return;
    var id = bubble.getAttribute('data-id');
    if (id) deleteMessage(id);
  });

  window.addEventListener('resize', function () {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(function () {
      if (!isSectionActive()) return;
      renderBoard(currentList.length ? currentList : loadMessages());
    }, 250);
  });

  window.addEventListener('fullpage-section', function (e) {
    var detail = e.detail || {};
    if (detail.id === 'section-messages') {
      activateBoard();
    } else if (boardActive || spawning) {
      deactivateBoard();
    }
  });

  document.addEventListener('visibilitychange', function () {
    if (!document.hidden && isSectionActive()) {
      activateBoard();
    }
  });

  if (section) {
    if (typeof MutationObserver !== 'undefined') {
      var wasActive = section.classList.contains('active');
      var classObserver = new MutationObserver(function () {
        var isActive = section.classList.contains('active');
        if (isActive && !wasActive) activateBoard();
        else if (!isActive && wasActive) deactivateBoard();
        wasActive = isActive;
      });
      classObserver.observe(section, { attributes: true, attributeFilter: ['class'] });
    }

    if (typeof IntersectionObserver !== 'undefined') {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting && entry.intersectionRatio > 0.08 && isSectionActive()) {
            activateBoard();
          }
        });
      }, { threshold: [0, 0.08, 0.25] });
      io.observe(board);
    }

    if (section.classList.contains('active')) {
      activateBoard();
    }
  } else {
    startFloating(loadMessages());
  }
})();
