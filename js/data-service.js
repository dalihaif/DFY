/**
 * 数据服务层 v2 - 混合存储方案
 * 功能：同时保存到服务器（持久化）和 localStorage（快速读取）
 * 读取时优先从 localStorage 读取，失败再从服务器读取
 */

const DataService = {
  API_BASE: window.location.origin.includes('localhost') 
    ? 'http://localhost:3000/api' 
    : '/api', // 生产环境使用相对路径

  USE_SERVER: true, // 是否使用服务器存储

  // 从服务器获取数据
  async _fetchFromServer(endpoint) {
    if (!this.USE_SERVER) return null;
    try {
      const response = await fetch(`${this.API_BASE}/${endpoint}`);
      if (!response.ok) return null;
      return await response.json();
    } catch (e) {
      console.warn(`从服务器获取数据失败: ${endpoint}`, e);
      return null;
    }
  },

  // 保存数据到服务器
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
      console.warn(`保存数据到服务器失败: ${endpoint}`, e);
      return false;
    }
  },

  // 获取所有数据（初始化用）
  async getAllData() {
    if (!this.USE_SERVER) return null;
    try {
      const response = await fetch(`${this.API_BASE}/all-data`);
      if (!response.ok) return null;
      return await response.json();
    } catch (e) {
      console.warn('获取所有数据失败', e);
      return null;
    }
  },

  // 初始化：从服务器加载数据到 localStorage
  async initFromServer() {
    const serverData = await this.getAllData();
    if (!serverData) return false;

    let loadedCount = 0;
    for (const [key, value] of Object.entries(serverData)) {
      const fullKey = key.includes('hm_') ? key : `hm_${key}`;
      localStorage.setItem(fullKey, JSON.stringify(value));
      loadedCount++;
    }

    console.log(`✅ 从服务器加载了 ${loadedCount} 个数据项`);
    return true;
  },

  // 保存数据到服务器和 localStorage
  async saveToServer(key, data) {
    const endpoint = this._getEndpoint(key);
    const success = await this._saveToServer(endpoint, data);
    
    if (success) {
      console.log(`✅ 数据已保存到服务器: ${key}`);
    } else {
      console.warn(`⚠️ 数据保存到服务器失败，仅保存到本地: ${key}`);
    }

    // 始终保存到 localStorage
    localStorage.setItem(key, JSON.stringify(data));
    return success;
  },

  // 辅助函数：根据 key 获取对应的 API 端点
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

// 页面加载时自动从服务器初始化数据
if (typeof window !== 'undefined') {
  window.DataService = DataService;
  
  // 页面加载完成后初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      DataService.initFromServer();
    });
  } else {
    DataService.initFromServer();
  }
}
