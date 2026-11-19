/**
 * Admin CMS Functionality for LHPIC
 * Kết nối trực tiếp Vercel Serverless API (/api/*) + PostgreSQL
 */

async function initAdminPage() {
  const store = window.LHPIC.store;
  const ICONS = window.LHPIC.ICONS;
  const esc = window.LHPIC.escapeHtml;
  const safeUrl = window.LHPIC.sanitizeUrl;

  // Cached state from DB
  let cachedEvents = [];
  let cachedAlbums = [];
  let cachedMessages = [];

  // Views
  const loginView = document.getElementById('login-view');
  const dashboardView = document.getElementById('dashboard-view');

  // Login Form
  const loginForm = document.getElementById('admin-login-form');
  const loginSubmitBtn = document.getElementById('login-submit-btn');
  const logoutBtn = document.getElementById('logout-btn');

  // Stats
  const statTotalEvents = document.getElementById('stat-total-events');
  const statUpcomingEvents = document.getElementById('stat-upcoming-events');
  const statTotalAlbums = document.getElementById('stat-total-albums');
  const statTotalMessages = document.getElementById('stat-total-messages');
  const statUnreadMessages = document.getElementById('stat-unread-messages');
  const tabMessagesBadge = document.getElementById('tab-messages-badge');

  // Tabs
  const tabEventsBtn = document.getElementById('tab-events-btn');
  const tabGalleryBtn = document.getElementById('tab-gallery-btn');
  const tabMessagesBtn = document.getElementById('tab-messages-btn');
  const sectionEvents = document.getElementById('section-events');
  const sectionGallery = document.getElementById('section-gallery');
  const sectionMessages = document.getElementById('section-messages');
  const adminMessagesList = document.getElementById('admin-messages-list');

  // Events Table & Modal
  const eventsTbody = document.getElementById('admin-events-tbody');
  const openAddEventBtn = document.getElementById('open-add-event-btn');
  const eventFormModal = document.getElementById('event-form-modal');
  const closeEventFormBtn = document.getElementById('close-event-form-btn');
  const cancelEventFormBtn = document.getElementById('cancel-event-form-btn');
  const eventEditForm = document.getElementById('event-edit-form');
  const eventFormTitle = document.getElementById('event-form-title');

  // Albums (Folder Từng Buổi & Google Drive)
  const addAlbumForm = document.getElementById('add-album-form');
  const albumUrlInput = document.getElementById('album-url-input');
  const albumPreviewContainer = document.getElementById('album-preview-container');
  const albumPreviewImg = document.getElementById('album-preview-img');
  const adminAlbumsGrid = document.getElementById('admin-albums-grid');

  // Reset & Backup
  const resetDefaultsBtn = document.getElementById('reset-defaults-btn');
  const exportJsonBtn = document.getElementById('export-json-btn');

  // Auth Check (Server-side cookie)
  async function checkAuth() {
    const auth = await store.checkAuth();
    if (auth.authenticated) {
      loginView.classList.add('hidden');
      dashboardView.classList.remove('hidden');
      dashboardView.classList.add('flex');
      await refreshDashboard();
    } else {
      loginView.classList.remove('hidden');
      dashboardView.classList.add('hidden');
      dashboardView.classList.remove('flex');
    }
  }

  // Handle Login
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const u = document.getElementById('login-username').value.trim();
      const p = document.getElementById('login-password').value.trim();

      if (loginSubmitBtn) {
        loginSubmitBtn.disabled = true;
        loginSubmitBtn.textContent = 'Đang xác thực...';
      }

      try {
        const res = await store.login(u, p);
        if (res.success) {
          window.LHPIC.showToast('Đăng nhập thành công!');
          loginForm.reset();
          await checkAuth();
        } else {
          window.LHPIC.showToast(res.message || 'Đăng nhập thất bại.', 'error');
        }
      } finally {
        if (loginSubmitBtn) {
          loginSubmitBtn.disabled = false;
          loginSubmitBtn.textContent = 'Đăng Nhập Vào Hệ Thống';
        }
      }
    });
  }

  // Handle Logout
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      try {
        await store.logout();
        window.LHPIC.showToast('Đã đăng xuất.');
        await checkAuth();
      } catch (err) {
        window.LHPIC.showToast(err.message || 'Lỗi khi đăng xuất.', 'error');
      }
    });
  }

  // Switch Tabs
  const TAB_ACTIVE_CLASS = 'px-4 sm:px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer bg-white text-slate-900 shadow-xs border border-slate-200 flex items-center gap-2';
  const TAB_INACTIVE_CLASS = 'px-4 sm:px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-white/60 transition-all cursor-pointer flex items-center gap-2';

  function setActiveTab(tab) {
    tabEventsBtn.className = TAB_INACTIVE_CLASS;
    tabGalleryBtn.className = TAB_INACTIVE_CLASS;
    if (tabMessagesBtn) tabMessagesBtn.className = TAB_INACTIVE_CLASS;

    sectionEvents.classList.add('hidden');
    sectionGallery.classList.add('hidden');
    if (sectionMessages) sectionMessages.classList.add('hidden');

    if (tab === 'events') {
      tabEventsBtn.className = TAB_ACTIVE_CLASS;
      sectionEvents.classList.remove('hidden');
    } else if (tab === 'gallery') {
      tabGalleryBtn.className = TAB_ACTIVE_CLASS;
      sectionGallery.classList.remove('hidden');
    } else if (tab === 'messages') {
      if (tabMessagesBtn) tabMessagesBtn.className = TAB_ACTIVE_CLASS;
      if (sectionMessages) sectionMessages.classList.remove('hidden');
    }
  }

  tabEventsBtn.addEventListener('click', () => setActiveTab('events'));
  tabGalleryBtn.addEventListener('click', () => setActiveTab('gallery'));
  if (tabMessagesBtn) {
    tabMessagesBtn.addEventListener('click', () => setActiveTab('messages'));
  }

  // Fetch all data from DB and render Dashboard
  async function refreshDashboard() {
    try {
      const [events, albums, messages] = await Promise.all([
        store.getEvents(),
        store.getAlbums(),
        store.getMessages(),
      ]);
      cachedEvents = events;
      cachedAlbums = albums;
      cachedMessages = messages;

      renderStats();
      renderEventsTable();
      renderAlbumsGrid();
      renderMessagesList();
    } catch (err) {
      console.error('Lỗi tải dữ liệu dashboard:', err);
      if (err.status === 401) {
        await checkAuth();
        return;
      }
      window.LHPIC.showToast(err.message || 'Không thể tải dữ liệu từ cơ sở dữ liệu.', 'error');
    }
  }

  function renderStats() {
    if (statTotalEvents) statTotalEvents.textContent = cachedEvents.length;
    if (statUpcomingEvents) statUpcomingEvents.textContent = cachedEvents.filter(e => e.status === 'upcoming').length;
    if (statTotalAlbums) statTotalAlbums.textContent = cachedAlbums.length;
    if (statTotalMessages) statTotalMessages.textContent = cachedMessages.length;

    const unreadCount = cachedMessages.filter(m => m.status === 'new').length;
    if (statUnreadMessages) {
      if (unreadCount > 0) {
        statUnreadMessages.textContent = `${unreadCount} mới`;
        statUnreadMessages.classList.remove('hidden');
      } else {
        statUnreadMessages.classList.add('hidden');
      }
    }
    if (tabMessagesBadge) {
      if (unreadCount > 0) {
        tabMessagesBadge.textContent = unreadCount;
        tabMessagesBadge.classList.remove('hidden');
      } else {
        tabMessagesBadge.classList.add('hidden');
      }
    }
  }

  // ============ EVENTS CRUD ============
  function renderEventsTable() {
    if (cachedEvents.length === 0) {
      eventsTbody.innerHTML = `<tr><td colspan="5" class="p-6 text-center text-slate-400">Chưa có buổi sinh hoạt nào. Nhấn "Thêm Buổi Sinh Hoạt Mới" để tạo.</td></tr>`;
      return;
    }

    eventsTbody.innerHTML = cachedEvents.map(evt => {
      let statusBadge = '';
      if (evt.status === 'upcoming') {
        statusBadge = `<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">Sắp diễn ra</span>`;
      } else if (evt.status === 'ongoing') {
        statusBadge = `<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-50 text-green-700 border border-green-200">Đang mở thử thách</span>`;
      } else {
        statusBadge = `<span class="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-600">Đã diễn ra</span>`;
      }

      return `
        <tr class="hover:bg-slate-50 transition-colors">
          <td class="p-3.5 font-bold text-slate-900 max-w-xs">
            <div class="line-clamp-1">${esc(evt.title)}</div>
            <div class="text-[11px] font-normal text-slate-400">${esc(evt.category)}</div>
          </td>
          <td class="p-3.5">${statusBadge}</td>
          <td class="p-3.5 font-mono text-slate-700">
            <div>${esc(evt.date)}</div>
            <div class="text-[10px] text-slate-400 font-sans">${esc(evt.time)}</div>
          </td>
          <td class="p-3.5 text-slate-600 max-w-xs truncate">${esc(evt.location)}</td>
          <td class="p-3.5 text-right space-x-2">
            <button type="button" data-edit-event="${esc(evt.id)}"
                    class="px-2.5 py-1 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg font-bold text-[11px] cursor-pointer">
              Sửa
            </button>
            <button type="button" data-delete-event="${esc(evt.id)}"
                    class="px-2.5 py-1 text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-lg font-bold text-[11px] cursor-pointer">
              Xóa
            </button>
          </td>
        </tr>
      `;
    }).join('');
  }

  eventsTbody.addEventListener('click', (e) => {
    const editBtn = e.target.closest('[data-edit-event]');
    if (editBtn) {
      openEditEvent(editBtn.getAttribute('data-edit-event'));
      return;
    }
    const delBtn = e.target.closest('[data-delete-event]');
    if (delBtn) {
      deleteEventConfirm(delBtn.getAttribute('data-delete-event'));
    }
  });

  // Open Add Event Modal
  openAddEventBtn.addEventListener('click', () => {
    eventEditForm.reset();
    document.getElementById('form-event-id').value = '';
    document.getElementById('form-date').value = new Date().toISOString().split('T')[0];
    eventFormTitle.textContent = 'Thêm Buổi Sinh Hoạt / Chuyên Đề Mới';
    eventFormModal.classList.remove('hidden');
  });

  function closeEventModal() {
    eventFormModal.classList.add('hidden');
  }

  closeEventFormBtn.addEventListener('click', closeEventModal);
  cancelEventFormBtn.addEventListener('click', closeEventModal);

  function openEditEvent(id) {
    const evt = cachedEvents.find(e => e.id === id);
    if (!evt) return;

    document.getElementById('form-event-id').value = evt.id;
    document.getElementById('form-title').value = evt.title;
    document.getElementById('form-status').value = evt.status;
    document.getElementById('form-category').value = evt.category;
    document.getElementById('form-date').value = evt.date;
    document.getElementById('form-time').value = evt.time;
    document.getElementById('form-location').value = evt.location;
    document.getElementById('form-instructor').value = evt.instructor || '';
    document.getElementById('form-cover').value = evt.coverImage || '';
    document.getElementById('form-summary').value = evt.summary || '';
    document.getElementById('form-content').value = evt.content || '';
    document.getElementById('form-doclink').value = evt.docLink || '';
    document.getElementById('form-contestlink').value = evt.contestLink || '';

    eventFormTitle.textContent = 'Chỉnh Sửa: ' + evt.title;
    eventFormModal.classList.remove('hidden');
  }

  // Submit Event Form
  eventEditForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('form-event-id').value;
    const submitBtn = eventEditForm.querySelector('button[type="submit"]');
    const origText = submitBtn ? submitBtn.textContent : '';

    const data = {
      title: document.getElementById('form-title').value.trim(),
      status: document.getElementById('form-status').value,
      category: document.getElementById('form-category').value,
      date: document.getElementById('form-date').value,
      time: document.getElementById('form-time').value.trim(),
      location: document.getElementById('form-location').value.trim(),
      instructor: document.getElementById('form-instructor').value.trim(),
      coverImage: document.getElementById('form-cover').value.trim() || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800',
      summary: document.getElementById('form-summary').value.trim(),
      content: document.getElementById('form-content').value.trim(),
      docLink: document.getElementById('form-doclink').value.trim(),
      contestLink: document.getElementById('form-contestlink').value.trim(),
    };

    try {
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Đang lưu...';
      }

      if (id) {
        await store.updateEvent(id, data);
        window.LHPIC.showToast('Cập nhật buổi sinh hoạt thành công!');
      } else {
        await store.addEvent(data);
        window.LHPIC.showToast('Thêm buổi sinh hoạt mới thành công!');
      }

      closeEventModal();
      await refreshDashboard();
    } catch (err) {
      window.LHPIC.showToast(err.message || 'Lỗi khi lưu buổi sinh hoạt.', 'error');
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = origText;
      }
    }
  });

  async function deleteEventConfirm(id) {
    if (!confirm('Bạn có chắc chắn muốn xóa buổi sinh hoạt này?')) return;
    try {
      await store.deleteEvent(id);
      window.LHPIC.showToast('Đã xóa buổi sinh hoạt.');
      await refreshDashboard();
    } catch (err) {
      window.LHPIC.showToast(err.message || 'Lỗi khi xóa buổi sinh hoạt.', 'error');
    }
  }

  // ============ ALBUMS (FOLDERS TỪNG BUỔI & GOOGLE DRIVE) ============
  function renderAlbumsGrid() {
    if (cachedAlbums.length === 0) {
      adminAlbumsGrid.innerHTML = `<p class="col-span-full text-center text-slate-400 py-6 text-xs">Chưa có folder ảnh nào.</p>`;
      return;
    }

    adminAlbumsGrid.innerHTML = cachedAlbums.map(alb => {
      return `
        <div class="relative bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs group">
          <div class="aspect-4/3 overflow-hidden bg-slate-100">
            <img src="${safeUrl(alb.coverImage, 'assets/images/panda-logo.svg')}" alt="${esc(alb.title)}" class="w-full h-full object-cover" />
          </div>
          <div class="p-3.5 space-y-1.5">
            <div class="flex items-center justify-between">
              <span class="text-[10px] font-mono text-orange-600 font-bold uppercase">${esc(alb.sessionName)}</span>
              <span class="text-[10px] text-slate-400 font-mono">${esc(alb.date)}</span>
            </div>
            <div class="text-xs font-bold text-slate-900 truncate">${esc(alb.title)}</div>
            <div class="pt-1 flex items-center justify-between">
              <a href="${safeUrl(alb.driveLink, '#')}" target="_blank" rel="noopener noreferrer" class="text-[11px] font-bold text-blue-600 hover:underline flex items-center gap-1">
                ${ICONS.drive} Mở Google Drive
              </a>
              <span class="text-[10px] text-slate-400">Xem trực tiếp</span>
            </div>
          </div>
          <button type="button" data-delete-album="${esc(alb.id)}"
                  class="absolute top-2 right-2 p-1.5 rounded-lg bg-red-600/90 hover:bg-red-600 text-white shadow-sm transition-transform cursor-pointer" 
                  title="Xóa folder này">
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
          </button>
        </div>
      `;
    }).join('');
  }

  adminAlbumsGrid.addEventListener('click', (e) => {
    const delBtn = e.target.closest('[data-delete-album]');
    if (delBtn) {
      deleteAlbumConfirm(delBtn.getAttribute('data-delete-album'));
    }
  });

  // Handle Cover URL Input Preview
  if (albumUrlInput) {
    albumUrlInput.addEventListener('input', (e) => {
      const url = e.target.value.trim();
      if (url && /^https?:\/\//i.test(url)) {
        albumPreviewImg.src = url;
        albumPreviewContainer.classList.remove('hidden');
      } else {
        albumPreviewContainer.classList.add('hidden');
      }
    });
  }

  // Submit Album Form
  if (addAlbumForm) {
    addAlbumForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = addAlbumForm.querySelector('button[type="submit"]');
      const origText = submitBtn ? submitBtn.textContent : '';

      const sessionName = document.getElementById('album-session').value.trim();
      const title = document.getElementById('album-title').value.trim();
      const date = document.getElementById('album-date').value.trim() || new Date().toLocaleDateString('vi-VN');
      const driveLink = document.getElementById('album-drivelink').value.trim();
      const description = document.getElementById('album-description').value.trim();
      const coverImage = (albumUrlInput ? albumUrlInput.value.trim() : '') || 'https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1000';

      try {
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.textContent = 'Đang tạo...';
        }

        await store.addAlbum({
          sessionName,
          title,
          date,
          driveLink,
          description,
          coverImage,
        });

        window.LHPIC.showToast(`Đã tạo thư mục Google Drive "${sessionName}" thành công!`);
        addAlbumForm.reset();
        if (albumPreviewContainer) albumPreviewContainer.classList.add('hidden');
        await refreshDashboard();
      } catch (err) {
        window.LHPIC.showToast(err.message || 'Lỗi khi tạo thư mục ảnh.', 'error');
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = origText;
        }
      }
    });
  }

  async function deleteAlbumConfirm(id) {
    if (!confirm('Bạn có chắc muốn xóa thư mục ảnh buổi sinh hoạt này?')) return;
    try {
      await store.deleteAlbum(id);
      window.LHPIC.showToast('Đã xóa thư mục ảnh.');
      await refreshDashboard();
    } catch (err) {
      window.LHPIC.showToast(err.message || 'Lỗi khi xóa thư mục ảnh.', 'error');
    }
  }

  // ============ CONTACT MESSAGES (HỘM THƯ HỎI ĐÁP) ============
  function renderMessagesList() {
    if (!adminMessagesList) return;

    if (cachedMessages.length === 0) {
      adminMessagesList.innerHTML = `
        <div class="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-400 text-xs">
          Hòm thư hiện tại đang trống. Tin nhắn của học sinh &amp; phụ huynh từ trang Liên hệ sẽ hiển thị tại đây.
        </div>
      `;
      return;
    }

    adminMessagesList.innerHTML = cachedMessages.map(msg => {
      const isNew = msg.status === 'new';
      const cleanPhone = (msg.phone || '').replace(/[^0-9]/g, '');
      const initials = esc((msg.name || 'U').charAt(0).toUpperCase());

      return `
        <div class="bg-white rounded-2xl p-5 sm:p-6 transition-all border ${isNew ? 'border-orange-300 ring-2 ring-orange-100 shadow-sm' : 'border-slate-200'} space-y-4">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl ${isNew ? 'bg-orange-100 text-orange-700' : 'bg-slate-100 text-slate-600'} flex items-center justify-center font-extrabold text-sm">
                ${initials}
              </div>
              <div>
                <div class="flex items-center gap-2">
                  <h4 class="font-extrabold text-slate-900 text-sm font-heading">${esc(msg.name)}</h4>
                  ${isNew
                    ? '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-600 text-white">Mới</span>'
                    : '<span class="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-600">Đã đọc</span>'}
                </div>
                <div class="text-[11px] text-slate-500 flex flex-wrap items-center gap-2 mt-0.5">
                  <span>${esc(msg.school || 'Chưa ghi rõ trường')}</span>
                  <span>&bull;</span>
                  <span class="font-semibold text-slate-700">${esc(msg.grade || 'Học sinh')}</span>
                </div>
              </div>
            </div>
            <div class="text-right text-[11px] font-mono text-slate-400">
              ${esc(msg.createdAt || '')}
            </div>
          </div>

          <!-- Message body -->
          <div class="text-xs text-slate-800 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100 font-sans whitespace-pre-wrap">${esc(msg.message)}</div>

          <!-- Bottom Contact Actions -->
          <div class="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div class="flex items-center gap-2">
              ${msg.phone ? `
                <a href="tel:${esc(cleanPhone)}" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors">
                  <svg class="w-3.5 h-3.5 text-slate-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                  <span>Gọi: ${esc(msg.phone)}</span>
                </a>
                <a href="https://zalo.me/${esc(cleanPhone)}" target="_blank" rel="noopener noreferrer" 
                   class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors">
                  <svg class="w-3.5 h-3.5 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                  <span>Mở Zalo chat</span>
                </a>
              ` : '<span class="text-xs text-slate-400">Không có SĐT</span>'}
            </div>

            <div class="flex items-center gap-2">
              ${isNew ? `
                <button type="button" data-read-msg="${esc(msg.id)}"
                        class="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer transition-colors">
                  Đánh dấu đã đọc
                </button>
              ` : ''}
              <button type="button" data-delete-msg="${esc(msg.id)}"
                      class="px-3 py-1.5 text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-lg cursor-pointer transition-colors">
                Xóa
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  if (adminMessagesList) {
    adminMessagesList.addEventListener('click', async (e) => {
      const readBtn = e.target.closest('[data-read-msg]');
      if (readBtn) {
        const id = readBtn.getAttribute('data-read-msg');
        try {
          await store.markMessageRead(id);
          window.LHPIC.showToast('Đã đánh dấu đã đọc.');
          await refreshDashboard();
        } catch (err) {
          window.LHPIC.showToast(err.message || 'Lỗi khi cập nhật trạng thái.', 'error');
        }
        return;
      }

      const delBtn = e.target.closest('[data-delete-msg]');
      if (delBtn) {
        const id = delBtn.getAttribute('data-delete-msg');
        if (!confirm('Bạn có chắc muốn xóa tin nhắn này khỏi hòm thư?')) return;
        try {
          await store.deleteMessage(id);
          window.LHPIC.showToast('Đã xóa tin nhắn.');
          await refreshDashboard();
        } catch (err) {
          window.LHPIC.showToast(err.message || 'Lỗi khi xóa tin nhắn.', 'error');
        }
      }
    });
  }

  // Reset to default
  if (resetDefaultsBtn) {
    resetDefaultsBtn.addEventListener('click', async () => {
      if (!confirm('Khôi phục toàn bộ dữ liệu buổi sinh hoạt, thư mục Drive và tin nhắn trên cơ sở dữ liệu về mặc định ban đầu?')) return;
      try {
        await store.resetDefaults();
        window.LHPIC.showToast('Đã khôi phục dữ liệu ban đầu trên cơ sở dữ liệu.');
        await refreshDashboard();
      } catch (err) {
        window.LHPIC.showToast(err.message || 'Lỗi khi khôi phục dữ liệu.', 'error');
      }
    });
  }

  // Export JSON
  if (exportJsonBtn) {
    exportJsonBtn.addEventListener('click', () => {
      const data = {
        events: cachedEvents,
        albums: cachedAlbums,
        messages: cachedMessages,
        exportedAt: new Date().toISOString(),
      };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `lhpic_backup_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      window.LHPIC.showToast('Đã xuất file sao lưu JSON (bao gồm tin nhắn)!');
    });
  }

  // Initial Auth Check
  await checkAuth();
}

window.initAdminPage = initAdminPage;
