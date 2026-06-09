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

  // -------- 数据读取（优先 data.js，fallback localStorage）--------
  // data.js 注入 window.HM_DATA，包含 content/settings/announcements/sections
  // 若 data.js 字段为空对象/空数组，则回退到 localStorage（本地编辑预览）
  var _hmData = (window.HM_DATA && typeof window.HM_DATA === 'object') ? window.HM_DATA : {};

  function _hasData(obj) {
    if (!obj) return false;
    if (Array.isArray(obj)) return obj.length > 0;
    return Object.keys(obj).length > 0;
  }

  // -------- Hospital age auto-calc --------
  // Read founding year from admin settings if available, else default 1991
  var hmSettings = {};
  try {
    if (_hasData(_hmData.settings)) {
      hmSettings = _hmData.settings;
    } else {
      hmSettings = JSON.parse(localStorage.getItem('hm_settings') || '{}');
    }
  } catch(e) {}
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

  // -------- Content from data.js or localStorage (CMS) --------
  var hmContent = {};
  try {
    if (_hasData(_hmData.content)) {
      // 优先使用 data.js 导出的持久化数据
      hmContent = _hmData.content;
    } else {
      // fallback：本地预览时从 localStorage 读取
      hmContent = JSON.parse(localStorage.getItem('hm_content') || '{}');
    }
  } catch(e) {}

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
            existImg.setAttribute('data-lightbox', b.imgUrl);
            existImg.setAttribute('data-lightbox-caption', b.imgLabel || '');
            existImg.style.cursor = 'zoom-in';
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
        // 兼容旧 category 分组 和 新 position 直接标注
        var deans = sectionContent.leaders.filter(function(l) { return l.category === '院长'; });
        var secretaries = sectionContent.leaders.filter(function(l) { return l.category === '书记'; });
        // 新模式：无 category 或 category 不是院长/书记，直接按顺序排列
        var hasOldCategory = deans.length > 0 || secretaries.length > 0;
        var allLeaders = hasOldCategory ? deans.concat(secretaries) : sectionContent.leaders;
        leaderCards.forEach(function(card, i) {
          if (allLeaders[i]) {
            var l = allLeaders[i];
            var nameEl = card.querySelector('.leader-name');
            var yearsEl = card.querySelector('.leader-years');
            var eraEl = card.querySelector('.leader-era');
            var descEl = card.querySelector('.leader-desc');
            var posEl = card.querySelector('.leader-position');
            var photoEl = card.querySelector('.leader-photo');
            if (nameEl) nameEl.textContent = l.name;
            if (yearsEl) yearsEl.textContent = l.years;
            if (eraEl) eraEl.textContent = l.era;
            if (descEl) descEl.textContent = l.desc;
            // 职位
            if (posEl) posEl.textContent = l.position || l.category || '';
            // 照片URL：有则显示真实图片，无则保留占位首字
            if (photoEl) {
              var existingImg = photoEl.querySelector('.leader-real-img');
              if (l.photo && l.photo.trim()) {
                photoEl.classList.add('has-real-img');
                if (!existingImg) {
                  var img = document.createElement('img');
                  img.className = 'leader-real-img';
                  img.src = l.photo.trim();
                  img.alt = l.name || '';
                  img.setAttribute('data-lightbox', l.photo.trim());
                  img.setAttribute('data-lightbox-caption', l.name || '');
                  img.style.cursor = 'zoom-in';
                  photoEl.appendChild(img);
                } else {
                  existingImg.src = l.photo.trim();
                  existingImg.alt = l.name || '';
                  existingImg.setAttribute('data-lightbox', l.photo.trim());
                  existingImg.setAttribute('data-lightbox-caption', l.name || '');
                  existingImg.style.cursor = 'zoom-in';
                }
              } else {
                photoEl.classList.remove('has-real-img');
                if (existingImg) existingImg.remove();
                // 首字占位：替换占位图标为姓名首字
                var iconEl = photoEl.querySelector('.leader-photo-icon');
                if (iconEl && l.name && l.name !== '[待补充]') {
                  iconEl.textContent = l.name.charAt(0);
                  iconEl.style.fontSize = '36px';
                  iconEl.style.opacity = '0.85';
                }
              }
            }
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
            var photoEl = card.querySelector('.leadership-photo');
            if (nameEl) nameEl.textContent = l.name;
            if (roleEl) roleEl.textContent = l.role;
            if (dutyEl) dutyEl.textContent = l.duty;
            if (resumeEl) resumeEl.textContent = l.resume;
            // 照片URL：有则显示真实图片，无则显示姓名首字占位
            if (photoEl) {
              var existingImg = photoEl.querySelector('.leadership-real-img');
              var charEl = photoEl.querySelector('.leadership-photo-char');
              if (l.photo && l.photo.trim()) {
                // 有照片URL → 显示真实图片
                photoEl.classList.add('has-real-img');
                if (!existingImg) {
                  var img = document.createElement('img');
                  img.className = 'leadership-real-img';
                  img.src = l.photo.trim();
                  img.alt = l.name || '';
                  img.setAttribute('data-lightbox', l.photo.trim());
                  img.setAttribute('data-lightbox-caption', l.name + (l.role ? ' · ' + l.role : ''));
                  img.style.cursor = 'zoom-in';
                  photoEl.appendChild(img);
                } else {
                  existingImg.src = l.photo.trim();
                  existingImg.alt = l.name || '';
                  existingImg.setAttribute('data-lightbox', l.photo.trim());
                  existingImg.setAttribute('data-lightbox-caption', l.name + (l.role ? ' · ' + l.role : ''));
                  existingImg.style.cursor = 'zoom-in';
                }
                if (charEl) charEl.remove();
              } else {
                // 无照片URL → 姓名首字占位
                photoEl.classList.remove('has-real-img');
                if (existingImg) existingImg.remove();
                var iconEl = photoEl.querySelector('.leadership-photo-icon');
                var hintEl = photoEl.querySelector('.leadership-photo-hint');
                if (l.name && l.name !== '[待补充]') {
                  if (!charEl) {
                    charEl = document.createElement('span');
                    charEl.className = 'leadership-photo-char';
                    photoEl.insertBefore(charEl, iconEl);
                  }
                  charEl.textContent = l.name.charAt(0);
                  if (iconEl) iconEl.style.display = 'none';
                  if (hintEl) hintEl.style.display = 'none';
                } else {
                  if (charEl) charEl.remove();
                }
              }
            }
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
          var photoEl = card.querySelector('.profile-photo');
          if (nameEl) nameEl.textContent = p.name;
          if (titleEl) titleEl.textContent = p.title;
          if (deptEl) deptEl.textContent = p.dept;
          if (descEl) descEl.textContent = p.desc;
          // 照片URL：有则显示真实图片，无则显示姓名首字占位
          if (photoEl) {
            var existingImg = photoEl.querySelector('.profile-real-img');
            var charEl = photoEl.querySelector('.profile-photo-char');
            if (p.photo && p.photo.trim()) {
              // 有照片URL → 显示真实图片
              photoEl.classList.add('has-real-img');
              if (!existingImg) {
                var img = document.createElement('img');
                img.className = 'profile-real-img';
                img.src = p.photo.trim();
                img.alt = p.name || '';
                img.setAttribute('data-lightbox', p.photo.trim());
                img.setAttribute('data-lightbox-caption', p.name || '');
                img.style.cursor = 'zoom-in';
                photoEl.appendChild(img);
              } else {
                existingImg.src = p.photo.trim();
                existingImg.alt = p.name || '';
                existingImg.setAttribute('data-lightbox', p.photo.trim());
                existingImg.setAttribute('data-lightbox-caption', p.name || '');
                existingImg.style.cursor = 'zoom-in';
              }
              if (charEl) charEl.remove();
            } else {
              // 无照片URL → 姓名首字占位
              photoEl.classList.remove('has-real-img');
              if (existingImg) existingImg.remove();
              var iconEl = photoEl.querySelector('.profile-photo-icon');
              var hintEl = photoEl.querySelector('.profile-photo-hint');
              if (p.name && p.name !== '[待补充]') {
                // 已有char元素则更新，否则插入
                if (!charEl) {
                  charEl = document.createElement('span');
                  charEl.className = 'profile-photo-char';
                  photoEl.insertBefore(charEl, iconEl);
                }
                charEl.textContent = p.name.charAt(0);
                if (iconEl) iconEl.style.display = 'none';
                if (hintEl) hintEl.style.display = 'none';
              } else {
                if (charEl) charEl.remove();
              }
            }
          }
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

  // -------- 公告数据读取 ---------
  // 优先级: localStorage（后台管理实时数据） > data.js（持久化导出数据）
  // 公告属于动态内容，后台管理修改后应立即在前端可见，无需重新导出 data.js
  // 首次访问时自动将 data.js 数据同步到 localStorage
  var hmAnnouncements = [];
  try {
    var localAnn = JSON.parse(localStorage.getItem('hm_announcements') || 'null');
    if (localAnn && Array.isArray(localAnn) && localAnn.length > 0) {
      hmAnnouncements = localAnn;
    } else if (_hasData(_hmData.announcements)) {
      // data.js 有数据但 localStorage 为空 → 首次同步
      hmAnnouncements = _hmData.announcements;
      try { localStorage.setItem('hm_announcements', JSON.stringify(hmAnnouncements)); } catch(e) {}
    } else {
      hmAnnouncements = [];
    }
  } catch(e) {}

  // -------- 公告卡片动态渲染（替换 index.html 静态硬编码）--------
  function renderFrontAnnouncements() {
    var grid = document.querySelector('.announcements-grid');
    if (!grid) return;
    var catMap = { notice: '通知', event: '活动', hr: '人事', academic: '科研' };
    // 只显示已发布的，按日期倒序
    var published = hmAnnouncements.filter(function(a){ return a.published !== false; });
    published.sort(function(a,b){ return (b.date||'').localeCompare(a.date||''); });

    var html = '';
    if (published.length > 0) {
      // 最多展示6条
      var display = published.slice(0, 6);
      display.forEach(function(a, i){
        var tagText = catMap[a.category] || a.category || '公告';
        var tagClass = a.category || 'notice';
        // data-ann-idx 关联到 published 数组索引，modal 用于从 hmAnnouncements 查找原始数据
        html += '<div class="announce-card fade-in stagger-'+(i+1)+'" data-ann-idx="'+i+'">'
          + '<div class="announce-card-top">'
            + '<span class="announce-card-date">' + (a.date||'') + '</span>'
            + '<span class="announce-card-tag ' + tagClass + '">' + tagText + '</span>'
          + '</div>'
          + '<h4 class="announce-card-title">' + (a.title||'') + '</h4>'
          + '<p class="announce-card-desc">' + (a.content||'') + '</p>'
          + '<div class="announce-card-footer"><span aria-hidden="true">📌</span> ' + (a.dept||'') + '</div>'
        + '</div>';
      });
    } else {
      // 无公告时显示提示（替换所有静态卡片）
      html = '<div class="announce-card" style="grid-column:1/-1;text-align:center;padding:48px 24px;opacity:0.6;">'
        + '<div style="font-size:48px;margin-bottom:12px;">📋</div>'
        + '<p style="color:var(--text-secondary);font-size:14px;">暂无最新公告，敬请关注</p>'
        + '<p style="color:var(--text-muted);font-size:12px;">请前往 <a href="../admin/index.html" style="color:var(--gold);">后台管理</a> 发布公告</p>'
        + '</div>';
    }
    grid.innerHTML = html;
    // 将新生成的公告卡片注册到 IntersectionObserver
    // （因为卡片是动态替换的，需要在渲染后重新观察）
    grid.querySelectorAll('.fade-in').forEach(function (el) {
      observer.observe(el);
    });
  }
  renderFrontAnnouncements();

  // -------- 公告纪实弹出（data-ann-idx 关联后台原始数据）--------
  document.addEventListener('click', function(ev) {
    var card = ev.target.closest('.announce-card');
    if (!card) return;
    if (ev.target.closest('a')) return; // 不拦截链接点击

    // 从 data-ann-idx 查后台原始数据（避免读截断的 DOM textContent）
    var idx = parseInt(card.getAttribute('data-ann-idx'), 10);
    var a = null;
    if (!isNaN(idx)) {
      var published = hmAnnouncements.filter(function(x){ return x.published !== false; });
      published.sort(function(x,y){ return (y.date||'').localeCompare(x.date||''); });
      a = published[idx] || null;
    }
    // fallback：如果索引失效则从 DOM 读取
    var catMap = { notice: '通知', event: '活动', hr: '人事', academic: '科研' };
    var titleText = a ? a.title : (card.querySelector('.announce-card-title')||{}).textContent||'';
    var descText  = a ? (a.content||'') : (card.querySelector('.announce-card-desc')||{}).textContent||'';
    var dateText  = a ? (a.date||'') : (card.querySelector('.announce-card-date')||{}).textContent||'';
    var tagText   = a ? (catMap[a.category]||a.category||'公告') : ((card.querySelector('.announce-card-tag')||{}).textContent||'');
    var tagClass  = a ? (a.category||'notice') : ((card.querySelector('.announce-card-tag')||{}).className||'').replace('announce-card-tag','').trim();
    var srcText   = a ? (a.dept||'') : '';
    if (!srcText) {
      var footer = card.querySelector('.announce-card-footer');
      srcText = footer ? footer.textContent.replace(/^\s*📌\s*/, '').trim() : '';
    }

    // build overlay
    var overlay = document.createElement('div');
    overlay.className = 'announce-modal-overlay';

    var box = document.createElement('div');
    box.className = 'announce-modal-box';

    box.innerHTML =
      '<button class="announce-modal-close" title="关闭">&times;</button>' +
      '<div class="announce-modal-header">' +
        '<span class="announce-card-tag ' + tagClass + '">' + tagText + '</span>' +
        '<span class="announce-modal-date">' + dateText + '</span>' +
      '</div>' +
      '<h3 class="announce-modal-title">' + titleText + '</h3>' +
      '<div class="announce-modal-body">' + descText + '</div>' +
      '<div class="announce-modal-footer"><span>📌</span> 发布部门：' + srcText + '</div>';

    overlay.appendChild(box);

    function close() {
      if (overlay.parentNode) {
        overlay.classList.remove('active');
        setTimeout(function () {
          if (overlay.parentNode) document.body.removeChild(overlay);
        }, 280);
      }
    }

    overlay.addEventListener('click', function (ev2) {
      if (ev2.target === overlay) close();
    });
    box.querySelector('.announce-modal-close').addEventListener('click', close);
    document.addEventListener('keydown', function escHandler(ev2) {
      if (ev2.key === 'Escape') { close(); document.removeEventListener('keydown', escHandler); }
    });

    document.body.appendChild(overlay);
    requestAnimationFrame(function () { overlay.classList.add('active'); });
  });

  // -------- 统一 Lightbox 放大查看 --------
  function openLightbox(src, caption) {
    if (!src) return;
    var overlay = document.createElement('div');
    overlay.className = 'hm-lightbox-overlay';
    overlay.style.cssText = [
      'position:fixed;inset:0;z-index:99999;',
      'background:rgba(0,0,0,0.92);',
      'display:flex;flex-direction:column;align-items:center;justify-content:center;',
      'cursor:zoom-out;',
      'opacity:0;transition:opacity 0.22s ease;'
    ].join('');

    var img = document.createElement('img');
    img.src = src;
    img.style.cssText = [
      'max-width:90vw;max-height:82vh;',
      'border-radius:8px;',
      'box-shadow:0 24px 80px rgba(0,0,0,0.8);',
      'object-fit:contain;',
      'transition:transform 0.22s ease;',
      'pointer-events:none;'
    ].join('');
    overlay.appendChild(img);

    // 底部说明文字
    if (caption) {
      var cap = document.createElement('p');
      cap.textContent = caption;
      cap.style.cssText = 'margin:16px 0 0;color:rgba(255,255,255,0.7);font-size:13px;max-width:80vw;text-align:center;pointer-events:none;';
      overlay.appendChild(cap);
    }

    // 右上关闭按钮
    var closeBtn = document.createElement('button');
    closeBtn.textContent = '✕';
    closeBtn.style.cssText = [
      'position:fixed;top:20px;right:24px;',
      'background:rgba(255,255,255,0.12);border:none;',
      'color:#fff;font-size:20px;cursor:pointer;',
      'width:40px;height:40px;border-radius:50%;',
      'display:flex;align-items:center;justify-content:center;',
      'transition:background 0.15s;',
      'z-index:100000;'
    ].join('');
    closeBtn.addEventListener('mouseenter', function() { closeBtn.style.background = 'rgba(255,255,255,0.28)'; });
    closeBtn.addEventListener('mouseleave', function() { closeBtn.style.background = 'rgba(255,255,255,0.12)'; });
    overlay.appendChild(closeBtn);

    function closeLightbox() {
      overlay.style.opacity = '0';
      setTimeout(function() { if (overlay.parentNode) document.body.removeChild(overlay); }, 220);
      document.removeEventListener('keydown', keyHandler);
    }
    function keyHandler(ev) {
      if (ev.key === 'Escape') closeLightbox();
    }

    overlay.addEventListener('click', function(ev) {
      if (ev.target === overlay) closeLightbox();
    });
    closeBtn.addEventListener('click', function(ev) { ev.stopPropagation(); closeLightbox(); });
    document.addEventListener('keydown', keyHandler);

    document.body.appendChild(overlay);
    requestAnimationFrame(function() { overlay.style.opacity = '1'; });
  }

  // --- gallery-item[data-src] ---
  document.addEventListener('click', function(ev) {
    var item = ev.target.closest('.gallery-item[data-src]');
    if (item) {
      var src = item.getAttribute('data-src');
      var label = item.querySelector('.gallery-item-label');
      openLightbox(src, label ? label.textContent : '');
    }
  });

  // --- 所有带 data-lightbox 的图片（统一委托）---
  document.addEventListener('click', function(ev) {
    var el = ev.target.closest('[data-lightbox]');
    if (el) {
      var src = el.getAttribute('data-lightbox') || el.src || '';
      var cap = el.getAttribute('data-lightbox-caption') || el.alt || '';
      openLightbox(src, cap);
    }
  });

  // --- 为静态 HTML 中的人物照片绑定 lightbox（动态渲染的在渲染时直接加 data-lightbox）---
  function bindStaticPhotos() {
    // 已渲染的真实图片
    ['.leader-real-img', '.profile-real-img', '.leadership-real-img', '.slot-real-img'].forEach(function(sel) {
      document.querySelectorAll(sel).forEach(function(img) {
        if (!img.hasAttribute('data-lightbox')) {
          img.setAttribute('data-lightbox', img.src);
          img.setAttribute('data-lightbox-caption', img.alt || '');
          img.style.cursor = 'zoom-in';
        }
      });
    });
  }
  // 页面加载 + 短暂延迟（等待动态渲染完成）
  bindStaticPhotos();
  setTimeout(bindStaticPhotos, 800);

})();
