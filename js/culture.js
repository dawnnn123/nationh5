(function () {
  'use strict';

  var stage = document.getElementById('cultureStage');
  var content = document.getElementById('cultureContent');
  var menuLinks = document.querySelectorAll('.menu-link');
  var panels = document.querySelectorAll('.culture-panel');

  /* 与 culture.css 中背景图路径保持一致；改 CSS 时同步改这里 */
  var panelImages = {
    heritage: {
      top: 'images/23c96cd58605261a650f4138a75f7d68.jpg',
      bottom: 'images/3贵州威宁_撮泰吉1920_800_20231207002054A009.jpg'
    },
    festival: {
      top: 'images/23c96cd58605261a650f4138a75f7d68.jpg',
      bottom: 'images/W020260617676459657906.png'
    },
    art: {
      top: 'images/23c96cd58605261a650f4138a75f7d68.jpg',
      bottom: 'images/3a7af0261b7c05b5.jpg_r_720x480x95_37959cf1.jpg'
    }
  };

  function preloadPanelImages() {
    var seen = {};
    Object.keys(panelImages).forEach(function (panelId) {
      ['top', 'bottom'].forEach(function (part) {
        var src = panelImages[panelId][part];
        if (!src || seen[src]) return;
        seen[src] = true;
        var img = new Image();
        img.src = src;
      });
    });
  }

  preloadPanelImages();

  function switchPanel(panelId) {
    if (!stage || !panelId) return;

    stage.setAttribute('data-panel', panelId);

    menuLinks.forEach(function (link) {
      link.classList.toggle('active', link.getAttribute('data-panel') === panelId);
    });

    panels.forEach(function (panel) {
      panel.classList.toggle('is-active', panel.getAttribute('data-panel') === panelId);
    });

    if (content) content.scrollTop = 0;
  }

  menuLinks.forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      switchPanel(link.getAttribute('data-panel'));
    });
  });

  var hashMap = {
    heritage: 'heritage',
    festival: 'festival',
    art: 'art',
    'section-heritage': 'heritage',
    'section-festival': 'festival',
    'section-art': 'art'
  };

  var initial = hashMap[location.hash.slice(1)] || 'heritage';
  switchPanel(initial);
})();
