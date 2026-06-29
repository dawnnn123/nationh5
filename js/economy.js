(function () {
  'use strict';

  var stage = document.getElementById('economyStage');
  var menuLinks = document.querySelectorAll('.economy-menu .menu-link');
  var panels = document.querySelectorAll('.economy-panel');

  /* 与 economy.css 上方图片路径保持一致 */
  var panelImages = {
    industry: 'images/截屏2026-06-27 19.59.33.png',
    prosper: 'images/economy-prosper.jpg',
    aid: 'images/economy-aid.jpg'
  };

  function preloadImages() {
    Object.keys(panelImages).forEach(function (key) {
      var img = new Image();
      img.src = panelImages[key];
    });
  }

  preloadImages();

  function switchPanel(panelId) {
    if (!stage || !panelId) return;

    stage.setAttribute('data-panel', panelId);

    menuLinks.forEach(function (link) {
      link.classList.toggle('active', link.getAttribute('data-panel') === panelId);
    });

    panels.forEach(function (panel) {
      panel.classList.toggle('is-active', panel.getAttribute('data-panel') === panelId);
    });
  }

  menuLinks.forEach(function (link) {
    link.addEventListener('mouseenter', function () {
      switchPanel(link.getAttribute('data-panel'));
    });

    link.addEventListener('click', function (e) {
      e.preventDefault();
      switchPanel(link.getAttribute('data-panel'));
    });
  });

  switchPanel('industry');
})();
