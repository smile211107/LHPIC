/**
 * Homepage Dynamic Rendering Script
 */

function initHomePage() {
  const store = window.LHPIC.store;
  const ICONS = window.LHPIC.ICONS;

  // 1. Render Latest 3 Events
  const eventsContainer = document.getElementById('home-events-grid');
  if (eventsContainer) {
    const events = store.getEvents().slice(0, 3);
    
    if (events.length === 0) {
      eventsContainer.innerHTML = `<p class="col-span-full text-center text-slate-500 py-8">Chưa có sự kiện nào.</p>`;
    } else {
      eventsContainer.innerHTML = events.map(evt => {
        let statusBadge = '';
        if (evt.status === 'upcoming') {
          statusBadge = `<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span>Sắp diễn ra
          </span>`;
        } else if (evt.status === 'ongoing') {
          statusBadge = `<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-green-50 text-green-700 border border-green-200">
            <span class="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping"></span>Đang diễn ra
          </span>`;
        } else {
          statusBadge = `<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
            Đã kết thúc
          </span>`;
        }

        return `
          <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden card-hover flex flex-col justify-between">
            <div class="relative h-48 overflow-hidden bg-slate-100">
              <img src="${evt.coverImage}" alt="${evt.title}" class="w-full h-full object-cover transition-transform duration-300 hover:scale-105" loading="lazy" />
              <div class="absolute top-3 left-3">
                ${statusBadge}
              </div>
              <div class="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur-xs text-white text-xs px-2.5 py-1 rounded-md font-mono">
                ${evt.date}
              </div>
            </div>

            <div class="p-6 flex-grow flex flex-col justify-between space-y-4">
              <div>
                <span class="text-xs font-bold text-orange-600 uppercase tracking-wider block mb-1 font-heading">${evt.category}</span>
                <h3 class="text-base font-bold text-slate-900 line-clamp-2 leading-snug font-heading">${evt.title}</h3>
                <p class="text-xs text-slate-500 line-clamp-2 mt-2 leading-relaxed">${evt.summary}</p>
              </div>

              <div class="pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                <div class="flex items-center gap-2">
                  <span class="text-slate-400">${ICONS.clock}</span>
                  <span>${evt.time}</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-slate-400">${ICONS.mapPin}</span>
                  <span class="truncate">${evt.location}</span>
                </div>
              </div>

              <div class="pt-2">
                <a href="events.html?id=${evt.id}" 
                   class="block w-full py-2.5 text-center rounded-xl text-xs font-bold text-orange-600 bg-orange-50 hover:bg-orange-600 hover:text-white transition-colors cursor-pointer">
                  Chi tiết buổi học & Tài liệu
                </a>
              </div>
            </div>
          </div>
        `;
      }).join('');
    }
  }

  // 2. Render Latest 4 Gallery Photos
  const galleryContainer = document.getElementById('home-gallery-grid');
  if (galleryContainer) {
    const photos = store.getGallery().slice(0, 4);

    if (photos.length === 0) {
      galleryContainer.innerHTML = `<p class="col-span-full text-center text-slate-500 py-8">Chưa có ảnh nào.</p>`;
    } else {
      galleryContainer.innerHTML = photos.map(photo => {
        return `
          <div class="group relative rounded-2xl overflow-hidden aspect-4/3 bg-slate-100 border border-slate-200 card-hover cursor-pointer" onclick="window.location.href='gallery.html'">
            <img src="${photo.imageUrl}" alt="${photo.title}" class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" />
            <div class="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-4 flex flex-col justify-end text-white">
              <span class="text-xs font-mono text-orange-400 uppercase tracking-wider">${photo.category}</span>
              <h4 class="text-sm font-bold truncate font-heading">${photo.title}</h4>
              <p class="text-xs text-slate-300 line-clamp-1 mt-0.5">${photo.caption}</p>
            </div>
          </div>
        `;
      }).join('');
    }
  }
}

window.initHomePage = initHomePage;
