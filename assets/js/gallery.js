/**
 * Gallery Page Functionality: Folder Buổi Sinh Hoạt & Tải 50 ảnh từ Google Drive
 */

function initGalleryPage() {
  const store = window.LHPIC.store;
  const ICONS = window.LHPIC.ICONS;

  let searchQuery = '';
  let activeAlbum = null;
  let activePhotoIndex = 0;

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
  const modalPhotoCounterText = document.getElementById('modal-photo-counter-text');
  const modalPhotoCountPill = document.getElementById('modal-photo-count-pill');
  const modalPhotosGrid = document.getElementById('modal-photos-grid');

  // Lightbox elements
  const lightbox = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxCloseBtn = document.getElementById('lightbox-close-btn');
  const lightboxPrevBtn = document.getElementById('lightbox-prev-btn');
  const lightboxNextBtn = document.getElementById('lightbox-next-btn');

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
      const count = alb.photos ? alb.photos.length : (alb.photoCount || 0);
      return `
        <div class="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group">
          
          <!-- Folder Cover Image & Header Tag -->
          <div class="relative h-48 overflow-hidden bg-slate-100 cursor-pointer" onclick="window.openAlbumModal('${alb.id}')">
            <img src="${alb.coverImage}" alt="${alb.title}" class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" />
            <div class="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent flex items-end p-4">
              <span class="text-xs text-white font-medium flex items-center gap-1.5 bg-slate-900/80 px-2.5 py-1 rounded-lg backdrop-blur-xs">
                ${ICONS.image} ${count} ảnh xem trước
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
                ${alb.description || 'Tổng hợp hình ảnh sinh hoạt và kỷ niệm của CLB LHPIC.'}
              </p>
            </div>

            <!-- Action Buttons: Preview & Google Drive -->
            <div class="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2">
              <button type="button" onclick="window.openAlbumModal('${alb.id}')" 
                      class="py-2.5 px-3 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer flex items-center justify-center gap-1.5">
                ${ICONS.folderOpen}
                <span>Xem ${count} ảnh</span>
              </button>

              <a href="${alb.driveLink || '#'}" target="_blank" rel="noopener noreferrer" 
                 class="py-2.5 px-3 rounded-xl text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors cursor-pointer flex items-center justify-center gap-1.5 border border-blue-200" title="Mở thư mục Google Drive gốc">
                ${ICONS.drive}
                <span>Google Drive</span>
              </a>
            </div>
          </div>

        </div>
      `;
    }).join('');
  }

  // Open Album Modal
  window.openAlbumModal = async function(id) {
    const albums = store.getAlbums();
    activeAlbum = albums.find(a => a.id === id);
    if (!activeAlbum) return;

    modalSessionTag.textContent = activeAlbum.sessionName;
    modalSessionDate.textContent = activeAlbum.date;
    modalSessionTitle.textContent = activeAlbum.title;
    modalSessionDesc.textContent = activeAlbum.description || '';

    // Cập nhật cả 2 nút Google Drive (Đỉnh và Đáy modal)
    const driveUrl = activeAlbum.driveLink || '#';
    if (modalDriveBtn) modalDriveBtn.href = driveUrl;
    if (modalDriveBtnBottom) modalDriveBtnBottom.href = driveUrl;

    // Kiểm tra và hiển thị ảnh
    renderModalPhotosGrid();

    // Mở modal
    albumModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';

    // Thử nghiệm fetch live từ Google Apps Script nếu có cấu hình Bridge
    const bridgeUrl = store.getDriveBridgeUrl();
    const folderId = activeAlbum.driveFolderId || store.extractDriveFolderId(activeAlbum.driveLink);

    if (bridgeUrl && folderId && (!activeAlbum.photos || activeAlbum.photos.length <= 3)) {
      try {
        if (modalPhotoCounterText) modalPhotoCounterText.textContent = 'Đang đồng bộ ảnh trực tiếp từ Google Drive...';
        const res = await fetch(`${bridgeUrl}?folderId=${folderId}&limit=50`);
        const data = await res.json();
        if (data.success && data.photos && data.photos.length > 0) {
          activeAlbum.photos = data.photos;
          store.updateAlbum(activeAlbum.id, { photos: data.photos, photoCount: data.photos.length });
          renderModalPhotosGrid();
          window.LHPIC.showToast(`Đã tải thành công ${data.photos.length} ảnh từ Google Drive!`);
        }
      } catch (err) {
        console.warn('Không thể fetch live từ Drive Apps Script, dùng cache/sample photos:', err);
      }
    }
  };

  function renderModalPhotosGrid() {
    if (!activeAlbum) return;

    const photos = activeAlbum.photos && activeAlbum.photos.length > 0 
      ? activeAlbum.photos 
      : [{ url: activeAlbum.coverImage, caption: activeAlbum.title }];

    const count = photos.length;
    if (modalPhotoCountPill) modalPhotoCountPill.textContent = `${count} ảnh`;
    if (modalPhotoCounterText) {
      modalPhotoCounterText.textContent = `Đang hiển thị ${count} ảnh xem trước • Chỉ tải ảnh khi cần • Bấm nút để mở Google Drive`;
    }

    modalPhotosGrid.innerHTML = photos.map((p, idx) => {
      return `
        <div class="group relative rounded-2xl overflow-hidden aspect-4/3 bg-slate-100 border border-slate-200 cursor-pointer card-hover" 
             onclick="window.openLightbox(${idx})">
          <img src="${p.url}" alt="${p.caption || 'Photo'}" class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" />
          <div class="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2.5 text-white">
            <span class="text-[11px] line-clamp-1 leading-tight">${p.caption || `#${idx + 1}`}</span>
          </div>
          <div class="absolute top-2 left-2 px-1.5 py-0.5 rounded-md bg-slate-900/70 text-[10px] font-mono text-white opacity-0 group-hover:opacity-100 transition-opacity">
            #${idx + 1}
          </div>
        </div>
      `;
    }).join('');
  }

  function closeAlbumModal() {
    albumModal.classList.add('hidden');
    document.body.style.overflow = '';
  }

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeAlbumModal);
  albumModal.addEventListener('click', (e) => {
    if (e.target === albumModal) closeAlbumModal();
  });

  // Lightbox
  window.openLightbox = function(idx) {
    if (!activeAlbum || !activeAlbum.photos || !activeAlbum.photos[idx]) {
      if (activeAlbum) {
        lightboxImg.src = activeAlbum.coverImage;
        lightboxCaption.textContent = activeAlbum.title;
        lightbox.classList.remove('hidden');
      }
      return;
    }
    activePhotoIndex = idx;
    updateLightbox();
    lightbox.classList.remove('hidden');
  };

  function updateLightbox() {
    const p = activeAlbum.photos[activePhotoIndex];
    if (!p) return;
    lightboxImg.src = p.fullUrl || p.url;
    lightboxCaption.textContent = `${activeAlbum.sessionName} • Ảnh ${activePhotoIndex + 1}/${activeAlbum.photos.length} — ${p.caption || activeAlbum.title}`;
  }

  function showNextPhoto() {
    if (!activeAlbum || !activeAlbum.photos) return;
    activePhotoIndex = (activePhotoIndex + 1) % activeAlbum.photos.length;
    updateLightbox();
  }

  function showPrevPhoto() {
    if (!activeAlbum || !activeAlbum.photos) return;
    activePhotoIndex = (activePhotoIndex - 1 + activeAlbum.photos.length) % activeAlbum.photos.length;
    updateLightbox();
  }

  function closeLightbox() {
    lightbox.classList.add('hidden');
  }

  if (lightboxCloseBtn) lightboxCloseBtn.addEventListener('click', closeLightbox);
  if (lightboxNextBtn) lightboxNextBtn.addEventListener('click', showNextPhoto);
  if (lightboxPrevBtn) lightboxPrevBtn.addEventListener('click', showPrevPhoto);

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  window.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('hidden')) {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') showNextPhoto();
      if (e.key === 'ArrowLeft') showPrevPhoto();
      return;
    }
    if (!albumModal.classList.contains('hidden') && e.key === 'Escape') {
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

  // Initial render
  render();

  window.addEventListener('lhpic_data_updated', (e) => {
    if (e.detail && e.detail.type === 'albums') {
      render();
    }
  });
}

window.initGalleryPage = initGalleryPage;
