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
      '10-vision': 'vision', '11-structure': 'structure', '12-leadership': 'leadership',
      '13-staff': 'staff'
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
          // Render image if URL provided (img-slot is a div, inject <img> child)
          if (b.imgUrl) {
            setPlaceholderImage(is, b.imgUrl, b.imgLabel || '');
          }
        }
      });
    }

    // ---- Leaders (院长/书记) ----
    if (Array.isArray(sectionContent.leaders) && sectionContent.leaders.length > 0) {
      var leaderCards = document.querySelectorAll('.leader-card');
      if (leaderCards.length > 0) {
        // 分离院长和书记
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
            var photoEl = card.querySelector('.leader-photo');
            
            if (nameEl) nameEl.textContent = l.name;
            if (yearsEl) yearsEl.textContent = l.years;
            if (eraEl) eraEl.textContent = l.era;
            if (descEl) descEl.textContent = l.desc;
            
            // 根据类别设置不同样式
            if (photoEl) {
              if (l.category === '书记') {
                photoEl.style.borderColor = '#D44';
                photoEl.style.borderStyle = 'solid';
              } else {
                photoEl.style.borderColor = '';
                photoEl.style.borderStyle = '';
              }
              if (l.photo) setPlaceholderImage(photoEl, l.photo, l.name);
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
          if (nameEl) nameEl.textContent = p.name;
          if (titleEl) titleEl.textContent = p.title;
          if (deptEl) deptEl.textContent = p.dept;
          if (descEl) descEl.textContent = p.desc;
          // Render profile photo if URL provided
          var pphotoEl = card.querySelector('.profile-photo');
          if (pphotoEl && p.photo) setPlaceholderImage(pphotoEl, p.photo, p.name);
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
            var iconEl = card.querySelector('.data-card-icon');
            if (valEl) valEl.textContent = d.value;
            if (labelEl) labelEl.textContent = d.label;
            if (noteEl && d.note) noteEl.textContent = d.note;
            if (iconEl) iconEl.textContent = d.icon || '';
          }
        });
      });
    }

    // ---- Staff Roster (13-职工名录) ----
    if (Array.isArray(sectionContent.staff) && sectionContent.staff.length > 0) {
      renderStaffRoster(sectionContent.staff);
    }
  }

  // helper
  function esc(s) {
    if (!s) return '';
    var d = document.createElement('div');
    d.textContent = s;
    return d.innerHTML;
  }

  // -------- Render Staff Roster --------
  function renderStaffRoster(staffList) {
    var grid = document.getElementById('staff-grid');
    var statTotal = document.getElementById('stat-total');
    var statOnline = document.getElementById('stat-online');
    var statRetired = document.getElementById('stat-retired');
    var statDepts = document.getElementById('stat-depts');
    var noResult = document.getElementById('staff-no-result');
    var loadMore = document.getElementById('staff-load-more');

    if (!grid) return;

    // Stats
    if (statTotal) statTotal.textContent = staffList.length;
    if (statOnline) statOnline.textContent = staffList.filter(function(s){ return s.status === '在职'; }).length;
    if (statRetired) statRetired.textContent = staffList.filter(function(s){ return s.status === '退休'; }).length;
    if (statDepts) {
      var deptSet = {};
      staffList.forEach(function(s){ if(s.department) deptSet[s.department] = true; });
      statDepts.textContent = Object.keys(deptSet).length;
    }

    // Populate filter dropdowns
    populateStaffFilters(staffList);

    // Render (with pagination)
    renderStaffCards(staffList, 0, 12);

    // Search & filter
    var searchInput = document.getElementById('staff-search');
    var btnSearch = document.getElementById('btn-staff-search');
    var btnReset = document.getElementById('btn-staff-reset');
    var filterDept = document.getElementById('filter-dept');
    var filterTitle = document.getElementById('filter-title');
    var filterStatus = document.getElementById('filter-status');

    if (btnSearch && searchInput) {
      btnSearch.addEventListener('click', function() {
        filterAndRenderStaff(staffList);
      });
      searchInput.addEventListener('keyup', function(e) {
        if (e.key === 'Enter') filterAndRenderStaff(staffList);
      });
    }
    if (btnReset) {
      btnReset.addEventListener('click', function() {
        if (searchInput) searchInput.value = '';
        if (filterDept) filterDept.value = '';
        if (filterTitle) filterTitle.value = '';
        if (filterStatus) filterStatus.value = '';
        renderStaffCards(staffList, 0, 12);
        if (loadMore) loadMore.style.display = 'none';
        if (noResult) noResult.style.display = 'none';
      });
    }
    if (filterDept) filterDept.addEventListener('change', function() { filterAndRenderStaff(staffList); });
    if (filterTitle) filterTitle.addEventListener('change', function() { filterAndRenderStaff(staffList); });
    if (filterStatus) filterStatus.addEventListener('change', function() { filterAndRenderStaff(staffList); });
  }

  // -------- Populate filter dropdowns --------
  function populateStaffFilters(staffList) {
    var deptSet = {};
    var titleSet = {};
    staffList.forEach(function(s) {
      if (s.department) deptSet[s.department] = true;
      if (s.title) titleSet[s.title] = true;
    });

    var filterDept = document.getElementById('filter-dept');
    var filterTitle = document.getElementById('filter-title');
    if (filterDept) {
      var currentDept = filterDept.value;
      filterDept.innerHTML = '<option value="">全部科室</option>';
      Object.keys(deptSet).sort().forEach(function(d) {
        filterDept.innerHTML += '<option value="' + esc(d) + '">' + esc(d) + '</option>';
      });
      filterDept.value = currentDept;
    }
    if (filterTitle) {
      var currentTitle = filterTitle.value;
      filterTitle.innerHTML = '<option value="">全部职称</option>';
      Object.keys(titleSet).sort().forEach(function(t) {
        filterTitle.innerHTML += '<option value="' + esc(t) + '">' + esc(t) + '</option>';
      });
      filterTitle.value = currentTitle;
    }
  }

  // -------- Filter and Render --------
  function filterAndRenderStaff(staffList) {
    var searchInput = document.getElementById('staff-search');
    var filterDept = document.getElementById('filter-dept');
    var filterTitle = document.getElementById('filter-title');
    var filterStatus = document.getElementById('filter-status');
    var noResult = document.getElementById('staff-no-result');
    var loadMore = document.getElementById('staff-load-more');

    var keyword = searchInput ? searchInput.value.trim().toLowerCase() : '';
    var deptVal = filterDept ? filterDept.value : '';
    var titleVal = filterTitle ? filterTitle.value : '';
    var statusVal = filterStatus ? filterStatus.value : '';

    var filtered = staffList.filter(function(s) {
      var matchKeyword = !keyword || (s.name && s.name.toLowerCase().indexOf(keyword) >= 0);
      var matchDept = !deptVal || s.department === deptVal;
      var matchTitle = !titleVal || s.title === titleVal;
      var matchStatus = !statusVal || s.status === statusVal;
      return matchKeyword && matchDept && matchTitle && matchStatus;
    });

    if (filtered.length === 0) {
      if (noResult) noResult.style.display = 'block';
      var grid = document.getElementById('staff-grid');
      if (grid) grid.innerHTML = '';
    } else {
      if (noResult) noResult.style.display = 'none';
      renderStaffCards(filtered, 0, 12);
    }
    if (loadMore) loadMore.style.display = 'none';
  }

  // -------- Render Staff Cards --------
  function renderStaffCards(list, start, count) {
    var grid = document.getElementById('staff-grid');
    var loadMore = document.getElementById('staff-load-more');
    if (!grid) return;

    if (start === 0) grid.innerHTML = '';

    var end = Math.min(start + count, list.length);
    for (var i = start; i < end; i++) {
      var s = list[i];
      var card = document.createElement('div');
      card.className = 'staff-card fade-in stagger-' + ((i % 5) + 1);
      card.onclick = (function(staff) {
        return function() { showStaffDetail(staff); };
      })(s);
      card.innerHTML =
        '<div class="staff-photo">' +
          '<span class="staff-photo-icon">👤</span>' +
          '<span class="staff-photo-hint">职工照片</span>' +
        '</div>' +
        '<div class="staff-name">' + esc(s.name || '[待补充]') + '</div>' +
        '<div class="staff-dept">' + esc(s.department || '[科室]') + '</div>' +
        '<div class="staff-title">' + esc(s.title || '[职称]') + '</div>' +
        '<div class="staff-years">' + esc(s.hireDate || '[任职时间]') + (s.leaveDate ? ' – ' + esc(s.leaveDate) : '') + '</div>' +
        (s.remark ? '<div class="staff-remark">' + esc(s.remark) + '</div>' : '');
      grid.appendChild(card);

      // Set photo if available
      if (s.photo) {
        setPlaceholderImage(card.querySelector('.staff-photo'), s.photo, s.name);
      }
    }

    // Show/hide load more
    if (loadMore) {
      if (end < list.length) {
        loadMore.style.display = 'block';
        var btnLoadMore = document.getElementById('btn-load-more');
        if (btnLoadMore) {
          btnLoadMore.onclick = function() { renderStaffCards(list, end, count); };
        }
      } else {
        loadMore.style.display = 'none';
      }
    }
  }

  // -------- Show Staff Detail --------
  function showStaffDetail(staff) {
    var overlay = document.getElementById('staff-detail-overlay');
    if (!overlay) return;

    // Set photo
    var photoEl = document.getElementById('staff-detail-photo');
    if (photoEl) {
      if (staff.photo) {
        photoEl.innerHTML = '<img src="' + esc(staff.photo) + '" alt="' + esc(staff.name) + '">';
      } else {
        photoEl.innerHTML = '👤';
      }
    }

    // Set info
    var nameEl = document.getElementById('staff-detail-name');
    if (nameEl) nameEl.textContent = staff.name || '[待补充]';

    var genderEl = document.getElementById('staff-detail-gender');
    if (genderEl) genderEl.textContent = staff.gender || '';

    var titleEl = document.getElementById('staff-detail-title');
    if (titleEl) titleEl.textContent = staff.title || '';

    var deptEl = document.getElementById('staff-detail-dept');
    if (deptEl) deptEl.textContent = staff.department || '';

    // Set任职信息
    var hireEl = document.getElementById('staff-detail-hire');
    if (hireEl) hireEl.textContent = staff.hireDate || '未知';

    var statusEl = document.getElementById('staff-detail-status');
    if (statusEl) {
      statusEl.textContent = staff.status || '在职';
      statusEl.className = 'staff-status-badge status-' + (staff.status === '在职' ? 'online' : (staff.status === '退休' ? 'retired' : 'left'));
    }

    var leaveRow = document.getElementById('staff-detail-leave-row');
    var leaveEl = document.getElementById('staff-detail-leave');
    if (leaveRow && leaveEl) {
      if (staff.leaveDate && staff.status !== '在职') {
        leaveRow.style.display = 'flex';
        leaveEl.textContent = staff.leaveDate;
      } else {
        leaveRow.style.display = 'none';
      }
    }

    // Set备注
    var remarkSection = document.getElementById('staff-detail-remark-section');
    var remarkEl = document.getElementById('staff-detail-remark');
    if (remarkSection && remarkEl) {
      if (staff.remark) {
        remarkSection.style.display = 'block';
        remarkEl.textContent = staff.remark;
      } else {
        remarkSection.style.display = 'none';
      }
    }

    overlay.style.display = 'flex';
  }

  // -------- Close Staff Detail --------
  function closeStaffDetail() {
    var overlay = document.getElementById('staff-detail-overlay');
    if (overlay) overlay.style.display = 'none';
  }

  // -------- Set image on placeholder element --------
  // Works for .img-slot, .leader-photo, .profile-photo, .leadership-photo, .gallery-item
  function setPlaceholderImage(el, url, alt) {
    if (!url) return;
    // Remove existing img if any
    var existingImg = el.querySelector('img:not(.keep)');
    if (existingImg) existingImg.remove();
    // Remove background-image inline style
    el.style.backgroundImage = '';
    // Create and inject img
    var img = document.createElement('img');
    img.src = url;
    img.alt = alt || '';
    img.setAttribute('loading', 'lazy');
    img.onerror = function () {
      img.style.display = 'none';
    };
    img.onload = function () {
      img.style.display = '';
    };
    el.appendChild(img);
    el.setAttribute('data-has-image', 'true');
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

    /* cleanup on page unload to prevent memory leak */
    window.addEventListener('beforeunload', function () {
      clearInterval(flipInterval);
    });

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
      var srcText   = src  ? src.textContent.replace(/^\s*📌\s*/, '').trim() : '';

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

  // -------- Universal Image Lightbox --------
  (function() {
    // Create persistent lightbox overlay
    var lbOverlay = document.createElement('div');
    lbOverlay.id = 'img-lightbox';
    lbOverlay.innerHTML =
      '<button class="lb-close" title="关闭">&times;</button>' +
      '<img class="lb-img" src="" alt="" />';
    document.body.appendChild(lbOverlay);

    var lbImg = lbOverlay.querySelector('.lb-img');

    function openLightbox(src) {
      lbImg.src = src;
      lbOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      lbOverlay.classList.remove('active');
      document.body.style.overflow = '';
      setTimeout(function() { lbImg.src = ''; }, 350);
    }

    // Close on overlay background click or close button
    lbOverlay.addEventListener('click', function(e) {
      if (e.target === lbOverlay || e.target.classList.contains('lb-close')) {
        closeLightbox();
      }
    });

    // Close on ESC
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && lbOverlay.classList.contains('active')) {
        closeLightbox();
      }
    });

    // Event delegation — catch clicks on any image within the page
    document.addEventListener('click', function(e) {
      // 1) Handle <img> tags (injected by setPlaceholderImage)
      var img = e.target.closest('img');
      if (img && !img.closest('#img-lightbox') && !img.closest('.announce-modal-overlay') && !img.closest('.nav-logo')) {
        var src = img.getAttribute('src') || img.src;
        if (src && src.indexOf('data:') !== 0 && src !== window.location.href) {
          e.preventDefault();
          openLightbox(src);
          return;
        }
      }

      // 2) Handle .gallery-item with inline background-image (CMS gallery)
      var galleryItem = e.target.closest('.gallery-item');
      if (galleryItem && !galleryItem.closest('#img-lightbox')) {
        var bgStyle = galleryItem.style.backgroundImage || getComputedStyle(galleryItem).backgroundImage;
        if (bgStyle && bgStyle !== 'none') {
          var urlMatch = bgStyle.match(/url\(["']?([^"')]+)["']?\)/);
          if (urlMatch && urlMatch[1]) {
            e.preventDefault();
            openLightbox(urlMatch[1]);
          }
        }
      }
    });

  })();

  // -------- Render Announcements --------
  function renderAnnouncements() {
    var grid = document.getElementById('announcements-grid');
    if (!grid) return;

    var data;
    try {
      data = JSON.parse(localStorage.getItem('hm_announcements') || '[]');
    } catch (e) {
      data = [];
    }

    if (!Array.isArray(data) || data.length === 0) return;

    var active = data
      .filter(function (a) { return a.published !== false && a.isActive !== false; })
      .sort(function (a, b) { return (b.date || '').localeCompare(a.date || ''); });

    if (active.length === 0) return;

    var catClassMap = { notice: 'notice', event: 'event', hr: 'hr', academic: 'academic' };
    var catLabelMap = { notice: '通知', event: '活动', hr: '人事', academic: '科研' };

    var html = '';
    active.forEach(function (a, idx) {
      var stagger = (idx % 6) + 1;
      var cls = catClassMap[a.category] || 'notice';
      var label = catLabelMap[a.category] || '通知';
      var date = a.date || '';
      var title = a.title || '无标题';
      var desc = a.content ? a.content.substring(0, 80) + (a.content.length > 80 ? '…' : '') : '';
      var dept = a.department || '';

      html +=
        '<div class="announce-card fade-in stagger-' + stagger + '" onclick="openAnnounceModal(' + JSON.stringify(a).replace(/"/g, '&quot;') + ')">' +
          '<div class="announce-card-top">' +
            '<span class="announce-card-date">' + esc(date) + '</span>' +
            '<span class="announce-card-tag ' + cls + '">' + esc(label) + '</span>' +
          '</div>' +
          '<h4 class="announce-card-title">' + esc(title) + '</h4>' +
          (desc ? '<p class="announce-card-desc">' + esc(desc) + '</p>' : '') +
          (dept ? '<div class="announce-card-footer"><span aria-hidden="true">📌</span> ' + esc(dept) + '</div>' : '') +
        '</div>';
    });

    if (html) {
      grid.innerHTML = html;
    }
  }

  function openAnnounceModal(a) {
    if (typeof a === 'string') {
      try { a = JSON.parse(a); } catch (e) { return; }
    }
    var overlay = document.getElementById('announce-modal-overlay');
    if (!overlay) return;
    var titleEl = document.getElementById('announce-modal-title');
    var bodyEl = document.getElementById('announce-modal-body');
    var timeEl = document.getElementById('announce-modal-time');
    if (titleEl) titleEl.textContent = a.title || '公告详情';
    if (bodyEl) bodyEl.innerHTML = '<p>' + esc(a.content || '暂无内容').replace(/\n/g, '<br>') + '</p>';
    if (timeEl) timeEl.textContent = '发布时间：' + (a.date || '未知');
    overlay.classList.add('active');
    overlay.style.display = 'flex';
  }

  function closeAnnounceModal() {
    var overlay = document.getElementById('announce-modal-overlay');
    if (overlay) {
      overlay.classList.remove('active');
      overlay.style.display = 'none';
    }
  }

  renderAnnouncements();

  // Re-render announcements when server data arrives (async from localStorage-sync.js)
  window.addEventListener('serverDataLoaded', function() {
    renderAnnouncements();
  });

    // ------- Expose functions for inline event handlers -------
    window.openAnnounceModal = openAnnounceModal;
    window.closeAnnounceModal = closeAnnounceModal;
    window.closeStaffDetail = closeStaffDetail;
    window.showStaffDetail = showStaffDetail;
    window.toggleMenu = toggleMenu;
    window.toggleTheme = toggleTheme;

})();
