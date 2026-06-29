/**
 * 全站移动端导航
 */
(function () {
  'use strict';

  var btn = document.getElementById('navToggle');
  var nav = document.getElementById('mainNav');
  if (!btn || !nav) return;

  function setOpen(open) {
    nav.classList.toggle('is-open', open);
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    btn.setAttribute('aria-label', open ? '关闭导航菜单' : '打开导航菜单');
    document.body.classList.toggle('nav-open', open);
  }

  btn.addEventListener('click', function (e) {
    e.stopPropagation();
    setOpen(!nav.classList.contains('is-open'));
  });

  document.addEventListener('click', function (e) {
    if (!nav.classList.contains('is-open')) return;
    if (nav.contains(e.target) || btn.contains(e.target)) return;
    setOpen(false);
  });

  nav.addEventListener('click', function (e) {
    e.stopPropagation();
  });

  nav.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      setOpen(false);
    });
  });

  window.addEventListener('resize', function () {
    if (window.innerWidth > 768) {
      setOpen(false);
    }
  });
})();
