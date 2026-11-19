# 🚀 LHPIC - Le Hong Phong Informatics Club Website

Trang web động chính thức của **Câu lạc bộ Tin học Trường THPT Chuyên Lê Hồng Phong (TP. Hồ Chí Minh)**, triển khai trên **Vercel** với **Serverless API (`/api`) + PostgreSQL (Neon / Supabase)**.

---

## 🌟 1. Kiến trúc hệ thống

* **Frontend:** HTML + Tailwind CSS + Vanilla JS (`index.html`, `about.html`, `events.html`, `gallery.html`, `contact.html`, `admin.html`).
* **Backend API (Vercel Serverless Functions):**
  * `GET/POST/DELETE /api/auth` — Xác thực BCN bằng `HttpOnly` signed cookie (tài khoản cấu hình qua biến môi trường).
  * `GET/POST/PUT/DELETE /api/events` — Quản lý các buổi sinh hoạt & thử thách.
  * `GET/POST/PUT/DELETE /api/albums` — Quản lý kho thư mục ảnh Google Drive (nhúng xem trực tiếp qua `embeddedfolderview`).
  * `GET/POST/PATCH/DELETE /api/messages` — Khách gửi tin nhắn liên hệ (công khai), chỉ Admin đăng nhập mới xem/xóa được hòm thư.
  * `POST /api/reset` — Khôi phục dữ liệu mẫu (chỉ Admin).
* **Database:** PostgreSQL (`events`, `albums`, `messages`, `app_meta`). Bảng và dữ liệu mẫu sẽ **tự động khởi tạo** ở lần gọi API đầu tiên (hoặc có thể chạy thủ công [db/schema.sql](db/schema.sql)).

---

## 🌐 2. Hướng dẫn triển khai trên Vercel + PostgreSQL (Neon / Supabase)

### Bước 1: Đẩy mã nguồn lên GitHub
```bash
git add .
git commit -m "Feat: chuyen sang web dong voi Vercel Serverless API va PostgreSQL"
git push origin main
```

### Bước 2: Kết nối cơ sở dữ liệu PostgreSQL trên Vercel
1. Vào dự án trên [Vercel Dashboard](https://vercel.com) → chọn tab **Storage** (hoặc **Integrations**).
2. Chọn **Create Database** → chọn **Neon (Serverless Postgres)** hoặc **Supabase** (cả hai đều có gói miễn phí).
3. Kết nối database với project Vercel này. Vercel sẽ tự động thêm biến môi trường `DATABASE_URL` (hoặc `POSTGRES_URL`).

### Bước 3: Cấu hình biến môi trường Admin
Vào **Project Settings → Environment Variables** và thêm các biến sau (xem mẫu trong `.env.example`):

| Biến | Mô tả | Ví dụ |
|------|-------|-------|
| `DATABASE_URL` | Chuỗi kết nối Postgres (tự có nếu tích hợp Neon/Supabase) | `postgresql://...` |
| `ADMIN_USERNAME` | Tên đăng nhập trang `/admin` | `admin` |
| `ADMIN_PASSWORD` | Mật khẩu trang `/admin` (**nên đặt mật khẩu mạnh**) | `MatKhauManh@2026` |
| `AUTH_SECRET` | Chuỗi bí mật ký cookie phiên đăng nhập (>= 32 ký tự) | `chuoi-ngau-nhien-rat-dai...` |

### Bước 4: Redeploy
Vào tab **Deployments** → nhấn **Redeploy** để áp dụng các biến môi trường mới. Sau khi deploy xong:
* Mọi máy truy cập đều đọc chung dữ liệu từ PostgreSQL.
* Admin thêm buổi sinh hoạt / folder ảnh ở máy này → máy khác tải lại trang sẽ thấy ngay.
* Phụ huynh/học sinh gửi tin nhắn ở `/contact` → BCN đăng nhập `/admin` trên bất kỳ máy nào cũng thấy ngay.

---

## 💻 3. Chạy thử trên máy tính (Local Development)

1. Cài dependencies:
   ```bash
   npm install
   ```
2. Tạo file `.env.local` dựa theo `.env.example` và điền `DATABASE_URL` của Neon/Supabase.
3. Chạy bằng Vercel CLI (để chạy cả HTML tĩnh và `/api/*`):
   ```bash
   npx vercel dev
   ```
   Sau đó mở `http://localhost:3000`.
