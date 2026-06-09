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

  // -------- Hospital age auto-calc --------
  // Read founding year from admin settings if available, else default 1991
  var hmSettings = {};
  try { hmSettings = JSON.parse(localStorage.getItem('hm_settings') || '{}'); } catch(e) {}
  var FOUNDED_YEAR = hmSettings.foundedYear || 1991;
  var nowYear = new Date().getFullYear();
  var hospitalAge = nowYear - FOUNDED_YEAR;

  // Fill all .hospital-age spans
  document.querySelectorAll('.hospital-age').forEach(function (el) {
    el.textContent = '' + hospitalAge;
  });

  // Fill all .hospital-year-now spans
  document.querySelectorAll('.hospital-year-now').forEach(function (el) {
    el.textContent = '' + nowYear;
  });

  // Also update meta description
  var metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc && hospitalAge) {
    metaDesc.setAttribute('content',
      metaDesc.getAttribute('content').replace(/\d+年/, hospitalAge + '\u5E74'));
  }

  // -------- Content from localStorage (CMS) --------
  var hmContent = {};
  try { hmContent = JSON.parse(localStorage.getItem('hm_content') || '{}'); } catch(e) {}

  // Detect current page section
  function getCurrentSection() {
    var path = window.location.pathname;
    var map = {
      '01-history': 'history', '02-people': 'people', '03-disciplines': 'disciplines',
      '04-campus': 'campus', '05-education': 'education', '06-culture': 'culture',
      '07-tech': 'tech', '08-duty': 'duty', '09-honors': 'honors',
      '10-vision': 'vision', '11-structure': 'structure', '12-leadership': 'leadership'
    };
    for (var k in map) { if (path.indexOf(k) >= 0) return hmContent[map[k]]; }
    return null;
  }

  var sectionContent = getCurrentSection();
  if (sectionContent) {
    // ---- Hero ----
    if (sectionContent.hero) {
      var h = sectionContent.hero;
      var heroBg = document.querySelector('.page-hero-bg');
      if (heroBg && h.bgImage) heroBg.setAttribute('src', h.bgImage);
      var heroNum = document.querySelector('.page-hero-num');
      if (heroNum && h.num) heroNum.textContent = h.num;
      var heroTitle = document.querySelector('.page-hero-title');
      if (heroTitle && h.title) heroTitle.textContent = h.title;
      var heroSub = document.querySelector('.page-hero-sub');
      if (heroSub && h.subtitle) heroSub.textContent = h.subtitle;
      var heroDesc = document.querySelector('.page-hero-desc');
      if (heroDesc && h.desc) heroDesc.textContent = h.desc;
    }

    // ---- Timeline (history) ----
    if (Array.isArray(sectionContent.timeline) && sectionContent.timeline.length > 0) {
      var tlContainer = document.querySelector('.timeline');
      if (tlContainer) {
        var tlHTML = '';
        sectionContent.timeline.forEach(function(t, i) {
          var side = i % 2 === 0 ? 'left' : 'right';
          if (side === 'left') {
            tlHTML += '<div class="tl-node left"><div class="tl-content fade-in"><div class="tl-year">' + esc(t.year) + '</div><div class="tl-title">' + esc(t.title) + '</div><p class="tl-desc">' + esc(t.desc) + '</p></div><div class="tl-dot-col"><div class="tl-dot">' + esc(t.dot||'●') + '</div></div><div></div></div>';
          } else {
            tlHTML += '<div class="tl-node right"><div></div><div class="tl-dot-col"><div class="tl-dot">' + esc(t.dot||'●') + '</div></div><div class="tl-content fade-in"><div class="tl-year">' + esc(t.year) + '</div><div class="tl-title">' + esc(t.title) + '</div><p class="tl-desc">' + esc(t.desc) + '</p></div></div>';
          }
        });
        tlContainer.innerHTML = tlHTML;
      }
    }

    // ---- Content Blocks ----
    if (Array.isArray(sectionContent.blocks) && sectionContent.blocks.length > 0) {
      var blockHeaders = document.querySelectorAll('.block-header');
      var contentPairs = document.querySelectorAll('.content-pair');
      var imgSlots = document.querySelectorAll('.img-slot');

      sectionContent.blocks.forEach(function(b, i) {
        // Update block header
        if (blockHeaders[i]) {
          var bh = blockHeaders[i];
          var numEl = bh.querySelector('.block-num');
          var titleEl = bh.querySelector('.block-title');
          var subEl = bh.querySelector('.block-sub');
          if (numEl && b.num) numEl.textContent = b.num;
          if (titleEl && b.title) titleEl.textContent = b.title;
          if (subEl && b.subtitle) subEl.textContent = b.subtitle;
        }
        // Update content text
        if (contentPairs[i]) {
          var ct = contentPairs[i].querySelector('.content-text');
          if (ct && b.text) ct.innerHTML = b.text;
        }
        // Update image slot
        if (imgSlots[i]) {
          var is = imgSlots[i];
          var iconEl = is.querySelector('.img-slot-icon');
          var labelEl = is.querySelector('.img-slot-label');
          var sizeEl = is.querySelector('.img-slot-size');
          if (iconEl && b.imgIcon) iconEl.textContent = b.imgIcon;
          if (labelEl && b.imgLabel) labelEl.innerHTML = b.imgLabel;
          if (sizeEl && b.imgSize) sizeEl.textContent = b.imgSize;
          // 若提供了真实图片URL，替换占位div为实际img
          if (b.imgUrl) {
            var existImg = is.querySelector('img.slot-real-img');
            if (!existImg) {
              existImg = document.createElement('img');
              existImg.className = 'slot-real-img';
              existImg.style.cssText = 'width:100%;height:100%;object-fit:cover;border-radius:inherit;position:absolute;top:0;left:0;';
              is.style.position = 'relative';
              is.appendChild(existImg);
            }
            existImg.src = b.imgUrl;
            existImg.alt = b.imgLabel || '';
            // 隐藏占位内容（图标/标签/尺寸文字）
            [iconEl, labelEl, sizeEl].forEach(function(el) { if (el) el.style.display = 'none'; });
          }
        }
      });
    }

    // ---- Leaders (院长/书记) ----
    if (Array.isArray(sectionContent.leaders) && sectionContent.leaders.length > 0) {
      // Only for people section — match leader-card elements
      var leaderCards = document.querySelectorAll('.leader-card');
      if (leaderCards.length > 0) {
        var deans = sectionContent.leaders.filter(function(l) { return l.category === '院长'; });
        var secretaries = sectionContent.leaders.filter(function(l) { return l.category === '书记'; });
        var allLeaders = deans.concat(secretaries);
        leaderCards.forEach(function(card, i) {
          if (allLeaders[i]) {
            var l = allLeaders[i];
            var nameEl = card.querySelector('.leader-name');
            var yearsEl = card.querySelector('.leader-years');
            var eraEl = card.querySelector('.leader-era');
            var descEl = card.querySelector('.leader-desc');
            if (nameEl) nameEl.textContent = l.name;
            if (yearsEl) yearsEl.textContent = l.years;
            if (eraEl) eraEl.textContent = l.era;
            if (descEl) descEl.textContent = l.desc;
          }
        });
      }
      // For 12-leadership section — match leadership-card elements
      var lshipCards = document.querySelectorAll('.leadership-card');
      if (lshipCards.length > 0) {
        lshipCards.forEach(function(card, i) {
          if (sectionContent.leaders[i]) {
            var l = sectionContent.leaders[i];
            var nameEl = card.querySelector('.leadership-name');
            var roleEl = card.querySelector('.leadership-role');
            var dutyEl = card.querySelector('.leadership-responsibility');
            var resumeEl = card.querySelector('.leadership-resume');
            if (nameEl) nameEl.textContent = l.name;
            if (roleEl) roleEl.textContent = l.role;
            if (dutyEl) dutyEl.textContent = l.duty;
            if (resumeEl) resumeEl.textContent = l.resume;
          }
        });
      }
    }

    // ---- Profiles (人物简介) ----
    ['profiles','profiles2'].forEach(function(group) {
      if (Array.isArray(sectionContent[group])) {
        var cards = document.querySelectorAll('.profile-card');
        // Find the right subset of cards for this group
        var offset = group === 'profiles2' ? (sectionContent.profiles ? sectionContent.profiles.length : 0) : 0;
        sectionContent[group].forEach(function(p, i) {
          var card = cards[offset + i];
          if (!card) return;
          var nameEl = card.querySelector('.profile-name');
          var titleEl = card.querySelector('.profile-title');
          var deptEl = card.querySelector('.profile-dept');
          var descEl = card.querySelector('.profile-desc');
          if (nameEl) nameEl.textContent = p.name;
          if (titleEl) titleEl.textContent = p.title;
          if (deptEl) deptEl.textContent = p.dept;
          if (descEl) descEl.textContent = p.desc;
        });
      }
    });

    // ---- Data Cards ----
    if (Array.isArray(sectionContent.dataCards) && sectionContent.dataCards.length > 0) {
      var dcContainers = document.querySelectorAll('.data-grid, .matrix-grid, .people-stats-banner');
      dcContainers.forEach(function(container) {
        var cards = container.querySelectorAll('.data-card, .matrix-item, .people-stat');
        cards.forEach(function(card, i) {
          if (sectionContent.dataCards[i]) {
            var d = sectionContent.dataCards[i];
            var valEl = card.querySelector('.data-card-value, .matrix-num, span');
            var labelEl = card.querySelector('.data-card-label, label, .matrix-label');
            var noteEl = card.querySelector('.data-card-note, small');
            if (valEl) valEl.textContent = d.value;
            if (labelEl) labelEl.textContent = d.label;
            if (noteEl && d.note) noteEl.textContent = d.note;
          }
        });
      });
    }

    // ---- Gallery ----
    if (Array.isArray(sectionContent.gallery) && sectionContent.gallery.length > 0) {
      var galleryGrid = document.querySelector('.gallery-grid');
      if (galleryGrid) {
        var gHTML = '';
        sectionContent.gallery.forEach(function(g, i) {
          var stagger = ((i % 4) + 1);
          if (g.url) {
            // 有真实图片/资料URL：渲染为可点击的图片卡片
            var isImg = /\.(jpg|jpeg|png|gif|webp|svg|bmp)(\?.*)?$/i.test(g.url);
            if (isImg) {
              // 图片：显示真实图片缩略图，支持 lightbox 点击放大
              gHTML += '<div class="gallery-item fade-in stagger-' + stagger + '" data-src="' + esc(g.url) + '" style="cursor:zoom-in;padding:0;overflow:hidden;">' +
                '<img src="' + esc(g.url) + '" alt="' + esc(g.label) + '" style="width:100%;height:180px;object-fit:cover;border-radius:inherit;" onerror="this.style.display=\'none\';this.nextSibling.style.display=\'flex\'">' +
                '<div style="display:none;align-items:center;justify-content:center;height:180px;font-size:2.5rem;">' + esc(g.icon || '📷') + '</div>' +
                '<div class="gallery-item-label" style="padding:8px 12px;">' + esc(g.label) + '</div></div>';
            } else {
              // 文件/资料：显示下载图标，点击跳转
              gHTML += '<a class="gallery-item fade-in stagger-' + stagger + '" href="' + esc(g.url) + '" target="_blank" rel="noopener" style="text-decoration:none;">' +
                '<div class="gallery-item-icon" style="font-size:2.5rem;">' + esc(g.icon || '📄') + '</div>' +
                '<div class="gallery-item-label">' + esc(g.label) + '</div>' +
                '<div style="font-size:10px;color:var(--text-muted,#888);margin-top:4px;word-break:break-all;padding:0 8px;">🔗 ' + esc(g.url.replace(/^https?:\/\//, '').substring(0, 40)) + (g.url.length > 50 ? '…' : '') + '</div></a>';
            }
          } else {
            // 无URL：显示占位 Emoji（原有逻辑）
            gHTML += '<div class="gallery-item fade-in stagger-' + stagger + '"><div class="gallery-item-icon">' + esc(g.icon) + '</div><div class="gallery-item-label">' + esc(g.label) + '</div></div>';
          }
        });
        galleryGrid.innerHTML = gHTML;

        // 重新绑定图片 lightbox 事件
        galleryGrid.querySelectorAll('.gallery-item[data-src]').forEach(function(item) {
          item.addEventListener('click', function() {
            var src = item.getAttribute('data-src');
            var overlay = document.createElement('div');
            overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.88);z-index:9999;display:flex;align-items:center;justify-content:center;cursor:zoom-out;';
            var img = document.createElement('img');
            img.src = src;
            img.style.cssText = 'max-width:90vw;max-height:90vh;border-radius:12px;box-shadow:0 20px 60px rgba(0,0,0,0.7);';
            overlay.appendChild(img);
            overlay.addEventListener('click', function() { document.body.removeChild(overlay); });
            document.body.appendChild(overlay);
          });
        });
      }
    }
  }

  // helper
  function esc(s) {
    if (!s) return '';
    var d = document.createElement('div');
    d.textContent = s;
    return d.innerHTML;
  }

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
