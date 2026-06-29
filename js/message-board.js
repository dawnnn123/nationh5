/**
 * 同心寄语留言板 — 独立轨道、随机错开、固定安全间距接力
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
  var LANE_START_MAX = 4.8;
  var LANE_RETRY_SEC = 0.16;

  function getLaneCount() {
    return window.matchMedia('(max-width: 768px)').matches ? 4 : 5;
  }

  var form = document.getElementById('messageForm');
  var board = document.getElementById('messageBoard');
  var tipEl = document.getElementById('messageTip');
  var nicknameInput = document.getElementById('messageNickname');
  var contentInput = document.getElementById('messageContent');

  if (!form || !board) return;

  var laneEls = [];
  var laneTimers = [];
  var laneNextTimer = [];
  var resizeTimer = null;
  var currentList = [];
  var spawning = false;

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
    } catch (e) { /* ignore quota errors */ }
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

  /** 前一条飘出足够间距后 spawn 下一条（秒） */
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
  }

  function trackLaneTimer(timer) {
    laneTimers.push(timer);
    return timer;
  }

  function spawnOnLane(laneIdx) {
    if (!spawning || !currentList.length) return;

    var laneEl = laneEls[laneIdx];
    if (!laneEl) return;

    if (getLaneBubbleCount(laneIdx) >= LANE_MAX) {
      scheduleLaneSpawn(laneIdx, LANE_RETRY_SEC);
      return;
    }

    var msg = pickRandomMessage(currentList);
    var bubble = createBubbleEl(msg, laneIdx);
    var laneWidth = laneEl.clientWidth || board.clientWidth || 640;

    laneEl.style.setProperty('--lane-width', laneWidth + 'px');
    laneEl.appendChild(bubble);

    var bubbleWidth = bubble.offsetWidth;
    var travel = laneWidth + bubbleWidth + 24;
    var duration = travel / FLOAT_SPEED;

    bubble.style.animationDuration = duration + 's';
    bubble.style.top = (50 + randomBetween(-7, 7)) + '%';

    scheduleLaneFollow(laneIdx, bubbleWidth);

    bubble.addEventListener('animationend', function () {
      removeBubble(bubble);
      if (getLaneBubbleCount(laneIdx) === 0 && !laneNextTimer[laneIdx]) {
        scheduleLaneSpawn(laneIdx, randomBetween(0.35, 0.9));
      }
    }, { once: true });
  }

  function startFloating(list) {
    currentList = list.slice();
    spawning = true;
    clearLaneTimers();
    buildLanes();

    if (!currentList.length) {
      spawning = false;
      return;
    }

    laneEls.forEach(function (_, laneIdx) {
      scheduleLaneSpawn(laneIdx, randomBetween(LANE_START_MIN, LANE_START_MAX));
    });
  }

  function stopFloating() {
    spawning = false;
    clearLaneTimers();
  }

  function renderBoard(list) {
    stopFloating();
    startFloating(list);
  }

  function fillEmptyLanes() {
    laneEls.forEach(function (_, laneIdx) {
      if (getLaneBubbleCount(laneIdx) === 0 && !laneNextTimer[laneIdx]) {
        scheduleLaneSpawn(laneIdx, randomBetween(0.25, 1.1));
      }
    });
  }

  function deleteMessage(id) {
    var list = loadMessages().filter(function (msg) {
      return msg.id !== id;
    });
    saveMessages(list);
    removeBubblesById(id);
    currentList = list.slice();
    if (!currentList.length) {
      stopFloating();
      board.innerHTML = '';
      laneEls = [];
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
      startFloating(list);
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
      renderBoard(currentList.length ? currentList : loadMessages());
    }, 200);
  });

  startFloating(loadMessages());
})();
