# 🚀 LHPIC - Le Hong Phong Informatics Club Website

Trang web chính thức của **Câu lạc bộ Tin học Trường THPT Chuyên Lê Hồng Phong (TP. Hồ Chí Minh)**.

---

## 📌 1. Giới thiệu Dự án

Website được xây dựng theo chuẩn **UI-UX Pro Max** với các tiêu chí:
* **Giao diện hiện đại, năng động & thân thiện:** Tông màu chủ đạo Trắng / Xám sáng kết hợp điểm nhấn Xanh đen (Navy) và Cam đất/Đỏ gạch, phù hợp với học sinh THCS và phụ huynh.
* **Linh vật độc quyền:** Chú gấu trúc (Panda) đeo băng trán `LHPIC` gõ laptop với cửa sổ code phía sau chuẩn vector SVG sắc nét.
* **Đầy đủ 5 trang nội dung & 1 phân hệ Quản trị (CMS):**
  1. `index.html`: **Trang chủ (Homepage)** — Hero banner, Sứ mệnh, Lịch sinh hoạt tại Hội trường E, Sự kiện mới nhất, Thư viện ảnh tiêu biểu, Kêu gọi hành động.
  2. `about.html`: **Về chúng tôi (About Us)** — Câu chuyện thành lập, sứ mệnh định hướng HSGTP, quy trình học tập 4 bước hàng tuần.
  3. `events.html`: **Sự kiện & Hoạt động (Events)** — Bộ lọc chuyên đề (Sắp diễn ra / Đang diễn ra / Đã kết thúc), tìm kiếm thời gian thực, xem chi tiết modal & tải tài liệu.
  4. `gallery.html`: **Thư viện ảnh (Gallery)** — Lưới hiển thị ảnh Hội trường E, học sinh làm bài contest, xem ảnh phóng to toàn màn hình (Lightbox) với phím mũi tên.
  5. `contact.html`: **Liên hệ (Contact)** — Địa chỉ Hội trường E, Bản đồ, Form nhắn tin, và **2 Thẻ Kênh kết nối chính thức kèm Mã QR quét nhanh**:
     * Fanpage Facebook: [https://www.facebook.com/LHPIC235](https://www.facebook.com/LHPIC235)
     * Nhóm Zalo trao đổi ([LHPIC 2627]): [https://zalo.me/g/dfmcirov4fictruxm9n4](https://zalo.me/g/dfmcirov4fictruxm9n4)
  6. `admin.html`: **Hệ thống Quản trị CMS** — Thêm, sửa, xóa sự kiện và tải ảnh mới lên thư viện trực tiếp mà không cần can thiệp vào code.

---

## 💻 2. Xem thử website ngay trên máy tính

Chỉ cần mở Terminal tại thư mục `LHPIC` và chạy lệnh sau (đã có sẵn trên mọi máy Mac):

```bash
# Mở server cục bộ với Python
python3 -m http.server 3000
```

Sau đó mở trình duyệt và truy cập: **`http://localhost:3000`**

---

## 🔑 3. Hướng dẫn sử dụng trang Quản trị (Admin CMS)

1. Truy cập đường dẫn: **`http://localhost:3000/admin.html`**
2. Đăng nhập với tài khoản mặc định:
   * **Tên đăng nhập:** `admin` (hoặc `lhpic`)
   * **Mật khẩu:** `lhpic2024`
3. Các chức năng có trong CMS:
   * **Quản lý Sự kiện:** Thêm buổi sinh hoạt mới, sửa ngày giờ, cập nhật trạng thái (Sắp diễn ra, Đang diễn ra, Đã kết thúc), gắn link tài liệu / Contest.
   * **Quản lý Thư viện ảnh:** Chọn file ảnh từ máy tính (Upload tức thì) hoặc nhập link ảnh, chọn album (Hội trường E, Ban Chuyên môn, Contest...), xóa ảnh cũ.
   * **Sao lưu dữ liệu:** Nút "Xuất sao lưu JSON" để tải dữ liệu về máy, nút "Khôi phục dữ liệu mẫu".
   * **Đồng bộ tự động:** Dữ liệu lưu trong trình duyệt (`localStorage`) và cập nhật tức thì ra ngoài trang chủ, trang sự kiện và thư viện ảnh!

---

## 🌐 4. Hướng dẫn Triển khai miễn phí lên Vercel (`lhpic.vercel.app`)

### Cách 1: Đưa lên GitHub rồi kết nối Vercel (Khuyên dùng)
1. Khởi tạo Git và đẩy mã nguồn lên GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit for LHPIC website"
   # Đổi tên nhánh và liên kết repo GitHub của bạn
   git branch -M main
   git remote add origin https://github.com/<tai-khoan-cua-ban>/lhpic.git
   git push -u origin main
   ```
2. Đăng nhập vào [Vercel](https://vercel.com).
3. Nhấn **Add New Project** > Chọn kho lưu trữ `lhpic`.
4. Tại mục **Project Name**, đặt tên là **`lhpic`** để sở hữu tên miền:
   👉 **`https://lhpic.vercel.app`**
5. Nhấn **Deploy**. Chỉ sau 10 giây website của CLB sẽ chính thức trực tuyến!

### Cách 2: Triển khai trên Netlify hoặc GitHub Pages
* **Netlify:** Kéo thả trực tiếp toàn bộ thư mục `LHPIC` vào trang [Netlify Drop](https://app.netlify.com/drop) và cấu hình subdomain là `lhpic.netlify.app`.
* **GitHub Pages:** Vào mục Settings của Repository trên GitHub > Pages > chọn nhánh `main` > Save.

---

## 📁 5. Cấu trúc thư mục

```text
LHPIC/
├── index.html            # Trang chủ
├── about.html            # Về chúng tôi (About Us)
├── events.html           # Sự kiện & Hoạt động
├── gallery.html          # Thư viện ảnh với Lightbox
├── contact.html          # Liên hệ, Bản đồ & Mã QR (Facebook, Zalo)
├── admin.html            # Cổng Quản trị viên (CMS)
├── vercel.json           # Cấu hình Vercel tối ưu tốc độ & cache
├── README.md             # Hướng dẫn chi tiết
├── design-system/        # Bản quy chuẩn thiết kế UI-UX Pro Max
│   └── lhpic/
│       └── MASTER.md
└── assets/
    ├── css/
    │   └── style.css     # Font, hiệu ứng chuyển động, thanh cuộn
    ├── images/
    │   └── panda-logo.svg# Logo gấu trúc LHPIC vector chuẩn
    └── js/
        ├── store.js      # Kho lưu trữ dữ liệu tập trung & LocalStorage
        ├── components.js # Thanh điều hướng (Navbar), Footer & Toast
        ├── home.js       # Logic hiển thị trang chủ
        ├── events.js     # Logic bộ lọc & Modal sự kiện
        ├── gallery.js    # Logic bộ lọc album & Lightbox xem ảnh
        └── admin.js      # Logic quản trị CMS sự kiện & upload ảnh
```
