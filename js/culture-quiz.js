/**
 * 文化页 · 趣味问答
 */
(function () {
  'use strict';

  var form = document.getElementById('cultureQuizForm');
  var resultEl = document.getElementById('cultureQuizResult');
  var reviewEl = document.getElementById('quizReview');
  var scoreBoxEl = document.getElementById('quizScoreBox');
  var scoreNumEl = document.getElementById('quizScoreNum');
  var scoreTotalEl = document.getElementById('quizScoreTotal');
  var tipEl = document.getElementById('cultureQuizTip');
  var shareHintEl = document.getElementById('shareHint');
  var shareQQBtn = document.getElementById('shareQQ');
  var shareWechatBtn = document.getElementById('shareWechat');
  var retakeBtn = document.getElementById('quizRetake');
  var badgeScene = document.getElementById('quizBadgeScene');
  var badgeRotator = document.getElementById('quizBadgeRotator');
  var badgeShowcase = document.querySelector('.quiz-badge-showcase');

  var badgeMedalEl = document.getElementById('quizBadgeMedal');
  var badgeShowcaseTitle = document.getElementById('quizBadgeShowcaseTitle');
  var quizBadgeEl = document.getElementById('quizBadge');
  var quizBadgeLabel = document.getElementById('quizBadgeLabel');
  var quizBadgeName = document.getElementById('quizBadgeName');
  var goldModal = document.getElementById('quizGoldModal');
  var goldModalClose = document.getElementById('quizGoldModalClose');
  var goldModalBackdrop = document.getElementById('quizGoldModalBackdrop');

  if (!form || !resultEl) return;

  var questions = [
    {
      text: '我国共有多少个民族？',
      options: { A: '54', B: '55', C: '56', D: '57' },
      answer: 'C',
      explain: '我国是统一的多民族国家，共有56个民族，其中汉族人口最多，其余55个为少数民族。'
    },
    {
      text: '“像石榴籽一样紧紧抱在一起”体现的是哪种精神？',
      options: { A: '民族团结', B: '经济发展', C: '文化自信' },
      answer: 'A',
      explain: '这句话生动比喻各民族像石榴籽一样密不可分、紧紧相依，集中体现了民族团结的精神内涵。'
    },
    {
      text: '以下哪个是中华民族的传统美德？',
      options: { A: '各管各的', B: '守望相助', C: '以邻为壑' },
      answer: 'B',
      explain: '守望相助是中华民族崇尚的传统美德，体现了邻里互助、和睦相处、同舟共济的价值追求。'
    },
    {
      text: '“全面建成小康社会，一个民族都不能少”体现了我国在处理民族问题时坚持的哪一项基本原则？',
      options: {
        A: '民族区域自治制度',
        B: '各民族共同繁荣发展',
        C: '民族平等和民族团结',
        D: '各民族语言文字平等'
      },
      answer: 'B',
      explain: '这句话强调在全面建设小康社会进程中，不让任何一个民族掉队，体现了各民族共同繁荣发展的基本原则。'
    },
    {
      text: '“石榴籽”精神的核心内涵是——',
      options: {
        A: '各民族保持各自独立的文化传统',
        B: '各民族像石榴籽一样紧紧抱在一起，手足相亲、守望相助',
        C: '各民族在经济发展上相互依赖',
        D: '各民族使用同一种语言文字'
      },
      answer: 'B',
      explain: '“石榴籽”精神比喻各民族像石榴籽一样紧紧抱在一起，手足相亲、守望相助，是对民族团结最生动形象的表达。'
    }
  ];

  var lastScore = 0;
  var isPerfectScore = false;
  var badgeName = '白银徽章';

  if (scoreTotalEl) scoreTotalEl.textContent = String(questions.length);

  function setBadgeUnlocked(unlocked) {
    if (!badgeShowcase) return;
    badgeShowcase.classList.toggle('is-unlocked', unlocked);
  }

  function setBadgeTier(tier) {
    if (badgeMedalEl) {
      badgeMedalEl.classList.remove('is-gold', 'is-silver');
      badgeMedalEl.classList.add(tier === 'gold' ? 'is-gold' : 'is-silver');
    }
    if (badgeShowcase) {
      badgeShowcase.classList.remove('is-gold-tier', 'is-silver-tier');
      badgeShowcase.classList.add(tier === 'gold' ? 'is-gold-tier' : 'is-silver-tier');
    }
    if (badgeShowcaseTitle) {
      badgeShowcaseTitle.textContent = tier === 'gold' ? '黄金徽章' : '白银徽章';
    }
  }

  function updateResultBadge(perfect) {
    if (!quizBadgeEl) return;
    quizBadgeEl.classList.remove('is-gold-tier', 'is-silver-tier');
    if (perfect) {
      quizBadgeEl.classList.add('is-gold-tier');
      if (quizBadgeLabel) quizBadgeLabel.textContent = '恭喜获得';
      if (quizBadgeName) quizBadgeName.textContent = '黄金徽章';
      badgeName = '黄金徽章';
    } else {
      quizBadgeEl.classList.add('is-silver-tier');
      if (quizBadgeLabel) quizBadgeLabel.textContent = '当前徽章';
      if (quizBadgeName) quizBadgeName.textContent = '白银徽章';
      badgeName = '白银徽章';
    }
  }

  function showGoldModal() {
    if (!goldModal) return;
    goldModal.hidden = false;
    document.body.style.overflow = 'hidden';
  }

  function closeGoldModal() {
    if (!goldModal) return;
    goldModal.hidden = true;
    document.body.style.overflow = '';
  }

  function createBadge3dController(scene, rotator, medal) {
    if (!scene || !rotator) return null;

    var rotX = -12;
    var rotY = 0;
    var dragging = false;
    var pointerId = null;
    var lastX = 0;
    var lastY = 0;
    var idleTimer = null;
    var idleFrame = null;
    var idleStart = 0;

    var ROT_Y_MIN = -58;
    var ROT_Y_MAX = 58;
    var ROT_X_MIN = -32;
    var ROT_X_MAX = 44;

    function clampRotation() {
      rotY = Math.max(ROT_Y_MIN, Math.min(ROT_Y_MAX, rotY));
      rotX = Math.max(ROT_X_MIN, Math.min(ROT_X_MAX, rotX));
    }

    var thicknessEl = medal ? medal.querySelector('.quiz-badge-thickness') : null;

    function thicknessRamp(value, start, end) {
      if (value <= start) return 0;
      if (value >= end) return 1;
      return (value - start) / (end - start);
    }

    function updateThicknessMask(radX, radY) {
      if (!thicknessEl) return;

      var rotXDeg = radX * 180 / Math.PI;
      var rotYDeg = radY * 180 / Math.PI;
      var vx = -rotYDeg;
      var vy = rotXDeg > 0 ? rotXDeg : -rotXDeg;
      var tiltMag = Math.sqrt(vx * vx + vy * vy);
      var fromAbove = rotXDeg > 6 && Math.abs(rotYDeg) < Math.max(10, Math.abs(rotXDeg) * 0.75);

      if (tiltMag < 3 && !fromAbove) {
        thicknessEl.style.opacity = '0';
        thicknessEl.style.webkitMaskImage = 'none';
        thicknessEl.style.maskImage = 'none';
        return;
      }

      var cssAngle = (Math.atan2(vy, vx) * 180 / Math.PI + 90 + 360) % 360;
      var faceOn = Math.cos(radX) * Math.cos(radY);
      var tilt = thicknessRamp(1 - faceOn, 0.04, 0.38) * thicknessRamp(tiltMag, 3, 22);
      var vertShare = Math.abs(rotXDeg) / (tiltMag + 0.001);
      var halfArc = 78;
      var soft = 16;
      var mask;

      if (fromAbove) {
        var aboveStrength = thicknessRamp(rotXDeg, 6, 38);
        tilt = Math.min(1, 0.82 + aboveStrength * 0.18);
        mask = 'linear-gradient(to bottom, transparent 34%, rgba(0,0,0,0.35) 42%, black 48%, black 100%)';
        thicknessEl.style.webkitMaskImage = mask;
        thicknessEl.style.maskImage = mask;
        thicknessEl.style.opacity = String(tilt);
        return;
      }

      if (vertShare > 0.45) {
        tilt = Math.min(1, tilt * (1 + vertShare * 0.65));
        halfArc = 78 + vertShare * 28;
      }

      var fromAngle = (cssAngle - halfArc + 360) % 360;
      var inner = soft;
      var outer = halfArc * 2 - soft;
      mask = 'conic-gradient(from ' + fromAngle.toFixed(2) + 'deg at 50% 50%, ' +
        'transparent 0deg, rgba(0,0,0,0.25) ' + inner + 'deg, black ' + (inner + 10) + 'deg, ' +
        'black ' + (outer - 10) + 'deg, rgba(0,0,0,0.25) ' + outer + 'deg, ' +
        'transparent ' + (halfArc * 2) + 'deg)';

      thicknessEl.style.webkitMaskImage = mask;
      thicknessEl.style.maskImage = mask;
      thicknessEl.style.opacity = String(Math.min(1, tilt));
    }

    function updateLighting() {
      if (!medal) return;

      var radX = rotX * Math.PI / 180;
      var radY = rotY * Math.PI / 180;
      var lightX = 74 - rotY * (48 / ROT_Y_MAX);
      var lightY = 14 - (rotX + 12) * 2.4 + rotY * (14 / ROT_Y_MAX);

      lightX = Math.max(6, Math.min(94, lightX));
      lightY = Math.max(6, Math.min(86, lightY));

      var lx = 0.68;
      var ly = -0.58;
      var lz = 0.48;
      var sinX = Math.sin(radX);
      var cosX = Math.cos(radX);
      var sinY = Math.sin(radY);
      var cosY = Math.cos(radY);
      var nx = sinY * cosX;
      var ny = -cosY * sinX;
      var nz = cosY * cosX;
      var dotNL = nx * lx + ny * ly + nz * lz;
      dotNL = Math.max(-1, Math.min(1, dotNL));

      var lightStrength = 0.45 + Math.max(0, dotNL) * 0.55;
      if (lightStrength > 1) lightStrength = 1;
      var u = (lightX - 50) / 50;
      var v = (lightY - 50) / 50;

      medal.style.setProperty('--light-x', lightX.toFixed(1) + '%');
      medal.style.setProperty('--light-y', lightY.toFixed(1) + '%');
      medal.style.setProperty('--light-strength', lightStrength.toFixed(2));
      medal.style.setProperty('--shadow-x', (-u * 12).toFixed(1) + 'px');
      medal.style.setProperty('--shadow-y', (8 + v * 8).toFixed(1) + 'px');
      updateThicknessMask(radX, radY);
    }

    function applyRotation() {
      clampRotation();
      rotator.style.transform =
        'rotateX(' + rotX + 'deg) rotateY(' + rotY + 'deg)';
      updateLighting();
    }

    function stopIdleSpin() {
      if (idleFrame) {
        cancelAnimationFrame(idleFrame);
        idleFrame = null;
      }
    }

    function startIdleSpin() {
      if (dragging) return;
      stopIdleSpin();
      idleStart = performance.now();

      function tick(now) {
        if (dragging) return;
        var t = (now - idleStart) / 1000;
        rotY = Math.sin(t * 0.75) * 42;
        rotX = -12 + Math.sin(t * 0.55) * 10;
        applyRotation();
        idleFrame = requestAnimationFrame(tick);
      }

      idleFrame = requestAnimationFrame(tick);
    }

    function scheduleIdleSpin() {
      if (idleTimer) window.clearTimeout(idleTimer);
      idleTimer = window.setTimeout(startIdleSpin, 2200);
    }

    function onPointerDown(e) {
      if (e.button !== undefined && e.button !== 0) return;
      dragging = true;
      pointerId = e.pointerId;
      lastX = e.clientX;
      lastY = e.clientY;
      scene.classList.add('is-dragging');
      stopIdleSpin();
      if (scene.setPointerCapture) {
        scene.setPointerCapture(e.pointerId);
      }
    }

    function onPointerMove(e) {
      if (!dragging || e.pointerId !== pointerId) return;
      var dx = e.clientX - lastX;
      var dy = e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;
      rotY += dx * 0.4;
      rotX -= dy * 0.32;
      applyRotation();
    }

    function onPointerUp(e) {
      if (!dragging || e.pointerId !== pointerId) return;
      dragging = false;
      pointerId = null;
      scene.classList.remove('is-dragging');
      if (scene.releasePointerCapture) {
        try { scene.releasePointerCapture(e.pointerId); } catch (err) { /* ignore */ }
      }
      scheduleIdleSpin();
    }

    scene.addEventListener('pointerdown', onPointerDown);
    scene.addEventListener('pointermove', onPointerMove);
    scene.addEventListener('pointerup', onPointerUp);
    scene.addEventListener('pointercancel', onPointerUp);

    applyRotation();
    scheduleIdleSpin();
    return { applyRotation: applyRotation };
  }

  createBadge3dController(
    badgeScene,
    badgeRotator,
    badgeMedalEl
  );
  createBadge3dController(
    document.getElementById('quizGoldModalScene'),
    document.getElementById('quizGoldModalRotator'),
    document.getElementById('quizGoldModalMedal')
  );

  setBadgeUnlocked(true);
  setBadgeTier('silver');

  function getOptionLabel(q, key) {
    return key + '. ' + q.options[key];
  }

  function buildShareText(score) {
    var tierText = isPerfectScore ? '黄金徽章' : '白银徽章';
    return '我在「民族同心馆」完成了民族文化趣味问答，得分 ' +
      score + '/' + questions.length +
      '，获得了「' + tierText + '」！快来试试吧！';
  }

  function showHint(msg) {
    if (!shareHintEl) return;
    shareHintEl.textContent = msg;
    shareHintEl.hidden = false;
    window.setTimeout(function () {
      shareHintEl.hidden = true;
    }, 3500);
  }

  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text);
    }

    return new Promise(function (resolve, reject) {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.left = '-9999px';
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand('copy') ? resolve() : reject();
      } catch (e) {
        reject(e);
      }
      document.body.removeChild(ta);
    });
  }

  function resetQuiz() {
    form.reset();
    form.hidden = false;
    resultEl.hidden = true;
    if (tipEl) tipEl.hidden = true;
    if (shareHintEl) shareHintEl.hidden = true;
    if (scoreBoxEl) scoreBoxEl.classList.remove('is-perfect');
    if (reviewEl) reviewEl.innerHTML = '';
    setBadgeTier('silver');
    closeGoldModal();
    isPerfectScore = false;
    lastScore = 0;
    form.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var unanswered = questions.some(function (_, i) {
      return !form.querySelector('input[name="q' + i + '"]:checked');
    });

    if (unanswered) {
      if (tipEl) tipEl.hidden = false;
      return;
    }

    if (tipEl) tipEl.hidden = true;

    var score = 0;
    var html = '';

    questions.forEach(function (q, i) {
      var selected = form.querySelector('input[name="q' + i + '"]:checked');
      var userAns = selected ? selected.value : '';
      var isCorrect = userAns === q.answer;

      if (isCorrect) score += 1;

      html += '<div class="quiz-review-item ' + (isCorrect ? 'is-correct' : 'is-wrong') + '">' +
        '<p class="quiz-review-q">' + (i + 1) + '. ' + q.text + '</p>' +
        '<p class="quiz-review-ans">你的答案：' +
        (userAns ? getOptionLabel(q, userAns) : '未作答') +
        ' · ' + (isCorrect ? '✓ 回答正确' : '✗ 回答错误') + '</p>' +
        '<p class="quiz-review-ans">正确答案：<em>' + getOptionLabel(q, q.answer) + '</em></p>' +
        '<p class="quiz-review-exp">解析：' + q.explain + '</p>' +
        '</div>';
    });

    lastScore = score;
    isPerfectScore = score === questions.length;
    if (scoreNumEl) scoreNumEl.textContent = String(score);
    if (scoreTotalEl) scoreTotalEl.textContent = String(questions.length);
    if (reviewEl) reviewEl.innerHTML = html;

    if (scoreBoxEl) {
      scoreBoxEl.classList.toggle('is-perfect', isPerfectScore);
    }

    updateResultBadge(isPerfectScore);
    setBadgeTier(isPerfectScore ? 'gold' : 'silver');
    if (isPerfectScore && badgeShowcase) {
      badgeShowcase.classList.add('is-gold-upgrade');
      window.setTimeout(function () {
        badgeShowcase.classList.remove('is-gold-upgrade');
      }, 800);
    }
    form.hidden = true;
    resultEl.hidden = false;

    if (isPerfectScore) {
      showGoldModal();
    } else {
      closeGoldModal();
    }

    resultEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  if (goldModalClose) {
    goldModalClose.addEventListener('click', closeGoldModal);
  }
  if (goldModalBackdrop) {
    goldModalBackdrop.addEventListener('click', closeGoldModal);
  }

  if (retakeBtn) {
    retakeBtn.addEventListener('click', resetQuiz);
  }

  if (shareQQBtn) {
    shareQQBtn.addEventListener('click', function () {
      var pageUrl = window.location.href.split('#')[0];
      var title = '民族文化趣味问答 · 民族同心馆';
      var summary = buildShareText(lastScore) + ' ' + pageUrl;
      var shareUrl = 'https://connect.qq.com/widget/shareqq/index.html?' +
        'url=' + encodeURIComponent(pageUrl) +
        '&title=' + encodeURIComponent(title) +
        '&summary=' + encodeURIComponent(summary);

      window.open(shareUrl, '_blank', 'width=720,height=480,noopener');
    });
  }

  if (shareWechatBtn) {
    shareWechatBtn.addEventListener('click', function () {
      var pageUrl = window.location.href.split('#')[0];
      var text = buildShareText(lastScore) + '\n' + pageUrl;

      copyText(text).then(function () {
        showHint('分享内容已复制，请打开微信粘贴发送给好友或分享到朋友圈');
      }).catch(function () {
        showHint('请手动复制链接分享：' + pageUrl);
      });
    });
  }
})();
