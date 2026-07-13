/**
 * localStorage 拦截器 - 自动同步数据到服务器
 * 功能：拦截所有 localStorage.setItem 调用，自动同步到服务器
 * 使用：只需在页面中引入此文件，无需修改其他代码
 * 
 * 注意：当前云端院史馆为纯静态版本，默认禁用服务器同步
 * 如需启用，请配置后端 API 并将 ENABLED 改为 true
 */

(function() {
  // 配置
  const CONFIG = {
    API_BASE: window.location.origin.includes('localhost') 
      ? 'http://localhost:3000/api' 
      : '/api',
    ENABLED: false, // 默认禁用，纯静态版本不需要服务器同步
    DEBUG: false
  };

  // 需要同步到服务器的 key 列表
  const SYNC_KEYS = [
    'hm_content',
    'hm_settings', 
    'hm_admin_sections',
    'hm_announcements',
    'hm_staff'
  ];

  // 保存原始方法
  const originalSetItem = localStorage.setItem.bind(localStorage);
  const originalRemoveItem = localStorage.removeItem.bind(localStorage);
  const originalClear = localStorage.clear.bind(localStorage);

  // 保存到服务器
  async function saveToServer(key, value) {
    if (!CONFIG.ENABLED) return;
    if (!SYNC_KEYS.includes(key)) return;

    try {
      const endpoint = key.replace('hm_', '');
      const data = JSON.parse(value);
      
      const response = await fetch(`${CONFIG.API_BASE}/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        CONFIG.DEBUG && console.log(`✓ 已同步到服务器: ${key}`);
      } else {
        CONFIG.DEBUG && console.warn(`⚠ 同步到服务器失败: ${key}`, response.status);
      }
    } catch (e) {
      CONFIG.DEBUG && console.warn(`⚠ 同步到服务器失败: ${key}`, e);
    }
  }

  // 从服务器加载数据
  async function loadFromServer() {
    if (!CONFIG.ENABLED) return;

    try {
      const response = await fetch(`${CONFIG.API_BASE}/all-data`);
      if (!response.ok) {
        console.warn('⚠ 从服务器加载数据失败', response.status);
        return;
      }

      const serverData = await response.json();
      let loadedCount = 0;

      for (const [key, value] of Object.entries(serverData)) {
        const fullKey = key.includes('hm_') ? key : `hm_${key}`;
        originalSetItem(fullKey, JSON.stringify(value));
        loadedCount++;
      }

      console.log(`✓ 从服务器加载了 ${loadedCount} 个数据项`);
      
      // 设置标志位，避免竞争条件
      window.__serverDataLoaded = true;
      
      // 触发自定义事件，通知页面数据已更新
      window.dispatchEvent(new CustomEvent('serverDataLoaded'));
    } catch (e) {
      console.warn('⚠ 从服务器加载数据失败', e);
    }
  }

  // 重写 setItem
  localStorage.setItem = function(key, value) {
    originalSetItem(key, value);
    
    // 异步保存到服务器（不阻塞UI）
    saveToServer(key, value);
  };

  // 重写 removeItem
  localStorage.removeItem = function(key) {
    originalRemoveItem(key);
  };

  // 重写 clear
  localStorage.clear = function() {
    if (confirm('确定要清除所有数据吗？')) {
      originalClear();
    }
  };

  // 页面加载时从服务器初始化数据
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      loadFromServer();
    });
  } else {
    loadFromServer();
  }

  // 暴露配置，允许页面控制
  window.LocalStorageSync = {
    CONFIG,
    loadFromServer,
    saveToServer
  };

  if (CONFIG.ENABLED) {
    console.log('✓ localStorage 拦截器已启用，数据将自动同步到服务器');
  }
})();
