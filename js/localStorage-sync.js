/**
 * localStorage 鎷︽埅鍣?- 鑷姩鍚屾鏁版嵁鍒版湇鍔″櫒
 * 鍔熻兘锛氭嫤鎴墍鏈?localStorage.setItem 璋冪敤锛岃嚜鍔ㄥ悓姝ュ埌鏈嶅姟鍣?
 * 浣跨敤锛氬彧闇€鍦ㄩ〉闈腑寮曞叆姝ゆ枃浠讹紝鏃犻渶淇敼鍏朵粬浠ｇ爜
 */

(function() {
  // 閰嶇疆
  const CONFIG = {
    API_BASE: window.location.origin.includes('localhost') 
      ? 'http://localhost:3000/api' 
      : '/api', // 鐢熶骇鐜浣跨敤鐩稿璺緞
    ENABLED: true, // 鏄惁鍚敤鏈嶅姟鍣ㄥ悓姝?
    DEBUG: false // 鏄惁鏄剧ず璋冭瘯鏃ュ織
  };

  // 闇€瑕佸悓姝ュ埌鏈嶅姟鍣ㄧ殑 key 鍒楄〃
  const SYNC_KEYS = [
    'hm_content',
    'hm_settings', 
    'hm_admin_sections',
    'hm_announcements',
    'hm_staff'
  ];

  // 淇濆瓨鍘熷鏂规硶
  const originalSetItem = localStorage.setItem.bind(localStorage);
  const originalRemoveItem = localStorage.removeItem.bind(localStorage);
  const originalClear = localStorage.clear.bind(localStorage);

  // 淇濆瓨鍒版湇鍔″櫒
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
        CONFIG.DEBUG && console.log(`鉁?宸插悓姝ュ埌鏈嶅姟鍣? ${key}`);
      } else {
        CONFIG.DEBUG && console.warn(`鈿狅笍 鍚屾鍒版湇鍔″櫒澶辫触: ${key}`, response.status);
      }
    } catch (e) {
      CONFIG.DEBUG && console.warn(`鈿狅笍 鍚屾鍒版湇鍔″櫒澶辫触: ${key}`, e);
    }
  }

  // 浠庢湇鍔″櫒鍔犺浇鏁版嵁
  async function loadFromServer() {
    if (!CONFIG.ENABLED) return;

    try {
      const response = await fetch(`${CONFIG.API_BASE}/all-data`);
      if (!response.ok) {
        console.warn('鈿狅笍 浠庢湇鍔″櫒鍔犺浇鏁版嵁澶辫触', response.status);
        return;
      }

      const serverData = await response.json();
      let loadedCount = 0;

      for (const [key, value] of Object.entries(serverData)) {
        const fullKey = key.includes('hm_') ? key : `hm_${key}`;
        // 浣跨敤鍘熷 setItem 閬垮厤瑙﹀彂 saveToServer 鏃犻檺寰幆
        originalSetItem(fullKey, JSON.stringify(value));
        loadedCount++;
      }

      console.log(`鉁?浠庢湇鍔″櫒鍔犺浇浜?${loadedCount} 涓暟鎹」`);
      
      // 璁剧疆鏍囧織浣嶏紝闃叉绔炴€佹潯浠?
      window.__serverDataLoaded = true;
      
      // 瑙﹀彂鑷畾涔変簨浠讹紝閫氱煡椤甸潰鏁版嵁宸叉洿鏂?
      window.dispatchEvent(new CustomEvent('serverDataLoaded'));
    } catch (e) {
      console.warn('鈿狅笍 浠庢湇鍔″櫒鍔犺浇鏁版嵁澶辫触', e);
    }
  }

  // 閲嶅啓 setItem
  localStorage.setItem = function(key, value) {
    // 鍏堣皟鐢ㄥ師濮嬫柟娉?
    originalSetItem(key, value);
    
    // 寮傛淇濆瓨鍒版湇鍔″櫒锛堜笉闃诲UI锛?
    saveToServer(key, value);
  };

  // 閲嶅啓 removeItem
  localStorage.removeItem = function(key) {
    originalRemoveItem(key);
    // 鍙互閫夋嫨鏄惁鍚屾鍒犻櫎鏈嶅姟鍣ㄦ暟鎹?
  };

  // 閲嶅啓 clear
  localStorage.clear = function() {
    if (confirm('纭畾瑕佹竻闄ゆ墍鏈夋暟鎹悧锛熻繖涔熶細鍒犻櫎鏈嶅姟鍣ㄤ笂鐨勬暟鎹紒')) {
      originalClear();
    }
  };

  // 椤甸潰鍔犺浇鏃朵粠鏈嶅姟鍣ㄥ垵濮嬪寲鏁版嵁
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      loadFromServer();
    });
  } else {
    loadFromServer();
  }

  // 鏆撮湶閰嶇疆锛屽厑璁搁〉闈㈡帶鍒?
  window.LocalStorageSync = {
    CONFIG,
    loadFromServer,
    saveToServer
  };

  console.log('鉁?localStorage 鎷︽埅鍣ㄥ凡鍚敤锛屾暟鎹皢鑷姩鍚屾鍒版湇鍔″櫒');
})();

