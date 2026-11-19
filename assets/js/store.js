/**
 * Central API Data Store for LHPIC
 * Kết nối trực tiếp tới Vercel Serverless API (/api/*) + PostgreSQL
 * Mọi dữ liệu được lưu tập trung trên cơ sở dữ liệu và đồng bộ trên mọi thiết bị.
 */

class LHPICStore {
  async request(url, options = {}) {
    const res = await fetch(url, {
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
      ...options,
    });

    let data = {};
    try {
      data = await res.json();
    } catch {
      data = {};
    }

    if (!res.ok) {
      const error = new Error(data.error || `Lỗi máy chủ (${res.status})`);
      error.status = res.status;
      throw error;
    }

    return data;
  }

  // Trích xuất Folder ID từ mọi định dạng link Google Drive
  extractDriveFolderId(url) {
    if (!url) return '';
    const match = String(url).match(/[-\w]{25,}/);
    return match ? match[0] : String(url).trim();
  }

  // ============ EVENTS CRUD ============
  async getEvents() {
    const data = await this.request('/api/events', { method: 'GET' });
    return Array.isArray(data.events) ? data.events : [];
  }

  async addEvent(eventData) {
    const data = await this.request('/api/events', {
      method: 'POST',
      body: JSON.stringify(eventData),
    });
    window.dispatchEvent(new CustomEvent('lhpic_data_updated', { detail: { type: 'events' } }));
    return data.event;
  }

  async updateEvent(id, updatedFields) {
    const data = await this.request(`/api/events?id=${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify({ ...updatedFields, id }),
    });
    window.dispatchEvent(new CustomEvent('lhpic_data_updated', { detail: { type: 'events' } }));
    return data.event;
  }

  async deleteEvent(id) {
    await this.request(`/api/events?id=${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
    window.dispatchEvent(new CustomEvent('lhpic_data_updated', { detail: { type: 'events' } }));
    return true;
  }

  // ============ ALBUMS (FOLDER TỪNG BUỔI) CRUD ============
  async getAlbums() {
    const data = await this.request('/api/albums', { method: 'GET' });
    return Array.isArray(data.albums) ? data.albums : [];
  }

  async addAlbum(albumData) {
    const data = await this.request('/api/albums', {
      method: 'POST',
      body: JSON.stringify(albumData),
    });
    window.dispatchEvent(new CustomEvent('lhpic_data_updated', { detail: { type: 'albums' } }));
    return data.album;
  }

  async updateAlbum(id, updatedFields) {
    const data = await this.request(`/api/albums?id=${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify({ ...updatedFields, id }),
    });
    window.dispatchEvent(new CustomEvent('lhpic_data_updated', { detail: { type: 'albums' } }));
    return data.album;
  }

  async deleteAlbum(id) {
    await this.request(`/api/albums?id=${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
    window.dispatchEvent(new CustomEvent('lhpic_data_updated', { detail: { type: 'albums' } }));
    return true;
  }

  // ============ CONTACT MESSAGES (HỘM THƯ TIN NHẮN) ============
  async getMessages() {
    const data = await this.request('/api/messages', { method: 'GET' });
    return Array.isArray(data.messages) ? data.messages : [];
  }

  async addMessage(msgData) {
    const data = await this.request('/api/messages', {
      method: 'POST',
      body: JSON.stringify(msgData),
    });
    window.dispatchEvent(new CustomEvent('lhpic_data_updated', { detail: { type: 'messages' } }));
    return data.message;
  }

  async markMessageRead(id) {
    const data = await this.request(`/api/messages?id=${encodeURIComponent(id)}`, {
      method: 'PATCH',
      body: JSON.stringify({ id, status: 'read' }),
    });
    window.dispatchEvent(new CustomEvent('lhpic_data_updated', { detail: { type: 'messages' } }));
    return data.message;
  }

  async deleteMessage(id) {
    await this.request(`/api/messages?id=${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
    window.dispatchEvent(new CustomEvent('lhpic_data_updated', { detail: { type: 'messages' } }));
    return true;
  }

  // Reset dữ liệu mẫu trên DB (chỉ Admin)
  async resetDefaults() {
    await this.request('/api/reset', { method: 'POST' });
    window.dispatchEvent(new CustomEvent('lhpic_data_updated', { detail: { type: 'all' } }));
    return true;
  }

  // ============ AUTH (SERVER-SIDE HTTPONLY COOKIE) ============
  async checkAuth() {
    try {
      const data = await this.request('/api/auth', { method: 'GET' });
      return { authenticated: !!data.authenticated, user: data.user || null };
    } catch {
      return { authenticated: false, user: null };
    }
  }

  async login(username, password) {
    try {
      const data = await this.request('/api/auth', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      });
      return { success: true, user: data.user };
    } catch (err) {
      return { success: false, message: err.message || 'Đăng nhập thất bại.' };
    }
  }

  async logout() {
    await this.request('/api/auth', { method: 'DELETE' });
    return true;
  }
}

window.LHPIC = window.LHPIC || {};
window.LHPIC.store = new LHPICStore();
