# 🔍 Debug: Email không gửi được

## ⚠️ Vấn đề thường gặp

### **1. Email Link Sign-in chưa được bật trên Firebase**

#### **Triệu chứng:**
- Click "Gửi Email Link" → Error: `auth/operation-not-allowed`
- Console log: "operation-not-allowed"

#### **Giải pháp:**
1. Vào https://console.firebase.google.com/
2. Chọn project **prompt-573fc**
3. **Build → Authentication → Sign-in method**
4. Tìm **Email/Password** provider
5. Click **Edit** (icon bút chì)
6. ✅ Bật **Email/Password** 
7. ✅ Bật **Email link (passwordless sign-in)** ← **BẮT BUỘC**
8. Click **Save**

---

### **2. Domain chưa được authorize**

#### **Triệu chứng:**
- Error: `auth/unauthorized-domain` hoặc `auth/invalid-continue-uri`
- Console: "Domain ... is not authorized"

#### **Giải pháp:**
1. Vào **Authentication → Settings → Authorized domains**
2. Thêm các domain sau:
   ```
   localhost
   127.0.0.1
   prompt-573fc.firebaseapp.com
   <your-production-domain.com>
   ```
3. Click **Add domain** nếu thiếu

---

### **3. Email bị chặn hoặc vào Spam**

#### **Triệu chứng:**
- Code chạy OK, không có error
- Nhưng không thấy email trong inbox

#### **Giải pháp:**
1. **Kiểm tra Spam folder** - 90% trường hợp email ở đây
2. **Kiểm tra Promotions/Updates tab** (Gmail)
3. **Whitelist email Firebase:**
   - `noreply@<project-id>.firebaseapp.com`
   - Thêm vào danh sách liên hệ
4. **Đợi 2-5 phút** - Email có thể đến muộn
5. **Thử email khác** - Một số email provider chặn Firebase

---

### **4. Quá nhiều request (Rate limiting)**

#### **Triệu chứng:**
- Error: `auth/too-many-requests`
- Console: "We have blocked all requests from this device"

#### **Giải pháp:**
1. **Đợi 15-30 phút** trước khi thử lại
2. **Xóa cookies + localStorage:**
   ```javascript
   localStorage.clear();
   ```
3. **Restart browser**
4. **Thử incognito mode**
5. **Thử IP/device khác**

---

### **5. Firebase Config sai**

#### **Triệu chứng:**
- Error: `auth/invalid-api-key`
- Firebase không khởi tạo được

#### **Giải pháp:**
1. Vào Firebase Console → **Project Settings** (icon gear)
2. Scroll xuống **Your apps** → Web app
3. Copy lại config:
   ```javascript
   const firebaseConfig = {
       apiKey: "...",
       authDomain: "...",
       databaseURL: "...",
       projectId: "...",
       ...
   };
   ```
4. Paste vào `index.html` (thay thế config cũ)

---

## 🧪 Test Step-by-Step

### **Test 1: Kiểm tra Firebase đã init chưa**

Mở Console (F12) → Console tab:

```javascript
// Test Firebase Auth
console.log('Firebase Auth:', window.firebaseAuth);
console.log('Send Email Link Function:', window.firebaseSendSignInLinkToEmail);

// Kết quả mong đợi:
// ✅ Firebase Auth: AuthImpl {...}
// ✅ Send Email Link Function: ƒ sendSignInLinkToEmail()
```

**Nếu undefined** → Firebase chưa load → Reload trang

---

### **Test 2: Gửi Email Link thủ công**

```javascript
// Từ console
const email = 'your-email@gmail.com';
const actionCodeSettings = {
    url: window.location.origin,
    handleCodeInApp: true
};

window.firebaseSendSignInLinkToEmail(window.firebaseAuth, email, actionCodeSettings)
    .then(() => {
        console.log('✅ Email link đã gửi');
        localStorage.setItem('emailForSignIn', email);
    })
    .catch(error => {
        console.error('❌ Error:', error.code, error.message);
    });
```

**Xem error code trong console** → Đối chiếu với các case trên

---

### **Test 3: Kiểm tra Authorized Domains**

```javascript
// Kiểm tra domain hiện tại
console.log('Current domain:', window.location.origin);
console.log('Current URL:', window.location.href);

// Domain phải có trong Firebase Console → Authorized domains
```

Vào Firebase Console → **Authentication → Settings → Authorized domains**
→ Tìm domain của bạn → Nếu không có thì **Add domain**

---

### **Test 4: Gửi Email Verification (Email/Password)**

```javascript
// Sau khi sign up bằng email/password
const user = window.firebaseAuth.currentUser;
if (user && !user.emailVerified) {
    window.firebaseSendEmailVerification(user)
        .then(() => console.log('✅ Email verification sent'))
        .catch(err => console.error('❌ Error:', err));
}
```

---

## 📋 Checklist Debug

- [ ] **Firebase Console:**
  - [ ] Email/Password provider enabled
  - [ ] Email link (passwordless sign-in) enabled
  - [ ] Domain added to Authorized domains
  
- [ ] **Code:**
  - [ ] Firebase initialized (`window.firebaseAuth` exists)
  - [ ] `sendSignInLinkToEmail` function imported
  - [ ] ActionCodeSettings correct (`handleCodeInApp: true`)
  
- [ ] **Email:**
  - [ ] Checked Spam folder
  - [ ] Checked Promotions/Updates tab
  - [ ] Waited 2-5 minutes
  - [ ] Tried different email provider (Gmail, Outlook, etc.)
  
- [ ] **Browser:**
  - [ ] Console shows no errors (F12)
  - [ ] LocalStorage enabled (not in private mode blocking storage)
  - [ ] No rate limiting (not too many requests)

---

## 🆘 Still Not Working?

### **1. Check Firebase Status**
https://status.firebase.google.com/
→ Xem có incident nào không

### **2. Enable Debug Mode**

Thêm vào console:
```javascript
// Set Firebase debug mode
localStorage.setItem('debug', 'firebase:*');
// Reload page
location.reload();
```

### **3. Test với Email khác**

Một số email provider chặn Firebase:
- ✅ Gmail - Thường OK
- ✅ Outlook/Hotmail - Thường OK
- ⚠️ Yahoo - Đôi khi chặn
- ⚠️ Email tên miền riêng - Tùy thuộc spam filter

### **4. Check Network Tab**

F12 → Network tab → Filter: XHR
→ Tìm request tới `identitytoolkit.googleapis.com`
→ Xem response (200 OK = thành công, 400/403 = error)

### **5. Firebase Support**

Nếu vẫn không được:
1. Vào https://firebase.google.com/support
2. Tạo support ticket
3. Cung cấp:
   - Project ID: `prompt-573fc`
   - Error code
   - Console logs
   - Network request/response

---

## ✅ Quick Fix Commands

### Xóa cache và reset:
```javascript
// Trong console (F12)
localStorage.clear();
location.reload();
```

### Test email function:
```javascript
sendEmailLinkSignIn('test@example.com')
    .then(result => console.log('Result:', result))
    .catch(err => console.error('Error:', err));
```

### Check auth state:
```javascript
console.log('Current User:', window.firebaseAuth.currentUser);
console.log('Email verified:', window.firebaseAuth.currentUser?.emailVerified);
```

---

## 📞 Error Code Reference

| Error Code | Ý nghĩa | Giải pháp |
|------------|---------|-----------|
| `auth/operation-not-allowed` | Email link chưa bật | Bật trong Firebase Console |
| `auth/unauthorized-domain` | Domain chưa authorize | Add domain vào Authorized domains |
| `auth/invalid-continue-uri` | URL không hợp lệ | Kiểm tra ActionCodeSettings |
| `auth/invalid-email` | Email sai format | Kiểm tra email format |
| `auth/too-many-requests` | Quá nhiều request | Đợi 15-30 phút |
| `auth/network-request-failed` | Lỗi mạng | Kiểm tra internet |

---

## 🎯 Expected Flow

```
1. User nhập email → Click "Gửi"
         ↓
2. sendEmailLinkSignIn(email) được gọi
         ↓
3. Firebase gửi request tới server
         ↓
4. Server gửi email (noreply@...)
         ↓
5. Email đến inbox (hoặc spam) sau 30s-5 phút
         ↓
6. User click link trong email
         ↓
7. App kiểm tra isSignInWithEmailLink
         ↓
8. completeEmailLinkSignIn(email) được gọi
         ↓
9. ✅ User signed in!
```

**Kiểm tra từng bước để tìm lỗi ở đâu.**
