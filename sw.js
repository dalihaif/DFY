// 云端院史馆 Service Worker v7
const CACHE_NAME = 'dfy-museum-v7';

// 核心资源 - 安装时预缓存
const CORE_ASSETS = [
  '/',
  '/index.html',
  '/css/style.css',
  '/css/sections.css',
  '/css/visuals.css',
  '/css/features.css',
  '/js/data/core.js',
  '/js/data-loader.js',
  '/js/main.js',
  '/js/features.js',
  '/js/page-renderer.js',
  '/js/data-service.js',
  '/pages/01-history.html',
  '/pages/02-people.html',
  '/pages/03-disciplines.html',
  '/pages/04-campus.html',
  '/pages/05-education.html',
  '/pages/06-culture.html',
  '/pages/07-tech.html',
  '/pages/08-duty.html',
  '/pages/09-honors.html',
  '/pages/10-vision.html',
  '/pages/11-structure.html',
  '/pages/12-leadership.html',
  '/pages/13-staff.html',
  '/pages/timeline.html',
  '/pages/search.html',
  '/pages/messages.html',
  '/assets/images/logo-hospital.webp',
  '/assets/images/2_20.webp'
];

// 安装：预缓存核心资源
self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(CORE_ASSETS).catch(function (err) {
        console.warn('SW: some assets failed to cache', err);
      });
    })
  );
  self.skipWaiting();
});

// 激活：清理旧版本缓存
self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys.filter(function (key) {
          return key.startsWith('dfy-museum-') && key !== CACHE_NAME;
        }).map(function (key) {
          return caches.delete(key);
        })
      );
    })
  );
  self.clients.claim();
});

// 请求拦截：缓存策略
self.addEventListener('fetch', function (event) {
  var req = event.request;

  // 只处理GET请求
  if (req.method !== 'GET') return;

  var url = new URL(req.url);

  // 同源资源走缓存策略
  if (url.origin !== location.origin) return;

  // HTML页面：网络优先，失败回退缓存
  if (req.mode === 'navigate' || url.pathname.endsWith('.html')) {
    event.respondWith(
      fetch(req).then(function (response) {
        // 成功则更新缓存
        var clone = response.clone();
        caches.open(CACHE_NAME).then(function (cache) {
          cache.put(req, clone);
        });
        return response;
      }).catch(function () {
        return caches.match(req).then(function (cached) {
          return cached || caches.match('/index.html');
        });
      })
    );
    return;
  }

  // 静态资源（CSS/JS/图片）：缓存优先，失败回退网络
  if (url.pathname.match(/\.(css|js|png|jpg|jpeg|gif|svg|webp|ico|woff2?)$/i)) {
    event.respondWith(
      caches.match(req).then(function (cached) {
        return cached || fetch(req).then(function (response) {
          // 动态加入缓存
          var clone = response.clone();
          caches.open(CACHE_NAME).then(function (cache) {
            cache.put(req, clone);
          });
          return response;
        }).catch(function () {
          return cached;
        });
      })
    );
    return;
  }
});
