# Website Quy Trình Báo Giá

Website hiển thị và theo dõi tiến độ thực hiện **quy trình báo giá**, hỗ trợ lưu trữ nội dung tập trung trên **Supabase** và triển khai qua **Vercel**, kèm khu vực quản lý bảo vệ bằng mật khẩu phía máy chủ tại `/admin`.

---

## 1. Kiến trúc triển khai & Lưu trữ

- **Frontend (Vercel Static):**
  - `/` (`index.html`, `js/app.js`, `js/storage.js`): Hiển thị nội dung quy trình đồng bộ từ máy chủ cho mọi người truy cập; trạng thái tick hoàn thành của từng người được lưu **độc lập trên trình duyệt của chính người đó (`LocalStorage`)**.
  - `/admin` (`admin.html`, `js/admin.js`): Khu vực quản lý dành cho ~2 người quản lý (có liên kết *"Quản lý quy trình"* ở Footer) để thêm, sửa, xóa, sắp xếp các bước và cập nhật thông tin chung.
- **Backend API (Vercel Serverless Functions — `api/*.js`):**
  - `GET /api/workflow`: Trả về thông tin chung (`meta`) và danh sách các bước (`steps`).
  - `GET /api/admin/session`, `POST /api/admin/login`, `POST /api/admin/logout`: Xác thực mật khẩu dùng chung phía server và cấp cookie phiên `HttpOnly; SameSite=Strict` ký HMAC-SHA256.
  - `PUT /api/admin/meta`, `POST/PUT/DELETE /api/admin/steps`, `PUT /api/admin/reorder`: Chỉ cho phép ghi dữ liệu khi đã xác thực phiên quản trị.
- **Database (Supabase PostgreSQL):**
  - Lưu trữ `workflow_meta` và `workflow_steps` (khóa chính UUID cố định).
  - Row Level Security (RLS) chỉ mở quyền `SELECT` công khai và **không** tạo policy ghi công khai; mọi thao tác ghi đi qua `/api/admin/*` bằng `SUPABASE_SERVICE_ROLE_KEY` ở server.
- **Bảo lưu tiến độ cá nhân:**
  - Chỉnh sửa nội dung hoặc đổi thứ tự bước giữ nguyên `id` (UUID) nên các bước người dùng đã đánh dấu hoàn thành không bị mất.
  - Xóa bước cũ và tạo bước mới sẽ sinh UUID mới (xem như một bước mới).

---

## 2. Cấu trúc mã nguồn

```text
Quotation-Workflow/
├── index.html                 # Trang chính cho người dùng xem & đánh dấu tiến độ
├── admin.html                 # Trang quản lý quy trình (/admin)
├── vercel.json                # Cấu hình rewrite /admin -> /admin.html & Cache-Control API
├── package.json               # Cấu hình ESM & script chạy dev cục bộ
├── .env.example               # Mẫu biến môi trường cho server
├── api/
│   ├── workflow.js            # GET /api/workflow
│   └── admin/
│       ├── login.js           # POST /api/admin/login
│       ├── logout.js          # POST /api/admin/logout
│       ├── session.js         # GET /api/admin/session
│       ├── meta.js            # PUT /api/admin/meta
│       ├── steps.js           # POST / PUT / DELETE /api/admin/steps
│       └── reorder.js         # PUT /api/admin/reorder
├── server/
│   ├── auth.js                # Kiểm tra mật khẩu, rate limit & cookie HMAC
│   ├── db.js                  # Kết nối Supabase REST (hoặc JSON dev store khi dev local)
│   ├── http.js                # Đọc JSON body & phản hồi chuẩn
│   └── validation.js          # Kiểm tra hợp lệ dữ liệu bước & thông tin chung
├── supabase/
│   └── schema.sql             # Script tạo bảng, RLS & dữ liệu Placeholder ban đầu
├── css/
│   └── styles.css             # Giao diện Light/Dark, Bento layout & khu vực /admin
├── data/
│   └── processData.js         # Dữ liệu dự phòng khi mở file:// và bảng màu từng bước
├── js/
│   ├── storage.js             # Quản lý LocalStorage cho tiến độ cá nhân & theme
│   ├── app.js                 # Logic trang chính (/index.html)
│   └── admin.js               # Logic khu vực quản lý (/admin)
└── scripts/
    └── dev-server.mjs         # Máy chủ phát triển cục bộ (tĩnh + API)
```

---

## 3. Hướng dẫn cấu hình Supabase & Triển khai Vercel

### Bước 1: Tạo cơ sở dữ liệu trên Supabase

1. Tạo một project mới trên Supabase.
2. Mở **SQL Editor** trong Supabase Dashboard, dán toàn bộ nội dung file `supabase/schema.sql` và chạy **Run**.
   - Script sẽ tạo bảng `workflow_meta`, `workflow_steps`, bật RLS an toàn và nạp sẵn 7 bước Placeholder sơ bộ với nội dung `"Chưa được cung cấp"`.
3. Vào **Project Settings → API Keys** (hoặc **API**) để lấy:
   - `Project URL` → dùng cho biến `SUPABASE_URL`
   - **Secret API Key** mới (`sb_secret_...`) hoặc legacy `service_role` key → dùng cho biến `SUPABASE_SERVICE_ROLE_KEY`

### Bước 2: Triển khai lên Vercel

1. Đưa mã nguồn lên Git repository (GitHub / GitLab / Bitbucket) hoặc deploy qua Vercel CLI.
2. Tạo Project trên Vercel trỏ vào repository này (Framework Preset: **Other**, Build Command để trống, Output Directory để trống).
3. Trong **Project Settings → Environment Variables**, khai báo 4 biến môi trường:
   - `SUPABASE_URL`: URL của project Supabase
   - `SUPABASE_SERVICE_ROLE_KEY`: Secret API Key (`sb_secret_...`) hoặc `service_role` key của Supabase *(chỉ dùng trên server)*
   - `ADMIN_PASSWORD`: Mật khẩu dùng chung cho người quản lý *(hoặc dùng `ADMIN_PASSWORD_HASH` theo định dạng `scrypt:<salt>:<hex>`)*
   - `ADMIN_SESSION_SECRET`: Chuỗi bí mật ngẫu nhiên tối thiểu 32 ký tự để ký session cookie
4. Nhấn **Deploy** (hoặc **Redeploy** sau khi lưu biến môi trường).

---

## 4. Chạy & kiểm thử ở máy cục bộ (Local Dev)

> Yêu cầu Node.js `>= 20` (không cần `npm install` thêm thư viện ngoài).

1. Sao chép `.env.example` thành `.env` (tùy chọn; nếu chưa cấu hình Supabase, server cục bộ tự lưu tạm vào `scripts/.local-db.json`):
   - Điền ít nhất `ADMIN_PASSWORD` và `ADMIN_SESSION_SECRET` để đăng nhập `/admin`.
   - Nếu muốn kết nối Supabase thật khi dev local, điền thêm `SUPABASE_URL` và `SUPABASE_SERVICE_ROLE_KEY`.
2. Khởi động máy chủ phát triển:
   ```bash
   npm run dev
   ```
3. Mở trình duyệt:
   - Trang người dùng: `http://127.0.0.1:3000/`
   - Khu vực quản lý: `http://127.0.0.1:3000/admin`
