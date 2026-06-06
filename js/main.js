/* ============================================================
   共享 JS — 主题切换 + 导航 + 动画
   ============================================================ */

(function () {
  'use strict';

  // -------- Theme --------
  var THEME_KEY = 'museum-theme';
  var html = document.documentElement;

  function getTheme() {
    return localStorage.getItem(THEME_KEY) || 'dark';
  }

  function applyTheme(t) {
    html.setAttribute('data-theme', t);
    var btn = document.querySelector('.btn-theme');
    if (btn) btn.textContent = t === 'dark' ? '☀️' : '🌙';
    localStorage.setItem(THEME_KEY, t);
  }

  function toggleTheme() {
    applyTheme(getTheme() === 'dark' ? 'light' : 'dark');
  }

  // apply on load
  applyTheme(getTheme());

  // expose
  window.toggleTheme = toggleTheme;

  // -------- Navbar scroll --------
  var navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', function () {
      navbar.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });
  }

  // -------- Mobile menu --------
  window.toggleMenu = function () {
    var menu = document.getElementById('navMenu');
    if (menu) menu.classList.toggle('open');
  };

  // close menu on link click
  document.addEventListener('click', function (e) {
    if (e.target.closest('.nav-menu a')) {
      var menu = document.getElementById('navMenu');
      if (menu) menu.classList.remove('open');
    }
  });

  // -------- Hero flip --------
  var flipTrack = document.getElementById('heroFlipTrack');
  if (flipTrack) {
    var items = flipTrack.querySelectorAll('.hero-flip-item');
    var total = items.length;
    var idx = 0;

    function getItemH() {
      return items[0] ? items[0].offsetHeight : 56;
    }

    function flipNext() {
      idx = (idx + 1) % total;
      flipTrack.style.transform = 'translateY(-' + (idx * getItemH()) + 'px)';
    }

    var flipInterval = setInterval(flipNext, 3500);

    window.addEventListener('resize', function () {
      flipTrack.style.transform = 'translateY(-' + (idx * getItemH()) + 'px)';
    });
  }

  // -------- Scroll fade-in --------
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.06, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.fade-in, .fade-in-scale').forEach(function (el) {
    observer.observe(el);
  });

  // -------- Active nav link (index page) --------
  var sections = document.querySelectorAll('section[id]');
  if (sections.length > 0) {
    var navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
    var sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          navLinks.forEach(function (a) {
            a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id);
          });
        }
      });
    }, { threshold: 0.3 });
    sections.forEach(function (s) { sectionObserver.observe(s); });
  }

  // -------- Announcement card modal --------
  document.querySelectorAll('.announce-card').forEach(function (card) {
    card.addEventListener('click', function (e) {
      // don't trigger when clicking internal links
      if (e.target.closest('a')) return;
      var title = card.querySelector('.announce-card-title');
      var desc  = card.querySelector('.announce-card-desc');
      var date  = card.querySelector('.announce-card-date');
      var tag   = card.querySelector('.announce-card-tag');
      var src   = card.querySelector('.announce-card-footer');
      var titleText = title ? title.textContent : '';
      var descText  = desc  ? desc.textContent  : '';
      var dateText  = date ? date.textContent  : '';
      var tagText   = tag  ? tag.textContent   : '';
      var tagClass  = tag  ? tag.className.replace('announce-card-tag', '').trim() : '';
      var srcText   = src  ? src.textContent.replace(/^\\s*📌\\s*/, '').trim() : '';

      // build overlay
      var overlay = document.createElement('div');
      overlay.className = 'announce-modal-overlay';

      var box = document.createElement('div');
      box.className = 'announce-modal-box';

      box.innerHTML =
        '<button class=\"announce-modal-close\" title=\"关闭\">&times;</button>' +
        '<div class=\"announce-modal-header\">' +
          '<span class=\"announce-card-tag ' + tagClass + '\">' + tagText + '</span>' +
          '<span class=\"announce-modal-date\">' + dateText + '</span>' +
        '</div>' +
        '<h3 class=\"announce-modal-title\">' + titleText + '</h3>' +
        '<div class=\"announce-modal-body\">' + descText + '</div>' +
        '<div class=\"announce-modal-footer\"><span>📌</span> 发布部门：' + srcText + '</div>';

      overlay.appendChild(box);

      function close() {
        if (overlay.parentNode) {
          overlay.classList.remove('active');
          setTimeout(function () {
            if (overlay.parentNode) document.body.removeChild(overlay);
          }, 280);
        }
      }

      overlay.addEventListener('click', function (ev) {
        if (ev.target === overlay) close();
      });
      box.querySelector('.announce-modal-close').addEventListener('click', close);
      document.addEventListener('keydown', function escHandler(ev) {
        if (ev.key === 'Escape') { close(); document.removeEventListener('keydown', escHandler); }
      });

      document.body.appendChild(overlay);
      // trigger animation
      requestAnimationFrame(function () { overlay.classList.add('active'); });
    });
  });

  // -------- Gallery lightbox (simple) --------
  document.querySelectorAll('.gallery-item[data-src]').forEach(function (item) {
    item.addEventListener('click', function () {
      var src = item.getAttribute('data-src');
      var overlay = document.createElement('div');
      overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.88);z-index:9999;display:flex;align-items:center;justify-content:center;cursor:zoom-out;';
      var img = document.createElement('img');
      img.src = src;
      img.style.cssText = 'max-width:90vw;max-height:90vh;border-radius:12px;box-shadow:0 20px 60px rgba(0,0,0,0.7);';
      overlay.appendChild(img);
      overlay.addEventListener('click', function () { document.body.removeChild(overlay); });
      document.body.appendChild(overlay);
    });
  });

})();
