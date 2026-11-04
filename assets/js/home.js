/**
 * Homepage Dynamic Rendering Script
 * Phản ánh đúng tinh thần CLB học sinh & Folder kho ảnh từng buổi
 */

function initHomePage() {
  const store = window.LHPIC.store;
  const ICONS = window.LHPIC.ICONS;

  // 1. Render Latest 3 Sessions / Events
  const eventsContainer = document.getElementById('home-events-grid');
  if (eventsContainer) {
    const events = store.getEvents().slice(0, 3);
    
    if (events.length === 0) {
      eventsContainer.innerHTML = `<p class="col-span-full text-center text-slate-500 py-8">Chưa có buổi sinh hoạt nào.</p>`;
    } else {
      eventsContainer.innerHTML = events.map(evt => {
        let statusBadge = '';
        if (evt.status === 'upcoming') {
          statusBadge = `<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span>Sắp diễn ra
          </span>`;
        } else if (evt.status === 'ongoing') {
          statusBadge = `<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-green-50 text-green-700 border border-green-200">
            <span class="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping"></span>Đang mở thử thách
          </span>`;
        } else {
          statusBadge = `<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
            Đã diễn ra
          </span>`;
        }

        return `
          <div class="bg-white rounded-3xl border border-slate-200 overflow-hidden card-hover flex flex-col justify-between">
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
                  Xem chi tiết buổi sinh hoạt
                </a>
              </div>
            </div>
          </div>
        `;
      }).join('');
    }
  }

  // 2. Render 3 Featured Session Folders (Google Drive Direct Embed)
  const galleryContainer = document.getElementById('home-gallery-grid');
  if (galleryContainer) {
    const albums = store.getAlbums().slice(0, 3);

    if (albums.length === 0) {
      galleryContainer.innerHTML = `<p class="col-span-full text-center text-slate-500 py-8">Chưa có album ảnh nào.</p>`;
    } else {
      galleryContainer.innerHTML = albums.map(alb => {
        return `
          <div class="bg-white rounded-3xl border border-slate-200 overflow-hidden card-hover flex flex-col justify-between group">
            
            <div class="relative h-44 overflow-hidden bg-slate-100 cursor-pointer" onclick="window.location.href='gallery.html?id=${alb.id}'">
              <img src="${alb.coverImage}" alt="${alb.title}" class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" />
              <div class="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent flex items-end p-3.5">
                <span class="text-xs text-white font-medium flex items-center gap-1.5 bg-slate-900/80 px-2.5 py-1 rounded-lg backdrop-blur-xs">
                  ${ICONS.folderOpen} Khung Google Drive
                </span>
              </div>
              <div class="absolute top-3 left-3">
                <span class="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-white text-slate-900 shadow-sm flex items-center gap-1">
                  ${ICONS.folder} ${alb.sessionName}
                </span>
              </div>
            </div>

            <div class="p-5 flex-grow flex flex-col justify-between space-y-3">
              <div>
                <span class="text-[11px] font-mono text-slate-400 block mb-1">${alb.date}</span>
                <h4 class="text-sm font-bold text-slate-900 group-hover:text-orange-600 transition-colors font-heading line-clamp-1">
                  ${alb.title}
                </h4>
                <p class="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                  ${alb.description}
                </p>
              </div>

              <div class="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <a href="gallery.html?id=${alb.id}" 
                   class="flex-1 py-2 text-center rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer">
                  Xem trực tiếp
                </a>
                <a href="${alb.driveLink || '#'}" target="_blank" rel="noopener noreferrer" 
                   class="py-2 px-3 rounded-xl text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors cursor-pointer border border-blue-200 flex items-center gap-1" title="Mở trên Google Drive">
                  ${ICONS.drive} Drive ↗
                </a>
              </div>
            </div>

          </div>
        `;
      }).join('');
    }
  }
}

window.initHomePage = initHomePage;
