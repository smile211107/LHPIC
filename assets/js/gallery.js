/**
 * Gallery Page Functionality: Khung xem trực tiếp thư mục Google Drive
 */

function initGalleryPage() {
  const store = window.LHPIC.store;
  const ICONS = window.LHPIC.ICONS;

  let searchQuery = '';
  let activeAlbum = null;

  const albumsGrid = document.getElementById('albums-grid');
  const emptyState = document.getElementById('albums-empty-state');
  const searchInput = document.getElementById('search-album-input');
  const countBadge = document.getElementById('album-count-badge');

  // Album Modal elements
  const albumModal = document.getElementById('album-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalSessionTag = document.getElementById('modal-session-tag');
  const modalSessionDate = document.getElementById('modal-session-date');
  const modalSessionTitle = document.getElementById('modal-session-title');
  const modalSessionDesc = document.getElementById('modal-session-desc');
  const modalDriveBtn = document.getElementById('modal-drive-btn');
  const modalDriveBtnBottom = document.getElementById('modal-drive-btn-bottom');
  const modalDriveIframe = document.getElementById('modal-drive-iframe');

  function render() {
    const albums = store.getAlbums();
    const filtered = albums.filter(alb => {
      const q = searchQuery.toLowerCase();
      return !q || 
        alb.title.toLowerCase().includes(q) || 
        alb.sessionName.toLowerCase().includes(q) ||
        (alb.description && alb.description.toLowerCase().includes(q));
    });

    if (countBadge) countBadge.textContent = `${filtered.length} folders`;

    if (filtered.length === 0) {
      albumsGrid.innerHTML = '';
      emptyState.classList.remove('hidden');
      return;
    }

    emptyState.classList.add('hidden');
    albumsGrid.innerHTML = filtered.map(alb => {
      return `
        <div class="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group">
          
          <!-- Folder Cover Image & Header Tag -->
          <div class="relative h-48 overflow-hidden bg-slate-100 cursor-pointer" onclick="window.openAlbumModal('${alb.id}')">
            <img src="${alb.coverImage}" alt="${alb.title}" class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" />
            <div class="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent flex items-end p-4">
              <span class="text-xs text-white font-medium flex items-center gap-1.5 bg-slate-900/80 px-2.5 py-1 rounded-lg backdrop-blur-xs">
                ${ICONS.folderOpen} Khung Google Drive
              </span>
            </div>
            <div class="absolute top-3.5 left-3.5">
              <span class="px-3 py-1 rounded-full text-xs font-mono font-bold bg-white text-slate-900 shadow-sm flex items-center gap-1.5">
                ${ICONS.folder} ${alb.sessionName}
              </span>
            </div>
            <div class="absolute top-3.5 right-3.5">
              <span class="px-2.5 py-1 rounded-full text-xs font-mono text-white bg-slate-900/80 backdrop-blur-xs">
                ${alb.date}
              </span>
            </div>
          </div>

          <!-- Folder Details -->
          <div class="p-6 flex-grow flex flex-col justify-between space-y-4">
            <div>
              <h3 class="text-base font-bold text-slate-900 group-hover:text-orange-600 transition-colors font-heading leading-snug cursor-pointer" onclick="window.openAlbumModal('${alb.id}')">
                ${alb.title}
              </h3>
              <p class="text-xs text-slate-500 line-clamp-2 mt-2 leading-relaxed">
                ${alb.description || 'Xem trực tiếp toàn bộ ảnh trong thư mục Google Drive của buổi sinh hoạt.'}
              </p>
            </div>

            <!-- Action Buttons: Direct Frame & New Tab Link -->
            <div class="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2">
              <button type="button" onclick="window.openAlbumModal('${alb.id}')" 
                      class="py-2.5 px-3 rounded-xl text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer flex items-center justify-center gap-1.5">
                ${ICONS.folderOpen}
                <span>Xem trực tiếp</span>
              </button>

              <a href="${alb.driveLink || '#'}" target="_blank" rel="noopener noreferrer" 
                 class="py-2.5 px-3 rounded-xl text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors cursor-pointer flex items-center justify-center gap-1.5 border border-blue-200" title="Mở trên Google Drive ở tab mới">
                ${ICONS.drive}
                <span>Google Drive ↗</span>
              </a>
            </div>
          </div>

        </div>
      `;
    }).join('');
  }

  // Open Album Modal with Google Drive Embedded Iframe
  window.openAlbumModal = function(id) {
    const albums = store.getAlbums();
    activeAlbum = albums.find(a => a.id === id);
    if (!activeAlbum) return;

    modalSessionTag.textContent = activeAlbum.sessionName;
    modalSessionDate.textContent = activeAlbum.date;
    modalSessionTitle.textContent = activeAlbum.title;
    modalSessionDesc.textContent = activeAlbum.description || '';

    // Cập nhật cả 2 nút link Drive
    const driveUrl = activeAlbum.driveLink || '#';
    if (modalDriveBtn) modalDriveBtn.href = driveUrl;
    if (modalDriveBtnBottom) modalDriveBtnBottom.href = driveUrl;

    // Trích xuất Folder ID và nhúng iframe Google Drive trực tiếp
    const folderId = activeAlbum.driveFolderId || store.extractDriveFolderId(activeAlbum.driveLink);
    if (modalDriveIframe && folderId) {
      modalDriveIframe.src = `https://drive.google.com/embeddedfolderview?id=${folderId}#grid`;
    }

    // Mở modal
    albumModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  };

  function closeAlbumModal() {
    albumModal.classList.add('hidden');
    document.body.style.overflow = '';
    // Xóa iframe src để ngắt tiến trình ngầm
    if (modalDriveIframe) {
      modalDriveIframe.src = '';
    }
  }

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeAlbumModal);
  albumModal.addEventListener('click', (e) => {
    if (e.target === albumModal) closeAlbumModal();
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !albumModal.classList.contains('hidden')) {
      closeAlbumModal();
    }
  });

  // Search input
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.trim();
      render();
    });
  }

  // Check URL query param: e.g. gallery.html?id=alb-005
  const urlParams = new URLSearchParams(window.location.search);
  const targetId = urlParams.get('id');
  if (targetId) {
    setTimeout(() => {
      window.openAlbumModal(targetId);
    }, 150);
  }

  // Initial render
  render();

  window.addEventListener('lhpic_data_updated', (e) => {
    if (e.detail && e.detail.type === 'albums') {
      render();
    }
  });
}

window.initGalleryPage = initGalleryPage;
