/**
 * Gallery Page Functionality with Lightbox Modal
 */

function initGalleryPage() {
  const store = window.LHPIC.store;

  let currentCategory = 'all';
  let activeIndex = 0;
  let currentList = [];

  const gridContainer = document.getElementById('gallery-grid');
  const emptyState = document.getElementById('gallery-empty-state');
  const categoryButtons = document.querySelectorAll('#gallery-category-tabs .cat-btn');

  // Lightbox elements
  const lightbox = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxCategory = document.getElementById('lightbox-category');
  const lightboxDate = document.getElementById('lightbox-date');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const closeBtn = document.getElementById('lightbox-close-btn');
  const prevBtn = document.getElementById('lightbox-prev-btn');
  const nextBtn = document.getElementById('lightbox-next-btn');

  function render() {
    const allPhotos = store.getGallery();
    currentList = allPhotos.filter(item => {
      return currentCategory === 'all' || item.category === currentCategory;
    });

    if (currentList.length === 0) {
      gridContainer.innerHTML = '';
      emptyState.classList.remove('hidden');
      return;
    }

    emptyState.classList.add('hidden');
    gridContainer.innerHTML = currentList.map((photo, index) => {
      return `
        <div class="group relative bg-white rounded-3xl overflow-hidden border border-slate-200 card-hover cursor-pointer" 
             onclick="window.openLightbox(${index})">
          
          <div class="relative aspect-4/3 overflow-hidden bg-slate-100">
            <img src="${photo.imageUrl}" alt="${photo.title}" class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" />
            <div class="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end p-5">
              <span class="text-xs font-bold text-white bg-orange-600/90 px-3 py-1 rounded-lg backdrop-blur-xs">
                Xem ảnh phóng to
              </span>
            </div>
            <div class="absolute top-3.5 left-3.5">
              <span class="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-white/90 text-slate-800 shadow-xs">
                ${photo.category}
              </span>
            </div>
          </div>

          <div class="p-5 space-y-1.5">
            <div class="text-xs text-slate-400 font-mono">${photo.date || 'LHPIC'}</div>
            <h3 class="text-sm font-bold text-slate-900 group-hover:text-orange-600 transition-colors font-heading truncate">
              ${photo.title}
            </h3>
            <p class="text-xs text-slate-500 line-clamp-2 leading-relaxed">
              ${photo.caption}
            </p>
          </div>

        </div>
      `;
    }).join('');
  }

  // Lightbox functions
  window.openLightbox = function(index) {
    if (!currentList[index]) return;
    activeIndex = index;
    updateLightboxContent();
    lightbox.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  };

  function updateLightboxContent() {
    const photo = currentList[activeIndex];
    if (!photo) return;
    lightboxImg.src = photo.imageUrl;
    lightboxTitle.textContent = photo.title;
    lightboxCategory.textContent = photo.category;
    lightboxDate.textContent = photo.date || '';
    lightboxCaption.textContent = photo.caption || '';
  }

  function showNext() {
    activeIndex = (activeIndex + 1) % currentList.length;
    updateLightboxContent();
  }

  function showPrev() {
    activeIndex = (activeIndex - 1 + currentList.length) % currentList.length;
    updateLightboxContent();
  }

  function closeLightbox() {
    lightbox.classList.add('hidden');
    document.body.style.overflow = '';
  }

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (nextBtn) nextBtn.addEventListener('click', showNext);
  if (prevBtn) prevBtn.addEventListener('click', showPrev);

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  window.addEventListener('keydown', (e) => {
    if (lightbox.classList.contains('hidden')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showNext();
    if (e.key === 'ArrowLeft') showPrev();
  });

  // Category Tabs
  categoryButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      categoryButtons.forEach(b => {
        b.className = 'cat-btn px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all cursor-pointer';
      });
      btn.className = 'cat-btn px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer bg-slate-900 text-white';
      currentCategory = btn.getAttribute('data-category');
      render();
    });
  });

  // Initial render
  render();

  // Listen to store updates from Admin
  window.addEventListener('lhpic_data_updated', (e) => {
    if (e.detail && e.detail.type === 'gallery') {
      render();
    }
  });
}

window.initGalleryPage = initGalleryPage;
