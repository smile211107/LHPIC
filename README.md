# 🚀 LHPIC - Le Hong Phong Informatics Club Website

Trang web chính thức của **Câu lạc bộ Tin học Trường THPT Chuyên Lê Hồng Phong (TP. Hồ Chí Minh)**.

---

## 🌟 1. Định vị & Tinh thần Thiết kế

* **Sân chơi học sinh tự nguyện, phi lợi nhuận:** Không mang tính chất trung tâm dạy thêm, không áp lực thi cử. Đây là ngôi nhà chung của các bạn học sinh THCS yêu thích máy tính và thuật toán, được dẫn dắt bởi tình yêu công nghệ của học sinh chuyên Tin Lê Hồng Phong.
* **Phong cách UI-UX Pro Max:** Năng động, hiện đại, thân thiện với học sinh và phụ huynh. Tông màu Xanh đen Navy kết hợp Cam đất/Đỏ gạch nhiệt huyết trên nền sáng.
* **Linh vật chú Gấu Trúc (Panda LHPIC):** Mang thông điệp *"Code together, Grow together!"*.

---

## 📁 2. Cấu trúc 5 Trang Người Dùng & 1 Hệ Thống Quản Trị (CMS)

1. `index.html`: **Trang chủ** — Hero banner, Sứ mệnh 4 trụ cột cộng đồng, Lịch gặp mặt Thứ Bảy tại Hội trường E, Các buổi sinh hoạt gần nhất, **Kho Folder ảnh từng buổi** kèm link Google Drive.
2. `about.html`: **Về CLB** — Câu chuyện thành lập do học sinh sáng lập, nhịp đập sinh hoạt 4 bước trong tuần, giải đáp thắc mắc cởi mở.
3. `events.html`: **Buổi sinh hoạt & Thử thách** — Bộ lọc chuyên đề (Sắp diễn ra, Đang mở thử thách, Đã diễn ra), tìm kiếm theo tên, xem chi tiết và tài liệu chia sẻ.
4. `gallery.html`: **Kho ảnh theo từng buổi sinh hoạt** — Mỗi buổi là 1 Folder ảnh riêng biệt:
   * Hiển thị số lượng ảnh, ngày chụp, ảnh bìa và mô tả.
   * **Nút mở Folder Google Drive** trực tiếp để xem trọn bộ ảnh gốc chất lượng cao và tải về máy.
   * **Nút mở xem ảnh nhanh trên web** kèm Lightbox phóng to ảnh toàn màn hình (hỗ trợ phím mũi tên `←` / `→` và `ESC`).
5. `contact.html`: **Giao lưu & Kết nối** — Kèm **2 Mã QR quét nhanh** và nút bấm vào **Nhóm Zalo [LHPIC 2627]** và **Fanpage Facebook**, địa chỉ Hội trường E.
6. `admin.html`: **Cổng Quản trị BCN (CMS)**:
   * Đăng nhập bảo mật (mặc định: `admin` / `lhpic2024`).
   * **Quản lý Buổi sinh hoạt:** Thêm, sửa, xóa các chuyên đề và thử thách.
   * **Quản lý Folder Kho ảnh:** Tạo thư mục buổi sinh hoạt mới, dán link Google Drive, tải ảnh bìa, cập nhật số lượng ảnh.
   * **Sao lưu dữ liệu JSON** và **Khôi phục dữ liệu ban đầu**.

---

## 💻 3. Hướng dẫn xem thử website ngay trên máy tính

Mở **Terminal** tại thư mục dự án và chạy:

```bash
cd /Users/Apple/Documents/LHPIC
python3 -m http.server 3000
```

Sau đó mở trình duyệt và truy cập:
* **Trang chủ:** [`http://localhost:3000`](http://localhost:3000)
* **Kho ảnh từng buổi:** [`http://localhost:3000/gallery.html`](http://localhost:3000/gallery.html)
* **Cổng quản trị Admin:** [`http://localhost:3000/admin.html`](http://localhost:3000/admin.html)

---

## 🌐 4. Triển khai miễn phí lên Vercel (`lhpic.vercel.app`)

1. Đẩy mã nguồn lên GitHub:
   ```bash
   git add .
   git commit -m "Update: redesign gallery folders with Google Drive links and refresh club community vibe"
   git push origin main
   ```
2. Đăng nhập [Vercel](https://vercel.com) > Chọn kho lưu trữ `lhpic`.
3. Đặt Project Name là **`lhpic`** để có tên miền:
   👉 **`https://lhpic.vercel.app`**
4. Nhấn **Deploy**.
