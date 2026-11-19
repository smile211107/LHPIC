/**
 * Reusable Components & Navigation for LHPIC
 * Vibe: Câu lạc bộ học sinh năng động, đam mê công nghệ
 * Tuân thủ UI-UX Pro Max: SVG Icons, 44x44px target, a11y focus
 */

const ICONS = {
  calendar: `<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>`,
  clock: `<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
  mapPin: `<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg>`,
  arrowRight: `<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>`,
  externalLink: `<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>`,
  check: `<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>`,
  copy: `<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>`,
  menu: `<svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>`,
  close: `<svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`,
  facebook: `<svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>`,
  zalo: `<svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.141 2 11.25c0 2.875 1.42 5.434 3.656 7.078L4.5 22l4.188-1.547C9.719 20.766 10.828 21 12 21c5.523 0 10-4.141 10-9.25S17.523 2 C12 2z"/></svg>`,
  terminal: `<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 17 10 11 4 5"/><line x1="12" x2="20" y1="19" y2="19"/></svg>`,
  user: `<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
  image: `<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>`,
  award: `<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>`,
  settings: `<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>`,
  folder: `<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"/></svg>`,
  folderOpen: `<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 14 1.45-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.55 6a2 2 0 0 1-1.94 1.5H4a2 2 0 0 1-2-2V5c0-1.1.9-2 2-2h3.93a2 2 0 0 1 1.66.9l.82 1.2a2 2 0 0 0 1.66.9H18a2 2 0 0 1 2 2v2"/></svg>`,
  drive: `<svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M7.71 3.5 1.15 15l3.43 6 6.55-11.5L7.71 3.5Zm3.71 6.5-3.43 6h13.72l3.43-6H11.42Zm4.87-6.5-6.56 11.5 3.43 6 6.56-11.5-3.43-6Z"/></svg>`,
  sparkles: `<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>`,
  heart: `<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>`,
};

/**
 * Initialize Navigation Bar
 */
function renderNavbar(activePage = 'home') {
  const navContainer = document.getElementById('navbar-container');
  if (!navContainer) return;

  const links = [
    { id: 'home', label: 'Trang chủ', href: 'index.html' },
    { id: 'about', label: 'Về CLB', href: 'about.html' },
    { id: 'events', label: 'Buổi sinh hoạt & Thử thách', href: 'events.html' },
    { id: 'gallery', label: 'Kho ảnh từng buổi', href: 'gallery.html' },
    { id: 'contact', label: 'Giao lưu & Kết nối', href: 'contact.html' },
  ];

  const desktopLinksHtml = links.map(link => {
    const isActive = link.id === activePage;
    return `
      <a href="${link.href}" 
         class="px-3.5 py-2 text-sm font-semibold rounded-lg transition-all duration-200 cursor-pointer ${
           isActive 
             ? 'text-orange-600 bg-orange-50 font-bold border-b-2 border-orange-600' 
             : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
         }">
        ${link.label}
      </a>
    `;
  }).join('');

  const mobileLinksHtml = links.map(link => {
    const isActive = link.id === activePage;
    return `
      <a href="${link.href}" 
         class="block px-4 py-3 rounded-xl text-base font-medium transition-colors cursor-pointer ${
           isActive 
             ? 'text-orange-600 bg-orange-50 font-bold' 
             : 'text-slate-700 hover:bg-slate-100'
         }">
        ${link.label}
      </a>
    `;
  }).join('');

  navContainer.innerHTML = `
    <header class="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-20">
          
          <!-- Logo & Brand -->
          <a href="index.html" class="flex items-center gap-3 group cursor-pointer focus:outline-none" aria-label="Trang chủ CLB Tin học LHPIC">
            <div class="relative w-12 h-12 flex-shrink-0 transition-transform duration-200 group-hover:scale-105 rounded-xl overflow-hidden border border-slate-200 shadow-xs bg-slate-900">
              <img src="assets/images/lhpic_avt.jpg" onerror="this.src='assets/images/panda-logo.svg'" alt="LHPIC Logo" class="w-full h-full object-cover" />
            </div>
            <div class="flex flex-col">
              <div class="flex items-center gap-2">
                <span class="text-xl font-extrabold tracking-tight text-slate-900 font-heading">LHPIC</span>
                <span class="px-2 py-0.5 text-xs font-mono font-semibold rounded-full bg-orange-50 text-orange-700 border border-orange-200">CLB Học Sinh</span>
              </div>
              <span class="text-xs font-medium text-slate-500 hidden sm:block">CLB Tin học THPT Chuyên Lê Hồng Phong</span>
            </div>
          </a>

          <!-- Desktop Navigation -->
          <nav class="hidden md:flex items-center gap-1.5" aria-label="Menu chính">
            ${desktopLinksHtml}
          </nav>

          <!-- Action CTA & Admin link -->
          <div class="hidden lg:flex items-center gap-3">
            <a href="admin.html" class="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer" title="Cổng Quản trị BCN">
              ${ICONS.settings}
            </a>
            <a href="https://zalo.me/g/dfmcirov4fictruxm9n4" target="_blank" rel="noopener noreferrer" 
               class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm bg-orange-600 hover:bg-orange-700 text-white shadow-sm hover:shadow transition-all duration-200 cursor-pointer">
              ${ICONS.zalo}
              <span>Nhóm Giao Lưu [LHPIC 2627]</span>
            </a>
          </div>

          <!-- Mobile Hamburger Toggle -->
          <div class="flex items-center gap-2 md:hidden">
            <button id="mobile-menu-toggle" type="button" 
                    class="p-2.5 rounded-xl text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center" 
                    aria-label="Mở menu điều hướng">
              <span id="menu-icon-open">${ICONS.menu}</span>
              <span id="menu-icon-close" class="hidden">${ICONS.close}</span>
            </button>
          </div>

        </div>
      </div>

      <!-- Mobile Dropdown Menu -->
      <div id="mobile-menu-drawer" class="hidden md:hidden border-b border-slate-200 bg-white/98 backdrop-blur-md px-4 pt-2 pb-6 space-y-1">
        ${mobileLinksHtml}
        <div class="pt-4 mt-2 border-t border-slate-100 space-y-2">
          <a href="https://zalo.me/g/dfmcirov4fictruxm9n4" target="_blank" rel="noopener noreferrer"
             class="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl font-semibold text-white bg-orange-600 hover:bg-orange-700 text-center cursor-pointer">
            ${ICONS.zalo}
            <span>Tham gia Nhóm Zalo [LHPIC 2627]</span>
          </a>
          <a href="admin.html" class="flex items-center justify-center gap-2 w-full py-2.5 text-sm font-medium text-slate-600 hover:text-slate-900 bg-slate-100 rounded-xl cursor-pointer">
            ${ICONS.settings}
            <span>Trang Quản trị CLB</span>
          </a>
        </div>
      </div>
    </header>
  `;

  // Attach mobile toggle listener
  const toggleBtn = document.getElementById('mobile-menu-toggle');
  const drawer = document.getElementById('mobile-menu-drawer');
  const iconOpen = document.getElementById('menu-icon-open');
  const iconClose = document.getElementById('menu-icon-close');

  if (toggleBtn && drawer) {
    toggleBtn.addEventListener('click', () => {
      const isExpanded = drawer.classList.contains('hidden');
      if (isExpanded) {
        drawer.classList.remove('hidden');
        iconOpen.classList.add('hidden');
        iconClose.classList.remove('hidden');
      } else {
        drawer.classList.add('hidden');
        iconOpen.classList.remove('hidden');
        iconClose.classList.add('hidden');
      }
    });
  }
}

/**
 * Initialize Footer
 */
function renderFooter() {
  const footerContainer = document.getElementById('footer-container');
  if (!footerContainer) return;

  footerContainer.innerHTML = `
    <footer class="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          <!-- Col 1: Brand Info -->
          <div class="space-y-4">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 flex-shrink-0 rounded-lg overflow-hidden border border-slate-700 bg-slate-800">
                <img src="assets/images/lhpic_avt.jpg" onerror="this.src='assets/images/panda-logo.svg'" alt="LHPIC Logo" class="w-full h-full object-cover" />
              </div>
              <span class="text-xl font-extrabold tracking-tight text-white font-heading">LHPIC</span>
            </div>
            <p class="text-sm text-slate-400 leading-relaxed">
              Câu lạc bộ Tin học Trường THPT Chuyên Lê Hồng Phong (TP.HCM). Sân chơi học sinh tự nguyện, nơi cùng nhau thắp lửa đam mê lập trình, chia sẻ thuật toán và kết nối bạn bè cùng sở thích.
            </p>
            <div class="flex items-center gap-3 pt-2">
              <a href="https://www.facebook.com/LHPIC235" target="_blank" rel="noopener noreferrer" 
                 class="w-10 h-10 rounded-lg bg-slate-800 hover:bg-orange-600 hover:text-white text-slate-300 flex items-center justify-center transition-colors cursor-pointer" 
                 aria-label="Facebook Fanpage LHPIC">
                ${ICONS.facebook}
              </a>
              <a href="https://zalo.me/g/dfmcirov4fictruxm9n4" target="_blank" rel="noopener noreferrer" 
                 class="w-10 h-10 rounded-lg bg-slate-800 hover:bg-orange-600 hover:text-white text-slate-300 flex items-center justify-center transition-colors cursor-pointer" 
                 aria-label="Nhóm Zalo LHPIC">
                ${ICONS.zalo}
              </a>
            </div>
          </div>

          <!-- Col 2: Sinh hoạt định kỳ -->
          <div>
            <h3 class="text-white font-semibold text-sm tracking-wider uppercase mb-4 font-heading">Lịch Sinh Hoạt CLB</h3>
            <ul class="space-y-3 text-sm text-slate-400">
              <li class="flex items-start gap-2.5">
                <span class="text-orange-500 mt-1">${ICONS.calendar}</span>
                <div>
                  <strong class="text-slate-200 block">Thứ Bảy hàng tuần:</strong>
                  <span>13:30 – 16:00 (Gặp gỡ & sinh hoạt chuyên đề)</span>
                </div>
              </li>
              <li class="flex items-start gap-2.5">
                <span class="text-orange-500 mt-1">${ICONS.terminal}</span>
                <div>
                  <strong class="text-slate-200 block">Thử thách cuối tuần:</strong>
                  <span>Contest online giao lưu tự nguyện</span>
                </div>
              </li>
              <li class="flex items-start gap-2.5">
                <span class="text-orange-500 mt-1">${ICONS.mapPin}</span>
                <div>
                  <strong class="text-slate-200 block">Địa điểm gặp mặt:</strong>
                  <span>Hội trường E, Trường THPT Chuyên Lê Hồng Phong (280 An Dương Vương, Q.5, TP.HCM)</span>
                </div>
              </li>
            </ul>
          </div>

          <!-- Col 3: Điều hướng nhanh -->
          <div>
            <h3 class="text-white font-semibold text-sm tracking-wider uppercase mb-4 font-heading">Khám Phá CLB</h3>
            <ul class="space-y-2.5 text-sm">
              <li><a href="index.html" class="hover:text-orange-400 transition-colors cursor-pointer">Trang chủ</a></li>
              <li><a href="about.html" class="hover:text-orange-400 transition-colors cursor-pointer">Về CLB & Tinh thần LHPIC</a></li>
              <li><a href="events.html" class="hover:text-orange-400 transition-colors cursor-pointer">Lịch sinh hoạt & Chuyên đề</a></li>
              <li><a href="gallery.html" class="hover:text-orange-400 transition-colors cursor-pointer">Kho ảnh theo từng buổi sinh hoạt</a></li>
              <li><a href="contact.html" class="hover:text-orange-400 transition-colors cursor-pointer">Kênh giao lưu & Mã QR</a></li>
              <li><a href="admin.html" class="text-slate-500 hover:text-slate-300 transition-colors cursor-pointer">Cổng BCN (CMS)</a></li>
            </ul>
          </div>

          <!-- Col 4: Liên hệ & Quét mã -->
          <div>
            <h3 class="text-white font-semibold text-sm tracking-wider uppercase mb-4 font-heading">Cộng Đồng LHPIC 2627</h3>
            <p class="text-xs text-slate-400 mb-3">Tham gia nhóm Zalo mở để cùng nhau trao đổi bài tập và cập nhật lịch gặp mặt:</p>
            <div class="bg-slate-800 p-3.5 rounded-xl border border-slate-700/60 flex items-center gap-3">
              <div class="w-16 h-16 bg-white p-1 rounded-lg flex-shrink-0">
                <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://zalo.me/g/dfmcirov4fictruxm9n4" 
                     alt="Zalo QR" class="w-full h-full object-contain" />
              </div>
              <div class="text-xs space-y-1">
                <div class="font-bold text-white">[LHPIC 2627]</div>
                <div class="text-slate-400">Quét mã Zalo để vào nhóm trò chuyện</div>
                <a href="https://zalo.me/g/dfmcirov4fictruxm9n4" target="_blank" class="text-orange-400 hover:underline inline-flex items-center gap-1 font-semibold">
                  Mở Zalo ${ICONS.arrowRight}
                </a>
              </div>
            </div>
          </div>

        </div>

        <!-- Bottom Copyright -->
        <div class="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2024 - 2026 CLB Tin học Trường THPT Chuyên Lê Hồng Phong (LHPIC) • Made with passion by LHPers.</p>
          <div class="flex items-center gap-6">
            <span>Sân chơi phi lợi nhuận của học sinh</span>
            <a href="admin.html" class="hover:text-slate-400">BCN Login</a>
          </div>
        </div>
      </div>
    </footer>
  `;
}

/**
 * Global Toast Notification
 */
function showToast(message, type = 'success') {
  let toastEl = document.getElementById('global-toast');
  if (!toastEl) {
    toastEl = document.createElement('div');
    toastEl.id = 'global-toast';
    toastEl.className = 'fixed bottom-6 right-6 z-50 transform transition-all duration-300 translate-y-24 opacity-0';
    document.body.appendChild(toastEl);
  }

  const bgClass = type === 'success' 
    ? 'bg-slate-900 text-white border-l-4 border-green-500' 
    : 'bg-red-900 text-white border-l-4 border-red-500';

  toastEl.innerHTML = `
    <div class="${bgClass} px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 text-sm font-medium">
      <span>${message}</span>
    </div>
  `;

  setTimeout(() => {
    toastEl.classList.remove('translate-y-24', 'opacity-0');
    toastEl.classList.add('translate-y-0', 'opacity-100');
  }, 10);

  setTimeout(() => {
    toastEl.classList.remove('translate-y-0', 'opacity-100');
    toastEl.classList.add('translate-y-24', 'opacity-0');
  }, 3500);
}

/**
 * Global Icon Injector for elements with data-icon attribute
 */
function injectIcons() {
  document.querySelectorAll('[data-icon]').forEach(el => {
    const iconName = el.getAttribute('data-icon');
    if (ICONS[iconName]) {
      el.innerHTML = ICONS[iconName];
    }
  });
}

/**
 * Escape HTML special characters to prevent XSS
 */
function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Sanitize URLs before placing into href/src attributes
 */
function sanitizeUrl(url, fallback = '#') {
  const val = String(url ?? '').trim();
  if (!val) return fallback;
  if (/^(https?:\/\/|\/|assets\/)/i.test(val)) {
    return val;
  }
  return fallback;
}

// Expose on window
window.LHPIC = window.LHPIC || {};
window.LHPIC.ICONS = ICONS;
window.LHPIC.renderNavbar = renderNavbar;
window.LHPIC.renderFooter = renderFooter;
window.LHPIC.showToast = showToast;
window.LHPIC.injectIcons = injectIcons;
window.LHPIC.escapeHtml = escapeHtml;
window.LHPIC.sanitizeUrl = sanitizeUrl;

document.addEventListener('DOMContentLoaded', () => {
  injectIcons();
});
