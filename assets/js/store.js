/**
 * Central Data Store for LHPIC
 * Định vị: Câu lạc bộ học sinh đam mê công nghệ & thuật toán
 * Quản lý buổi sinh hoạt & thư mục Google Drive trực tiếp
 */

const STORAGE_KEYS = {
  EVENTS: 'lhpic_events_data_v2',
  GALLERY_ALBUMS: 'lhpic_albums_data_v4',
  AUTH: 'lhpic_admin_session_v1',
};

// Dữ liệu các buổi sinh hoạt giao lưu chuyên đề của CLB
const DEFAULT_EVENTS = [
  {
    id: 'evt-001',
    title: 'Chuyên đề 05: Thú vị với Kỹ thuật Hai con trỏ & Cửa sổ trượt',
    category: 'Sinh hoạt chuyên đề',
    status: 'upcoming',
    date: '2024-11-16',
    time: '13:30 - 16:00',
    location: 'Hội trường E, THPT Chuyên Lê Hồng Phong',
    instructor: 'Nhóm chia sẻ: Anh Nam & Chị Vy (Đội tuyển Tin học LHP)',
    summary: 'Cùng nhau tìm hiểu cách biến các thuật toán chạy chậm thành siêu nhanh qua những bài toán tư duy thú vị, mang tính ứng dụng cao.',
    coverImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800&auto=format&fit=crop',
    content: 'Chào các bạn! Trong buổi sinh hoạt tuần này, chúng mình sẽ cùng khám phá kỹ thuật Hai con trỏ (Two Pointers) và Cửa sổ trượt (Sliding Window). Không lý thuyết hàn lâm, chúng mình sẽ cùng chia nhóm giải các câu đố thuật toán, hỗ trợ gỡ lỗi code trực tiếp cho nhau. Nhớ mang theo laptop có cài sẵn compiler C++ nhé!',
    docLink: 'https://github.com/lhpic',
    contestLink: '',
    createdAt: '2024-11-01',
  },
  {
    id: 'evt-002',
    title: 'Thử thách Cuối tuần #03: Thuật toán Tham lam & Tìm kiếm Nhị phân',
    category: 'Sân chơi thử sức',
    status: 'ongoing',
    date: '2024-11-10',
    time: '08:00 - 22:00',
    location: 'Nền tảng Lập trình trực tuyến LHPIC OJ',
    instructor: 'Ban Chuyên môn LHPIC',
    summary: 'Sân chơi giao lưu lập trình tự nguyện cuối tuần, cùng thử sức các câu đố thuật toán thú vị sau buổi sinh hoạt số 4.',
    coverImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=800&auto=format&fit=crop',
    content: 'Đấu trường vui nhộn mở tự do cho mọi thành viên CLB. Cùng tranh tài xem ai có cách giải sáng tạo và tối ưu nhất. Sau khi kết thúc, chúng mình sẽ có bài chia sẻ ý tưởng giải (Editorial) để mọi người cùng học hỏi lẫn nhau.',
    docLink: '',
    contestLink: 'https://codeforces.com',
    createdAt: '2024-11-03',
  },
  {
    id: 'evt-003',
    title: 'Chuyên đề 04: Giải mã Chiến thuật Tham lam (Greedy Algorithm)',
    category: 'Sinh hoạt chuyên đề',
    status: 'completed',
    date: '2024-11-02',
    time: '13:30 - 16:00',
    location: 'Hội trường E, THPT Chuyên Lê Hồng Phong',
    instructor: 'Nhóm học sinh Chuyên Tin LHP',
    summary: 'Khi nào thì chọn cái tốt nhất trước mắt lại mang về kết quả tối ưu toàn cục? Khám phá tư duy thuật toán tham lam qua các trò chơi logic.',
    coverImage: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=800&auto=format&fit=crop',
    content: 'Buổi sinh hoạt đã diễn ra vô cùng sôi nổi với sự tham gia của hơn 60 bạn học sinh yêu tin học. Rất nhiều ý tưởng lời giải độc đáo đã được các bạn đưa ra!',
    docLink: 'https://github.com/lhpic',
    contestLink: '',
    createdAt: '2024-10-25',
  },
  {
    id: 'evt-004',
    title: 'Chuyên đề 03: Khám phá Cấu trúc Dữ liệu Ngăn xếp & Hàng đợi',
    category: 'Sinh hoạt chuyên đề',
    status: 'completed',
    date: '2024-10-19',
    time: '13:30 - 16:00',
    location: 'Hội trường E, THPT Chuyên Lê Hồng Phong',
    instructor: 'Ban Chuyên môn LHPIC',
    summary: 'Hình dung nguyên lý vào trước ra trước (FIFO) và vào sau ra trước (LIFO) qua các tình huống đời sống và bài toán xử lý chuỗi.',
    coverImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop',
    content: 'Tự tay cài đặt Stack & Queue và ứng dụng vào giải quyết bài toán kiểm tra dấu ngoặc hợp lệ. Không khí thảo luận theo nhóm tại Hội trường E rất hào hứng.',
    docLink: '',
    contestLink: '',
    createdAt: '2024-10-12',
  },
  {
    id: 'evt-005',
    title: 'Ngày hội Gặp gỡ & Khởi động Năm sinh hoạt mới 2024 - 2025',
    category: 'Giao lưu CLB',
    status: 'completed',
    date: '2024-10-05',
    time: '13:30 - 16:30',
    location: 'Hội trường E, THPT Chuyên Lê Hồng Phong',
    instructor: 'Đội ngũ Ban Điều Hành CLB LHPIC',
    summary: 'Buổi gặp mặt đầu tiên, làm quen các thành viên mới, chia sẻ đam mê máy tính và thưởng thức trà bánh cùng các trò chơi phá băng.',
    coverImage: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=800&auto=format&fit=crop',
    content: 'Mở màn cho một năm sinh hoạt tràn đầy năng lượng của cộng đồng Tin học Lê Hồng Phong. Chào đón tất cả các bạn học sinh có chung tình yêu công nghệ!',
    docLink: '',
    contestLink: '',
    createdAt: '2024-09-28',
  }
];

// Thư viện ảnh tổ chức theo Folder Google Drive trực tiếp từng buổi
const DEFAULT_ALBUMS = [
  {
    id: 'alb-005',
    sessionName: 'Buổi sinh hoạt 05',
    title: 'Kỹ thuật Hai con trỏ & Thảo luận nhóm',
    date: '16/11/2024',
    coverImage: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1000&auto=format&fit=crop',
    driveLink: 'https://drive.google.com/drive/folders/1lhpic_session05_drive_sample',
    driveFolderId: '1lhpic_session05_drive_sample',
    description: 'Khoảnh khắc các nhóm cùng chụm đầu gỡ bug, thảo luận ý tưởng tối ưu độ phức tạp và giờ giải lao trà bánh vui vẻ.'
  },
  {
    id: 'alb-004',
    sessionName: 'Buổi sinh hoạt 04',
    title: 'Chinh phục Tư duy Tham lam & Minigame Thuật toán',
    date: '02/11/2024',
    coverImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1000&auto=format&fit=crop',
    driveLink: 'https://drive.google.com/drive/folders/1lhpic_session04_drive_sample',
    driveFolderId: '1lhpic_session04_drive_sample',
    description: 'Những tiếng cười rộn rã trong phần minigame mô phỏng bài toán xếp lịch và nụ cười rạng rỡ khi bài nộp đạt điểm tối đa.'
  },
  {
    id: 'alb-003',
    sessionName: 'Buổi sinh hoạt 03',
    title: 'Cấu trúc dữ liệu Ngăn xếp & Hàng đợi vui nhộn',
    date: '19/10/2024',
    coverImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1000&auto=format&fit=crop',
    driveLink: 'https://drive.google.com/drive/folders/1lhpic_session03_drive_sample',
    driveFolderId: '1lhpic_session03_drive_sample',
    description: 'Thực hành lập trình C++ vui nhộn, làm quen với thư viện STL và tự chế tạo cấu trúc ngăn xếp của riêng mình.'
  },
  {
    id: 'alb-002',
    sessionName: 'Thử thách Cuối tuần',
    title: 'Giao lưu Lập trình Thử sức & Chia sẻ Ý tưởng',
    date: '10/11/2024',
    coverImage: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?q=80&w=1000&auto=format&fit=crop',
    driveLink: 'https://drive.google.com/drive/folders/1lhpic_contest_drive_sample',
    driveFolderId: '1lhpic_contest_drive_sample',
    description: 'Tổng hợp ảnh chụp màn hình bảng điểm xanh mướt (Accepted) và buổi thảo luận online giải thích thuật toán tối ưu.'
  },
  {
    id: 'alb-001',
    sessionName: 'Ngày hội Ra mắt',
    title: 'Chào đón Thành viên Mới & Gặp gỡ Khởi động',
    date: '05/10/2024',
    coverImage: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1000&auto=format&fit=crop',
    driveLink: 'https://drive.google.com/drive/folders/1lhpic_welcome_drive_sample',
    driveFolderId: '1lhpic_welcome_drive_sample',
    description: 'Trọn bộ khoảnh khắc ngày đầu gặp gỡ: trao quà lưu niệm sticker chú gấu trúc LHPIC, trò chơi gắn kết và chụp ảnh tập thể.'
  }
];

class LHPICStore {
  constructor() {
    this.init();
  }

  init() {
    if (!localStorage.getItem(STORAGE_KEYS.EVENTS)) {
      this.saveEvents(DEFAULT_EVENTS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.GALLERY_ALBUMS)) {
      this.saveAlbums(DEFAULT_ALBUMS);
    }
  }

  // Trích xuất Folder ID từ mọi định dạng link Google Drive
  extractDriveFolderId(url) {
    if (!url) return '';
    const match = url.match(/[-\w]{25,}/);
    return match ? match[0] : url;
  }

  // ============ EVENTS CRUD ============
  getEvents() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.EVENTS);
      return data ? JSON.parse(data) : DEFAULT_EVENTS;
    } catch (e) {
      console.error('Error reading events', e);
      return DEFAULT_EVENTS;
    }
  }

  saveEvents(events) {
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
    window.dispatchEvent(new CustomEvent('lhpic_data_updated', { detail: { type: 'events' } }));
  }

  addEvent(eventData) {
    const events = this.getEvents();
    const newEvent = {
      ...eventData,
      id: 'evt-' + Date.now(),
      createdAt: new Date().toISOString().split('T')[0],
    };
    events.unshift(newEvent);
    this.saveEvents(events);
    return newEvent;
  }

  updateEvent(id, updatedFields) {
    const events = this.getEvents();
    const index = events.findIndex(e => e.id === id);
    if (index !== -1) {
      events[index] = { ...events[index], ...updatedFields };
      this.saveEvents(events);
      return events[index];
    }
    return null;
  }

  deleteEvent(id) {
    let events = this.getEvents();
    events = events.filter(e => e.id !== id);
    this.saveEvents(events);
    return true;
  }

  // ============ ALBUMS (FOLDER TỪNG BUỔI) CRUD ============
  getAlbums() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.GALLERY_ALBUMS);
      return data ? JSON.parse(data) : DEFAULT_ALBUMS;
    } catch (e) {
      console.error('Error reading albums', e);
      return DEFAULT_ALBUMS;
    }
  }

  saveAlbums(albums) {
    localStorage.setItem(STORAGE_KEYS.GALLERY_ALBUMS, JSON.stringify(albums));
    window.dispatchEvent(new CustomEvent('lhpic_data_updated', { detail: { type: 'albums' } }));
  }

  addAlbum(albumData) {
    const albums = this.getAlbums();
    const folderId = this.extractDriveFolderId(albumData.driveLink);
    const newAlbum = {
      ...albumData,
      id: 'alb-' + Date.now(),
      driveFolderId: folderId
    };
    albums.unshift(newAlbum);
    this.saveAlbums(albums);
    return newAlbum;
  }

  updateAlbum(id, updatedFields) {
    const albums = this.getAlbums();
    const index = albums.findIndex(a => a.id === id);
    if (index !== -1) {
      if (updatedFields.driveLink) {
        updatedFields.driveFolderId = this.extractDriveFolderId(updatedFields.driveLink);
      }
      albums[index] = { ...albums[index], ...updatedFields };
      this.saveAlbums(albums);
      return albums[index];
    }
    return null;
  }

  deleteAlbum(id) {
    let albums = this.getAlbums();
    albums = albums.filter(a => a.id !== id);
    this.saveAlbums(albums);
    return true;
  }

  // Reset về mặc định
  resetDefaults() {
    this.saveEvents(DEFAULT_EVENTS);
    this.saveAlbums(DEFAULT_ALBUMS);
    return true;
  }

  // Auth
  login(username, password) {
    if ((username === 'admin' || username === 'lhpic') && (password === 'lhpic2024' || password === 'admin123')) {
      const session = {
        user: username,
        token: 'token_' + Date.now(),
        loginAt: new Date().toISOString(),
      };
      sessionStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(session));
      return { success: true, user: username };
    }
    return { success: false, message: 'Tên đăng nhập hoặc mật khẩu không chính xác! (Mặc định: admin / lhpic2024)' };
  }

  logout() {
    sessionStorage.removeItem(STORAGE_KEYS.AUTH);
  }

  isAuthenticated() {
    return !!sessionStorage.getItem(STORAGE_KEYS.AUTH);
  }

  getCurrentUser() {
    const data = sessionStorage.getItem(STORAGE_KEYS.AUTH);
    return data ? JSON.parse(data) : null;
  }
}

window.LHPIC = window.LHPIC || {};
window.LHPIC.store = new LHPICStore();
