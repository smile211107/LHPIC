/**
 * Events Page Functionality: Sinh hoạt chuyên đề & Thử thách giao lưu
 * Fetch dữ liệu động từ API (/api/events)
 */

async function initEventsPage() {
  const store = window.LHPIC.store;
  const ICONS = window.LHPIC.ICONS;
  const esc = window.LHPIC.escapeHtml;
  const safeUrl = window.LHPIC.sanitizeUrl;

  let allEvents = [];
  let currentStatus = 'all';
  let searchQuery = '';

  const gridContainer = document.getElementById('events-grid-container');
  const emptyState = document.getElementById('events-empty-state');
  const searchInput = document.getElementById('search-events-input');
  const tabButtons = document.querySelectorAll('#event-status-tabs .tab-btn');

  // Modal elements
  const modal = document.getElementById('event-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalImage = document.getElementById('modal-image');
  const modalStatusBadge = document.getElementById('modal-status-badge');
  const modalCategory = document.getElementById('modal-category');
  const modalTitle = document.getElementById('modal-title');
  const modalDateTime = document.getElementById('modal-datetime');
  const modalLocation = document.getElementById('modal-location');
  const modalInstructor = document.getElementById('modal-instructor');
  const modalContent = document.getElementById('modal-content');
  const modalActions = document.getElementById('modal-actions');

  function updateCounts(events) {
    const countAll = events.length;
    const countUpcoming = events.filter(e => e.status === 'upcoming').length;
    const countOngoing = events.filter(e => e.status === 'ongoing').length;
    const countCompleted = events.filter(e => e.status === 'completed').length;

    const elAll = document.getElementById('count-all');
    const elUpcoming = document.getElementById('count-upcoming');
    const elOngoing = document.getElementById('count-ongoing');
    const elCompleted = document.getElementById('count-completed');

    if (elAll) elAll.textContent = countAll;
    if (elUpcoming) elUpcoming.textContent = countUpcoming;
    if (elOngoing) elOngoing.textContent = countOngoing;
    if (elCompleted) elCompleted.textContent = countCompleted;
  }

  function getStatusBadge(status) {
    if (status === 'upcoming') {
      return `<span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
        <span class="w-2 h-2 rounded-full bg-amber-500"></span>Sắp diễn ra
      </span>`;
    }
    if (status === 'ongoing') {
      return `<span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-50 text-green-700 border border-green-200">
        <span class="w-2 h-2 rounded-full bg-green-500 animate-ping"></span>Đang mở thử thách
      </span>`;
    }
    return `<span class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
      Đã diễn ra
    </span>`;
  }

  function render() {
    updateCounts(allEvents);

    const filtered = allEvents.filter(evt => {
      const matchStatus = currentStatus === 'all' || evt.status === currentStatus;
      const q = searchQuery.toLowerCase();
      const matchSearch = !q ||
        (evt.title && evt.title.toLowerCase().includes(q)) ||
        (evt.category && evt.category.toLowerCase().includes(q)) ||
        (evt.summary && evt.summary.toLowerCase().includes(q)) ||
        (evt.instructor && evt.instructor.toLowerCase().includes(q));
      return matchStatus && matchSearch;
    });

    if (filtered.length === 0) {
      gridContainer.innerHTML = '';
      emptyState.classList.remove('hidden');
      return;
    }

    emptyState.classList.add('hidden');
    gridContainer.innerHTML = filtered.map(evt => {
      return `
        <div class="bg-white rounded-3xl border border-slate-200 overflow-hidden card-hover flex flex-col justify-between">
          
          <div class="relative h-48 overflow-hidden bg-slate-100">
            <img src="${safeUrl(evt.coverImage, 'assets/images/panda-logo.svg')}" alt="${esc(evt.title)}" class="w-full h-full object-cover transition-transform duration-300 hover:scale-105" loading="lazy" />
            <div class="absolute top-3.5 left-3.5">
              ${getStatusBadge(evt.status)}
            </div>
            <div class="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur-xs text-white text-xs px-2.5 py-1 rounded-md font-mono">
              ${esc(evt.date)}
            </div>
          </div>

          <div class="p-6 flex-grow flex flex-col justify-between space-y-4">
            <div>
              <span class="text-xs font-bold text-orange-600 uppercase tracking-wider block mb-1 font-heading">${esc(evt.category)}</span>
              <h3 class="text-base font-bold text-slate-900 line-clamp-2 leading-snug font-heading">${esc(evt.title)}</h3>
              <p class="text-xs text-slate-500 line-clamp-3 mt-2 leading-relaxed">${esc(evt.summary)}</p>
            </div>

            <div class="pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-600">
              <div class="flex items-center gap-2">
                <span class="text-slate-400">${ICONS.clock}</span>
                <span>${esc(evt.time)}</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-slate-400">${ICONS.mapPin}</span>
                <span class="truncate">${esc(evt.location)}</span>
              </div>
              ${evt.instructor ? `
                <div class="flex items-center gap-2 text-slate-500">
                  <span class="text-slate-400">${ICONS.user}</span>
                  <span class="truncate">${esc(evt.instructor)}</span>
                </div>
              ` : ''}
            </div>

            <div class="pt-2 flex items-center gap-2">
              <button type="button" data-open-event="${esc(evt.id)}"
                      class="w-full py-2.5 text-center rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-orange-600 transition-colors cursor-pointer">
                Xem Chi Tiết Buổi Sinh Hoạt
              </button>
            </div>
          </div>

        </div>
      `;
    }).join('');
  }

  // Event delegation for opening modal safely
  gridContainer.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-open-event]');
    if (btn) {
      window.openEventModal(btn.getAttribute('data-open-event'));
    }
  });

  // Open Event Modal
  window.openEventModal = function(id) {
    const evt = allEvents.find(e => e.id === id);
    if (!evt) return;

    modalImage.src = safeUrl(evt.coverImage, 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800');
    modalStatusBadge.innerHTML = getStatusBadge(evt.status);
    modalCategory.textContent = evt.category;
    modalTitle.textContent = evt.title;
    modalDateTime.textContent = `${evt.date} (${evt.time})`;
    modalLocation.textContent = evt.location;
    modalInstructor.textContent = evt.instructor || 'Ban Chuyên môn LHPIC';
    modalContent.textContent = evt.content || evt.summary;

    const shareUrl = `${window.location.origin}${window.location.pathname}?id=${encodeURIComponent(evt.id)}`;
    let actionsHtml = `
      <button type="button" id="modal-copy-link-btn"
              class="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 inline-flex items-center gap-2 cursor-pointer">
        ${ICONS.copy} Sao chép link
      </button>
    `;

    if (evt.contestLink) {
      actionsHtml += `
        <a href="${safeUrl(evt.contestLink)}" target="_blank" rel="noopener noreferrer" 
           class="px-5 py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-white text-xs font-bold inline-flex items-center gap-2 cursor-pointer shadow-xs">
          Thử sức với đề bài ${ICONS.externalLink}
        </a>
      `;
    } else if (evt.docLink) {
      actionsHtml += `
        <a href="${safeUrl(evt.docLink)}" target="_blank" rel="noopener noreferrer" 
           class="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold inline-flex items-center gap-2 cursor-pointer shadow-xs">
          Xem tài liệu chuyên đề ${ICONS.externalLink}
        </a>
      `;
    }

    modalActions.innerHTML = actionsHtml;
    const copyBtn = document.getElementById('modal-copy-link-btn');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(shareUrl);
        window.LHPIC.showToast('Đã sao chép liên kết buổi sinh hoạt!');
      });
    }

    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  };

  function closeModal() {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  }

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) closeModal();
  });

  // Tab Filtering
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tabButtons.forEach(b => {
        b.className = 'tab-btn px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 transition-all cursor-pointer';
      });
      btn.className = 'tab-btn px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer bg-white text-slate-900 shadow-xs';
      currentStatus = btn.getAttribute('data-status');
      render();
    });
  });

  // Search Input
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.trim();
      render();
    });
  }

  async function fetchAndRender() {
    gridContainer.innerHTML = `
      <div class="col-span-full text-center py-12 text-slate-500 text-sm">
        Đang tải danh sách buổi sinh hoạt...
      </div>
    `;
    try {
      allEvents = await store.getEvents();
      render();
    } catch (err) {
      console.error('Lỗi tải events:', err);
      gridContainer.innerHTML = `
        <div class="col-span-full text-center py-12 text-red-500 text-sm">
          Không thể kết nối tới cơ sở dữ liệu. Vui lòng thử tải lại trang.
        </div>
      `;
    }
  }

  await fetchAndRender();

  // Check URL query param for direct event opening
  const urlParams = new URLSearchParams(window.location.search);
  const targetId = urlParams.get('id');
  if (targetId) {
    window.openEventModal(targetId);
  }
}

window.initEventsPage = initEventsPage;
