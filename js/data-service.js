/**
 * 鏁版嵁鏈嶅姟灞?v2 - 娣峰悎瀛樺偍鏂规
 * 鍔熻兘锛氬悓鏃朵繚瀛樺埌鏈嶅姟鍣紙鎸佷箙鍖栵級鍜?localStorage锛堝揩閫熻鍙栵級
 * 璇诲彇鏃朵紭鍏堜粠 localStorage 璇诲彇锛屽け璐ュ啀浠庢湇鍔″櫒璇诲彇
 */

const DataService = {
  API_BASE: window.location.origin.includes('localhost') 
    ? 'http://localhost:3000/api' 
    : '/api', // 鐢熶骇鐜浣跨敤鐩稿璺緞

  USE_SERVER: true, // 鏄惁浣跨敤鏈嶅姟鍣ㄥ瓨鍌?

  // 浠庢湇鍔″櫒鑾峰彇鏁版嵁
  async _fetchFromServer(endpoint) {
    if (!this.USE_SERVER) return null;
    try {
      const response = await fetch(`${this.API_BASE}/${endpoint}`);
      if (!response.ok) return null;
      return await response.json();
    } catch (e) {
      console.warn(`浠庢湇鍔″櫒鑾峰彇鏁版嵁澶辫触: ${endpoint}`, e);
      return null;
    }
  },

  // 淇濆瓨鏁版嵁鍒版湇鍔″櫒
  async _saveToServer(endpoint, data) {
    if (!this.USE_SERVER) return false;
    try {
      const response = await fetch(`${this.API_BASE}/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return response.ok;
    } catch (e) {
      console.warn(`淇濆瓨鏁版嵁鍒版湇鍔″櫒澶辫触: ${endpoint}`, e);
      return false;
    }
  },

  // 鑾峰彇鎵€鏈夋暟鎹紙鍒濆鍖栫敤锛?
  async getAllData() {
    if (!this.USE_SERVER) return null;
    try {
      const response = await fetch(`${this.API_BASE}/all-data`);
      if (!response.ok) return null;
      return await response.json();
    } catch (e) {
      console.warn('鑾峰彇鎵€鏈夋暟鎹け璐?, e);
      return null;
    }
  },

  // 鍒濆鍖栵細浠庢湇鍔″櫒鍔犺浇鏁版嵁鍒?localStorage
  async initFromServer() {
    const serverData = await this.getAllData();
    if (!serverData) return false;

    let loadedCount = 0;
    for (const [key, value] of Object.entries(serverData)) {
      const fullKey = key.includes('hm_') ? key : `hm_${key}`;
      localStorage.setItem(fullKey, JSON.stringify(value));
      loadedCount++;
    }

    console.log(`鉁?浠庢湇鍔″櫒鍔犺浇浜?${loadedCount} 涓暟鎹」`);
    return true;
  },

  // 淇濆瓨鏁版嵁鍒版湇鍔″櫒鍜?localStorage
  async saveToServer(key, data) {
    const endpoint = this._getEndpoint(key);
    const success = await this._saveToServer(endpoint, data);
    
    if (success) {
      console.log(`鉁?鏁版嵁宸蹭繚瀛樺埌鏈嶅姟鍣? ${key}`);
    } else {
      console.warn(`鈿狅笍 鏁版嵁淇濆瓨鍒版湇鍔″櫒澶辫触锛屼粎淇濆瓨鍒版湰鍦? ${key}`);
    }

    // 濮嬬粓淇濆瓨鍒?localStorage
    localStorage.setItem(key, JSON.stringify(data));
    return success;
  },

  // 杈呭姪鍑芥暟锛氭牴鎹?key 鑾峰彇瀵瑰簲鐨?API 绔偣
  _getEndpoint(key) {
    const endpointMap = {
      'hm_content': 'content',
      'hm_settings': 'settings',
      'hm_admin_sections': 'sections',
      'hm_announcements': 'announcements',
      'hm_staff': 'staff'
    };
    return endpointMap[key] || key.replace('hm_', '');
  }
};

// 椤甸潰鍔犺浇鏃惰嚜鍔ㄤ粠鏈嶅姟鍣ㄥ垵濮嬪寲鏁版嵁
if (typeof window !== 'undefined') {
  window.DataService = DataService;
  
  // 椤甸潰鍔犺浇瀹屾垚鍚庡垵濮嬪寲
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      DataService.initFromServer();
    });
  } else {
    DataService.initFromServer();
  }
}

