/**
 * Admin CMS Functionality for LHPIC
 */

function initAdminPage() {
  const store = window.LHPIC.store;
  const ICONS = window.LHPIC.ICONS;

  // Views
  const loginView = document.getElementById('login-view');
  const dashboardView = document.getElementById('dashboard-view');

  // Login Form
  const loginForm = document.getElementById('admin-login-form');
  const logoutBtn = document.getElementById('logout-btn');

  // Stats
  const statTotalEvents = document.getElementById('stat-total-events');
  const statUpcomingEvents = document.getElementById('stat-upcoming-events');
  const statTotalPhotos = document.getElementById('stat-total-photos');

  // Tabs
  const tabEventsBtn = document.getElementById('tab-events-btn');
  const tabGalleryBtn = document.getElementById('tab-gallery-btn');
  const sectionEvents = document.getElementById('section-events');
  const sectionGallery = document.getElementById('section-gallery');

  // Events Table & Modal
  const eventsTbody = document.getElementById('admin-events-tbody');
  const openAddEventBtn = document.getElementById('open-add-event-btn');
  const eventFormModal = document.getElementById('event-form-modal');
  const closeEventFormBtn = document.getElementById('close-event-form-btn');
  const cancelEventFormBtn = document.getElementById('cancel-event-form-btn');
  const eventEditForm = document.getElementById('event-edit-form');
  const eventFormTitle = document.getElementById('event-form-title');

  // Gallery
  const addPhotoForm = document.getElementById('add-photo-form');
  const photoFileInput = document.getElementById('photo-file-input');
  const photoUrlInput = document.getElementById('photo-url-input');
  const photoPreviewContainer = document.getElementById('photo-preview-container');
  const photoPreviewImg = document.getElementById('photo-preview-img');
  const adminGalleryGrid = document.getElementById('admin-gallery-grid');

  // Reset & Backup
  const resetDefaultsBtn = document.getElementById('reset-defaults-btn');
  const exportJsonBtn = document.getElementById('export-json-btn');

  let activePhotoDataUrl = '';

  // Auth Check
  function checkAuth() {
    if (store.isAuthenticated()) {
      loginView.classList.add('hidden');
      dashboardView.classList.remove('hidden');
      dashboardView.classList.add('flex');
      renderDashboard();
    } else {
      loginView.classList.remove('hidden');
      dashboardView.classList.add('hidden');
      dashboardView.classList.remove('flex');
    }
  }

  // Handle Login
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const u = document.getElementById('login-username').value.trim();
      const p = document.getElementById('login-password').value.trim();

      const res = store.login(u, p);
      if (res.success) {
        window.LHPIC.showToast('Đăng nhập thành công!');
        checkAuth();
      } else {
        alert(res.message);
      }
    });
  }

  // Handle Logout
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      store.logout();
      window.LHPIC.showToast('Đã đăng xuất.');
      checkAuth();
    });
  }

  // Switch Tabs
  tabEventsBtn.addEventListener('click', () => {
    tabEventsBtn.className = 'px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer bg-white text-slate-900 shadow-xs border border-slate-200';
    tabGalleryBtn.className = 'px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-white/60 transition-all cursor-pointer';
    sectionEvents.classList.remove('hidden');
    sectionGallery.classList.add('hidden');
  });

  tabGalleryBtn.addEventListener('click', () => {
    tabGalleryBtn.className = 'px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer bg-white text-slate-900 shadow-xs border border-slate-200';
    tabEventsBtn.className = 'px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-white/60 transition-all cursor-pointer';
    sectionGallery.classList.remove('hidden');
    sectionEvents.classList.add('hidden');
  });

  // Render Dashboard
  function renderDashboard() {
    renderStats();
    renderEventsTable();
    renderGalleryGrid();
  }

  function renderStats() {
    const events = store.getEvents();
    const gallery = store.getGallery();

    if (statTotalEvents) statTotalEvents.textContent = events.length;
    if (statUpcomingEvents) statUpcomingEvents.textContent = events.filter(e => e.status === 'upcoming').length;
    if (statTotalPhotos) statTotalPhotos.textContent = gallery.length;
  }

  // ============ EVENTS CRUD ============
  function renderEventsTable() {
    const events = store.getEvents();

    if (events.length === 0) {
      eventsTbody.innerHTML = `<tr><td colspan="5" class="p-6 text-center text-slate-400">Chưa có sự kiện nào. Hãy nhấn "Thêm Sự Kiện Mới".</td></tr>`;
      return;
    }

    eventsTbody.innerHTML = events.map(evt => {
      let statusBadge = '';
      if (evt.status === 'upcoming') {
        statusBadge = `<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">Sắp diễn ra</span>`;
      } else if (evt.status === 'ongoing') {
        statusBadge = `<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-50 text-green-700 border border-green-200">Đang diễn ra</span>`;
      } else {
        statusBadge = `<span class="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-600">Đã kết thúc</span>`;
      }

      return `
        <tr class="hover:bg-slate-50 transition-colors">
          <td class="p-3.5 font-bold text-slate-900 max-w-xs">
            <div class="line-clamp-1">${evt.title}</div>
            <div class="text-[11px] font-normal text-slate-400">${evt.category}</div>
          </td>
          <td class="p-3.5">${statusBadge}</td>
          <td class="p-3.5 font-mono text-slate-700">
            <div>${evt.date}</div>
            <div class="text-[10px] text-slate-400 font-sans">${evt.time}</div>
          </td>
          <td class="p-3.5 text-slate-600 max-w-xs truncate">${evt.location}</td>
          <td class="p-3.5 text-right space-x-2">
            <button type="button" onclick="window.editEvent('${evt.id}')" 
                    class="px-2.5 py-1 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg font-bold text-[11px] cursor-pointer">
              Sửa
            </button>
            <button type="button" onclick="window.deleteEventConfirm('${evt.id}')" 
                    class="px-2.5 py-1 text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-lg font-bold text-[11px] cursor-pointer">
              Xóa
            </button>
          </td>
        </tr>
      `;
    }).join('');
  }

  // Open Add Event Modal
  openAddEventBtn.addEventListener('click', () => {
    eventEditForm.reset();
    document.getElementById('form-event-id').value = '';
    document.getElementById('form-date').value = new Date().toISOString().split('T')[0];
    eventFormTitle.textContent = 'Thêm Sự Kiện / Buổi Sinh Hoạt Mới';
    eventFormModal.classList.remove('hidden');
  });

  function closeEventModal() {
    eventFormModal.classList.add('hidden');
  }

  closeEventFormBtn.addEventListener('click', closeEventModal);
  cancelEventFormBtn.addEventListener('click', closeEventModal);

  // Edit Event
  window.editEvent = function(id) {
    const events = store.getEvents();
    const evt = events.find(e => e.id === id);
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

    eventFormTitle.textContent = 'Chỉnh Sửa Sự Kiện: ' + evt.title;
    eventFormModal.classList.remove('hidden');
  };

  // Submit Event Form
  eventEditForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = document.getElementById('form-event-id').value;

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

    if (id) {
      store.updateEvent(id, data);
      window.LHPIC.showToast('Cập nhật sự kiện thành công!');
    } else {
      store.addEvent(data);
      window.LHPIC.showToast('Thêm sự kiện mới thành công!');
    }

    closeEventModal();
    renderDashboard();
  });

  // Delete Event
  window.deleteEventConfirm = function(id) {
    if (confirm('Bạn có chắc chắn muốn xóa sự kiện này? Hành động không thể hoàn tác.')) {
      store.deleteEvent(id);
      window.LHPIC.showToast('Đã xóa sự kiện.');
      renderDashboard();
    }
  };

  // ============ GALLERY CRUD ============
  function renderGalleryGrid() {
    const gallery = store.getGallery();

    if (gallery.length === 0) {
      adminGalleryGrid.innerHTML = `<p class="col-span-full text-center text-slate-400 py-6 text-xs">Thư viện chưa có ảnh nào.</p>`;
      return;
    }

    adminGalleryGrid.innerHTML = gallery.map(item => {
      return `
        <div class="relative bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs group">
          <div class="aspect-4/3 overflow-hidden bg-slate-100">
            <img src="${item.imageUrl}" alt="${item.title}" class="w-full h-full object-cover" />
          </div>
          <div class="p-3 space-y-1">
            <span class="text-[10px] font-mono text-orange-600 font-bold uppercase block">${item.category}</span>
            <div class="text-xs font-bold text-slate-900 truncate">${item.title}</div>
            <div class="text-[11px] text-slate-400 truncate">${item.caption || item.date}</div>
          </div>
          <button type="button" onclick="window.deletePhotoConfirm('${item.id}')" 
                  class="absolute top-2 right-2 p-1.5 rounded-lg bg-red-600/90 hover:bg-red-600 text-white shadow-sm transition-transform cursor-pointer" 
                  title="Xóa ảnh này">
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
          </button>
        </div>
      `;
    }).join('');
  }

  // Handle Photo File Pick
  if (photoFileInput) {
    photoFileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
          activePhotoDataUrl = event.target.result;
          photoPreviewImg.src = activePhotoDataUrl;
          photoPreviewContainer.classList.remove('hidden');
          photoUrlInput.value = '';
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // Handle Photo URL Input
  if (photoUrlInput) {
    photoUrlInput.addEventListener('input', (e) => {
      const url = e.target.value.trim();
      if (url) {
        activePhotoDataUrl = url;
        photoPreviewImg.src = url;
        photoPreviewContainer.classList.remove('hidden');
      }
    });
  }

  // Submit Photo Form
  if (addPhotoForm) {
    addPhotoForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const title = document.getElementById('photo-title').value.trim();
      const category = document.getElementById('photo-category').value;
      const date = document.getElementById('photo-date').value.trim() || 'Tháng 11/2024';
      const caption = document.getElementById('photo-caption').value.trim();
      const imageUrl = activePhotoDataUrl || photoUrlInput.value.trim();

      if (!imageUrl) {
        alert('Vui lòng chọn 1 file ảnh từ máy hoặc nhập đường dẫn ảnh (URL)!');
        return;
      }

      store.addPhoto({
        title,
        category,
        date,
        caption,
        imageUrl,
      });

      window.LHPIC.showToast('Đã tải ảnh lên thư viện thành công!');
      addPhotoForm.reset();
      activePhotoDataUrl = '';
      photoPreviewContainer.classList.add('hidden');
      renderDashboard();
    });
  }

  // Delete Photo
  window.deletePhotoConfirm = function(id) {
    if (confirm('Bạn có chắc muốn xóa ảnh này khỏi thư viện?')) {
      store.deletePhoto(id);
      window.LHPIC.showToast('Đã xóa ảnh.');
      renderDashboard();
    }
  };

  // Reset to default
  if (resetDefaultsBtn) {
    resetDefaultsBtn.addEventListener('click', () => {
      if (confirm('Khôi phục toàn bộ dữ liệu sự kiện và ảnh về mặc định ban đầu?')) {
        store.resetDefaults();
        window.LHPIC.showToast('Đã khôi phục dữ liệu ban đầu.');
        renderDashboard();
      }
    });
  }

  // Export JSON
  if (exportJsonBtn) {
    exportJsonBtn.addEventListener('click', () => {
      const data = {
        events: store.getEvents(),
        gallery: store.getGallery(),
        exportedAt: new Date().toISOString(),
      };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `lhpic_backup_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      window.LHPIC.showToast('Đã xuất file sao lưu JSON!');
    });
  }

  // Initial Auth Check
  checkAuth();
}

window.initAdminPage = initAdminPage;
