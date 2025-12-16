# 📋 Hướng dẫn Thiết lập Firebase Authentication

## 🎯 Tổng quan

Dự án hiện tại sử dụng Firebase Authentication để quản lý:
- ✅ Email/Password Sign-up & Sign-in
- ✅ Google OAuth 2.0
- ✅ Email Verification
- ✅ Password Reset

---

## 📋 Các bước Thiết lập Firebase Console

### **Bước 1: Truy cập Firebase Console**

1. Vào https://console.firebase.google.com/
2. Chọn project: **prompt-573fc**
3. Vào mục **Build** → **Authentication**

### **Bước 2: Cấu hình Email/Password Authentication**

1. Vào tab **Sign-in method**
2. Tìm provider **Email/Password**
3. Click **Edit** → Bật 2 tùy chọn:
   - ✅ **Email/Password** (for user sign-up)
   - ✅ **Email Link (Passwordless Sign-in)** (optional)
4. Click **Save**

### **Bước 3: Cấu hình Google OAuth**

1. Tìm provider **Google**
2. Click **Edit**
3. Bật **Google** toggle
4. Chọn **Project Support Email**: dropdown hiện có sẵn
5. Thêm Authorized domains:
   - `localhost` (for development)
   - `localhost:3000` (if using port 3000)
   - Domain thực của bạn (VD: `promptmaster.com`)
6. Click **Save**

### **Bước 4: Thiết lập OAuth Consent Screen (Google Project)**

Vì Google OAuth được khởi tạo từ Google Cloud Console:

1. Vào https://console.cloud.google.com/
2. Chọn project **prompt-573fc**
3. Vào **APIs & Services** → **OAuth consent screen**
4. Chọn **External** (cho phép ai cũng dùng)
5. Điền thông tin:
   - **App name**: PromptMaster
   - **User support email**: your-email@gmail.com
   - **Developer contact**: your-email@gmail.com
6. Click **Save and Continue**
7. Vào **Scopes** → Thêm:
   - `openid` (bắt buộc)
   - `email` (bắt buộc)
   - `profile` (bắt buộc)
8. Click **Save and Continue** → **Back to Dashboard**

### **Bước 5: Tạo OAuth 2.0 Client ID**

1. Vào **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **OAuth Client ID**
3. Chọn **Web application**
4. Thêm Authorized redirect URIs:
   ```
   https://prompt-573fc.firebaseapp.com/__/auth/handler
   http://localhost
   http://localhost:3000
   https://yourdomain.com
   ```
5. Click **Create**
6. Copy **Client ID** (không cần Secret cho web apps)
7. Có thể đóng dialog - Firebase sẽ tự setup

### **Bước 6: Thiết lập Email Verification**

1. Vào **Authentication** → **Templates**
2. Chọn **Email Verification**
3. Tùy chọn:
   - **Language**: Vietnamese (tìm trong dropdown)
   - **Sender name**: PromptMaster
   - **Subject**: "Xác minh email của bạn"
4. **Email body** - Sửa template (nếu cần):
   ```html
   Xin chào,

   Vui lòng xác minh địa chỉ email của bạn bằng cách nhấp vào liên kết bên dưới:

   %LINK%

   Liên kết sẽ hết hạn trong 24 giờ.

   Trân trọng,
   PromptMaster Team
   ```
5. Click **Save**

### **Bước 7: Thiết lập Password Reset Email**

1. Chọn **Password Reset**
2. Tùy chọn tương tự như Email Verification
3. **Subject**: "Đặt lại mật khẩu"
4. **Email body**:
   ```html
   Xin chào,

   Nhận được yêu cầu đặt lại mật khẩu. Nhấp vào liên kết để tạo mật khẩu mới:

   %LINK%

   Liên kết sẽ hết hạn trong 1 giờ.

   Nếu bạn không yêu cầu, hãy bỏ qua email này.

   Trân trọng,
   PromptMaster Team
   ```
5. Click **Save**

### **Bước 8: Thiết lập Realtime Database Rules**

1. Vào **Build** → **Realtime Database**
2. Click vào database **prompt-573fc-default-rtdb**
3. Vào tab **Rules**
4. Sao chép rules sau:

```json
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid",
        ".validate": "newData.hasChildren(['id', 'email', 'name'])"
      }
    },
    "learningSessions": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid"
      }
    },
    "publicUsers": {
      "$uid": {
        ".read": true,
        ".write": "$uid === auth.uid",
        ".validate": "newData.hasChildren(['id', 'email', 'name'])"
      }
    },
    "prompts": {
      ".read": true,
      ".write": false
    }
  }
}
```

5. Click **Publish**

---

## 🔑 Kiểm tra Cấu hình Hiện tại

### Firebase Config trong `index.html`:

```javascript
const firebaseConfig = {
    apiKey: "AIzaSyA5JfpN7Sk3tdCBDa7u5coDbjrwx7D2GV8",
    authDomain: "prompt-573fc.firebaseapp.com",
    databaseURL: "https://prompt-573fc-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "prompt-573fc",
    storageBucket: "prompt-573fc.appspot.com",
    messagingSenderId: "362695103484",
    appId: "1:362695103484:web:036d2d722e6754aeaed879",
    measurementId: "G-9X3DY739S9"
};
```

✅ **Config đã đúng** - Sao chép từ Firebase Console

---

## 🧪 Test Authentication

### **1. Test Email/Password Sign-up**

```javascript
// Từ console hoặc form
const result = await firebaseSignUp('test@example.com', 'password123', 'Test User');
// Kiểm tra: Email verification được gửi?
```

### **2. Test Email/Password Sign-in**

```javascript
const result = await firebaseLogin('test@example.com', 'password123');
// Kiểm tra: Email verified? Có login thành công không?
```

### **3. Test Google OAuth**

```javascript
const result = await firebaseLoginWithGoogle();
// Kiểm tra: Popup Google bật lên? Có login thành công không?
```

### **4. Kiểm tra User trong Firebase Console**

1. Vào **Authentication** → **Users**
2. Xem danh sách users đã tạo
3. Kiểm tra:
   - ✅ User ID (UID)
   - ✅ Email
   - ✅ Email Verified status
   - ✅ Sign-in providers (Google, Email/Password)

### **5. Kiểm tra Realtime Database**

1. Vào **Realtime Database**
2. Kiểm tra `/users/{uid}/` có data không?
3. Xem structure:
   ```json
   {
     "id": "user-uid",
     "email": "user@example.com",
     "name": "User Name",
     "avatar": null,
     "createdAt": "2024-12-14T...",
     "learningSessions": [],
     ...
   }
   ```

---

## 🐛 Troubleshooting

### **Vấn đề: Google Login Popup bị chặn**

**Giải pháp:**
1. Kiểm tra browser cho phép pop-up cho domain
2. Thêm domain vào **Authorized domains** trong Firebase Console
3. Kiểm tra DevTools (F12) → Console xem error gì

### **Vấn đề: Email Verification không gửi**

**Giải pháp:**
1. Kiểm tra template email đã cấu hình?
2. Xem spam folder (mails có thể vào spam)
3. Kiểm tra firebase auth config trong code

### **Vấn đề: User login thành công nhưng không appear trong UI**

**Giải pháp:**
1. Kiểm tra `watchAuthState()` callback có trigger không?
2. Xem console logs (F12) có error không?
3. Kiểm tra Realtime Database rules - user có permission không?

### **Vấn đề: "Invalid API Key"**

**Giải pháp:**
1. Regenerate API Key trong Firebase Console
2. Copy lại vào `firebaseConfig` trong `index.html`
3. Deploy lại

---

## ✅ Checklist Before Production

- [ ] Email/Password authentication enabled
- [ ] Google OAuth configured
- [ ] OAuth Consent Screen đã setup
- [ ] Email verification template tạo sẵn
- [ ] Password reset template tạo sẵn
- [ ] Realtime Database rules đã publish
- [ ] Domain authorization added (production domain)
- [ ] HTTPS enabled on all domains
- [ ] Test flow hoàn toàn (sign-up → verify email → sign-in)
- [ ] Google login tested
- [ ] Password reset tested

---

## 📱 Current Authentication Flow

```
User → Sign-up Form
↓
Firebase Auth + Email Verification
↓
Check Email Verified (in watchAuthState)
↓
Load User Data from Realtime DB
↓
State updated → UI renders
```

---

## 🔐 Security Best Practices

1. **Never expose private keys** - API Key được public OK (cho web), tapi keep Secret aman
2. **Use HTTPS only** - Firebase auto enforces
3. **Database Rules** - Implement tightly (user chỉ access own data)
4. **Email Verification** - Required cho email/password users
5. **Password Reset** - Flow validate via email
6. **Google OAuth** - Automatically verified email ✅

---

## 📞 Support

Nếu gặp issue:
1. Check Firebase Console → **Logs**
2. Check Browser Console (F12)
3. Check Network tab xem requests
4. Read Firebase docs: https://firebase.google.com/docs/auth
