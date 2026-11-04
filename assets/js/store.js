/**
 * Central Data Store for LHPIC
 * Provides local storage persistence, realistic seed data, and CRUD operations.
 */

const STORAGE_KEYS = {
  EVENTS: 'lhpic_events_data_v1',
  GALLERY: 'lhpic_gallery_data_v1',
  AUTH: 'lhpic_admin_session_v1',
};

// High quality initial seed events based on LHPIC curriculum & activities
const DEFAULT_EVENTS = [
  {
    id: 'evt-001',
    title: 'Buổi 5: Kỹ thuật Hai con trỏ (Two Pointers) & Cửa sổ trượt (Sliding Window)',
    category: 'Chuyên đề học thuật',
    status: 'upcoming', // 'upcoming' | 'ongoing' | 'completed'
    date: '2024-11-16',
    time: '13:30 - 16:00',
    location: 'Hội trường E, THPT Chuyên Lê Hồng Phong',
    instructor: 'Ban Chuyên môn LHPIC (Đội tuyển Tin học Quốc gia & TP)',
    summary: 'Tìm hiểu cách tối ưu hóa độ phức tạp thuật toán từ O(N²) về O(N) qua các bài toán mảng con, xâu ký tự kinh điển trong đề thi HSGTP.',
    coverImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800&auto=format&fit=crop',
    content: 'Nội dung buổi sinh hoạt gồm: 1. Khái niệm cơ bản về Hai con trỏ chạy cùng chiều & ngược chiều. 2. Ứng dụng cửa sổ trượt tĩnh và động. 3. Phân tích các bài tập HSGTP gần đây. Học sinh cần mang theo laptop cá nhân đã cài sẵn Code::Blocks hoặc VS Code/C++ compiler.',
    docLink: 'https://github.com/lhpic',
    contestLink: '',
    createdAt: '2024-11-01',
  },
  {
    id: 'evt-002',
    title: 'Contest Luyện tập HSGTP #03: Thuật toán Tham lam (Greedy) & Tìm kiếm Nhị phân',
    category: 'Contest thực chiến',
    status: 'ongoing',
    date: '2024-11-10',
    time: '08:00 - 22:00',
    location: 'Nền tảng Chấm trực tuyến (Online Judge)',
    instructor: 'Hệ thống Chấm tự động LHPIC OJ',
    summary: 'Kỳ thi thực hành kiểm tra kỹ năng áp dụng phương pháp tham lam và tìm kiếm nhị phân trên tập kết quả sau buổi học lý thuyết số 4.',
    coverImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=800&auto=format&fit=crop',
    content: 'Đề thi gồm 4 bài toán phân cấp từ cơ bản đến nâng cao. Thời gian làm bài linh hoạt trong khung giờ mở contest. Bảng xếp hạng cập nhật realtime và có bài giải chi tiết (Editorial) sau khi contest kết thúc.',
    docLink: '',
    contestLink: 'https://codeforces.com',
    createdAt: '2024-11-03',
  },
  {
    id: 'evt-003',
    title: 'Buổi 4: Phương pháp Tham lam (Greedy Algorithm) & Ứng dụng thực tế',
    category: 'Chuyên đề học thuật',
    status: 'completed',
    date: '2024-11-02',
    time: '13:30 - 16:00',
    location: 'Hội trường E, THPT Chuyên Lê Hồng Phong',
    instructor: 'Ban Chuyên môn LHPIC',
    summary: 'Nắm vững tư tưởng chọn lựa tối ưu cục bộ, chứng minh tính đúng đắn của chiến thuật tham lam và cài đặt mẫu.',
    coverImage: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=800&auto=format&fit=crop',
    content: 'Buổi học đã diễn ra thành công với sự tham gia của hơn 60 học sinh THCS yêu thích lập trình trên địa bàn TP.HCM.',
    docLink: 'https://github.com/lhpic',
    contestLink: '',
    createdAt: '2024-10-25',
  },
  {
    id: 'evt-004',
    title: 'Buổi 3: Cấu trúc dữ liệu Ngăn xếp (Stack) & Hàng đợi (Queue)',
    category: 'Chuyên đề học thuật',
    status: 'completed',
    date: '2024-10-19',
    time: '13:30 - 16:00',
    location: 'Hội trường E, THPT Chuyên Lê Hồng Phong',
    instructor: 'Ban Chuyên môn LHPIC',
    summary: 'Khám phá các cấu trúc dữ liệu nền tảng LIFO & FIFO, ứng dụng giải bài toán kiểm tra ngoặc hợp lệ và bài toán phần tử lớn hơn tiếp theo.',
    coverImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop',
    content: 'Nội dung thực hành phong phú, các bạn học sinh đã nắm vững cách tự cài đặt Stack/Queue và sử dụng std::stack, std::queue trong thư viện STL C++.',
    docLink: '',
    contestLink: '',
    createdAt: '2024-10-12',
  },
  {
    id: 'evt-005',
    title: 'Lễ Khai giảng Khóa Huấn luyện Chuyên đề Tin học LHPIC 2024 - 2025',
    category: 'Sự kiện đặc biệt',
    status: 'completed',
    date: '2024-10-05',
    time: '13:30 - 16:30',
    location: 'Hội trường E, THPT Chuyên Lê Hồng Phong',
    instructor: 'Ban Chủ nhiệm CLB Tin học LHPIC',
    summary: 'Gặp gỡ ban cố vấn, định hướng lộ trình học tập ôn luyện HSGTP và làm quen với môi trường học thuật chuyên sâu.',
    coverImage: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=800&auto=format&fit=crop',
    content: 'Chào mừng các bạn học sinh THCS thế hệ mới gia nhập đại gia đình Tin học Lê Hồng Phong. Buổi khai giảng tràn ngập năng lượng và sự hào hứng.',
    docLink: '',
    contestLink: '',
    createdAt: '2024-09-28',
  }
];

// High quality initial seed gallery based on LHPIC Hall E activities & contests
const DEFAULT_GALLERY = [
  {
    id: 'gal-001',
    title: 'Buổi sinh hoạt chuyên đề tại Hội trường E',
    category: 'Hội trường E',
    date: 'Tháng 11/2024',
    imageUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=1000&auto=format&fit=crop',
    caption: 'Học sinh tập trung lắng nghe phân tích thuật toán tối ưu tại Hội trường E, THPT Chuyên Lê Hồng Phong.',
  },
  {
    id: 'gal-002',
    title: 'Học sinh say mê thực hành code trên máy tính',
    category: 'Học sinh & Lập trình',
    date: 'Tháng 11/2024',
    imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1000&auto=format&fit=crop',
    caption: 'Cùng nhau thảo luận test case và sửa lỗi biên dịch trong bài tập thuật toán.',
  },
  {
    id: 'gal-003',
    title: 'Ban Chuyên môn LHPIC giảng dạy & hướng dẫn',
    category: 'Ban Chuyên môn',
    date: 'Tháng 10/2024',
    imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1000&auto=format&fit=crop',
    caption: 'Các anh chị ban giảng dạy tận tình hỗ trợ từng bạn học sinh THCS trong giờ bài tập.',
  },
  {
    id: 'gal-004',
    title: 'Không khí tập trung cao độ trong kỳ Contest',
    category: 'Contest',
    date: 'Tháng 10/2024',
    imageUrl: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?q=80&w=1000&auto=format&fit=crop',
    caption: 'Thực chiến với các bài toán thuật toán đòi hỏi tư duy logic và kỹ năng cài đặt chính xác.',
  },
  {
    id: 'gal-005',
    title: 'Thảo luận nhóm sôi nổi giải thuật toán hóc búa',
    category: 'Hội trường E',
    date: 'Tháng 10/2024',
    imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1000&auto=format&fit=crop',
    caption: 'Tinh thần đồng đội và học hỏi không ngừng giữa các thành viên CLB.',
  },
  {
    id: 'gal-006',
    title: 'Vinh danh & Trao phần thưởng cho học sinh xuất sắc',
    category: 'Sự kiện đặc biệt',
    date: 'Tháng 10/2024',
    imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1000&auto=format&fit=crop',
    caption: 'Những nụ cười rạng rỡ của các bạn đạt thứ hạng cao sau kỳ thi khảo sát năng khiếu.',
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
    if (!localStorage.getItem(STORAGE_KEYS.GALLERY)) {
      this.saveGallery(DEFAULT_GALLERY);
    }
  }

  // ============ EVENTS CRUD ============
  getEvents() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.EVENTS);
      return data ? JSON.parse(data) : DEFAULT_EVENTS;
    } catch (e) {
      console.error('Error reading events from storage', e);
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

  // ============ GALLERY CRUD ============
  getGallery() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.GALLERY);
      return data ? JSON.parse(data) : DEFAULT_GALLERY;
    } catch (e) {
      console.error('Error reading gallery from storage', e);
      return DEFAULT_GALLERY;
    }
  }

  saveGallery(gallery) {
    localStorage.setItem(STORAGE_KEYS.GALLERY, JSON.stringify(gallery));
    window.dispatchEvent(new CustomEvent('lhpic_data_updated', { detail: { type: 'gallery' } }));
  }

  addPhoto(photoData) {
    const gallery = this.getGallery();
    const newPhoto = {
      ...photoData,
      id: 'gal-' + Date.now(),
    };
    gallery.unshift(newPhoto);
    this.saveGallery(gallery);
    return newPhoto;
  }

  deletePhoto(id) {
    let gallery = this.getGallery();
    gallery = gallery.filter(g => g.id !== id);
    this.saveGallery(gallery);
    return true;
  }

  // ============ RESET TO DEFAULT ============
  resetDefaults() {
    this.saveEvents(DEFAULT_EVENTS);
    this.saveGallery(DEFAULT_GALLERY);
    return true;
  }

  // ============ AUTHENTICATION ============
  login(username, password) {
    // Default demo credentials: admin / lhpic2024
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

// Global singleton instance
window.LHPIC = window.LHPIC || {};
window.LHPIC.store = new LHPICStore();
