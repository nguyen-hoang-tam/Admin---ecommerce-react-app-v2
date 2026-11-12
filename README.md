# Ecommerce Admin Portal

Dự án Quản trị (Admin) độc lập xây dựng bằng **Vite + React + Ant Design + Redux Toolkit + React Router v6**, kết nối chung Firebase Firestore & Auth với dự án Client.

---

## 🚀 Hướng dẫn bắt đầu

### 1. Cài đặt Dependencies
```bash
npm install
```

### 2. Thiết lập Biến Môi trường (.env)
Tạo hoặc chỉnh sửa file `.env` ở thư mục gốc (dùng chung cấu hình Firebase với dự án Client):

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 3. Phân quyền ADMIN trong Firestore
Trong Firestore collection `users`, tài khoản quản trị phải có field `role: "ADMIN"`:
```json
// users/{uid}
{
  "email": "admin@example.com",
  "displayName": "Administrator",
  "role": "ADMIN"
}
```
> Nếu tài khoản có `role !== 'ADMIN'`, hệ thống sẽ từ chối đăng nhập và tự động `signOut`.

### 4. Khởi chạy ứng dụng
```bash
npm run dev
```
Ứng dụng sẽ chạy tại: [http://localhost:3000](http://localhost:3000)

---

## 📁 Cấu trúc thư mục

```text
ecommerce-admin/
├── .env.example
├── .env
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── index.css
    ├── store/
    │   └── index.js                    # Redux store tích hợp authSlice
    ├── lib/
    │   └── firebase.js                 # Khởi tạo Firebase SDK (Auth, Firestore)
    ├── features/
    │   └── auth/
    │       ├── authSlice.js            # Redux auth state (authSuccess, setProfile, authLogout)
    │       └── authAPI.js              # loginAPI, getUserProfile, logoutAPI
    ├── components/
    │   └── layout/
    │       └── AdminLayout.jsx         # Giao diện Admin với Antd Sider & Header
    ├── pages/
    │   ├── Login/
    │   │   └── index.jsx               # Form đăng nhập Antd + kiểm tra role ADMIN
    │   ├── Dashboard/
    │   │   └── index.jsx               # Trang thống kê doanh thu, đơn hàng
    │   └── Orders/
    │       └── index.jsx               # Quản lý danh sách đơn hàng
    └── router/
        ├── index.jsx                   # Cấu hình React Router v6
        └── ProtectedRoute.jsx          # Route Guard kiểm tra isAuthenticated & role ADMIN
```

---

## 🛡️ Luồng xác thực & Phân quyền

1. **Đăng nhập (`/login`)**:
   - Nhập email & mật khẩu qua Ant Design Form.
   - Gọi `loginAPI(email, password)` lấy `uid` & `token`.
   - Gọi `getUserProfile(uid)` lấy thông tin từ collection `users`.
   - **Nếu `role !== 'ADMIN'`**: Báo lỗi `"Từ chối truy cập: Yêu cầu quyền ADMIN!"` và gọi `signOut(auth)`.
   - **Nếu `role === 'ADMIN'`**: Dispatch `authSuccess` và `setProfile` lên Redux store, điều hướng vào `/admin/dashboard`.
2. **Bảo vệ Route (`ProtectedRoute`)**:
   - Kiểm tra `isAuthenticated && profile?.role === 'ADMIN'`.
   - Nếu không thỏa mãn, chuyển hướng về `/login`.

