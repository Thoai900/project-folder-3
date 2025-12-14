# 🚨 FIX LỖI: auth/unauthorized-continue-uri

## ❌ Lỗi bạn đang gặp:

```
FirebaseError: Firebase: Domain not allowlisted by project 
(auth/unauthorized-continue-uri).
```

**Domain Vercel của bạn:**
```
https://project-folder-3-c5jtupr6b-thoais-projects-ec3109c4.vercel.app
```

---

## ✅ GIẢI PHÁP - Làm theo 3 bước này:

### **Bước 1: Vào Firebase Console**

1. Mở: https://console.firebase.google.com/
2. Chọn project: **prompt-573fc**

### **Bước 2: Thêm Domain Vercel vào Authorized Domains**

1. Click vào **Build** (thanh bên trái)
2. Click **Authentication**
3. Click tab **Settings** (ở trên, bên cạnh "Sign-in method")
4. Kéo xuống phần **Authorized domains**

### **Bước 3: Add Domain**

1. Click nút **Add domain**
2. Nhập domain Vercel của bạn (KHÔNG CÓ https://):
   ```
   project-folder-3-c5jtupr6b-thoais-projects-ec3109c4.vercel.app
   ```
3. Click **Add**

### **Bước 4: Thêm Wildcard Domain (Recommended)**

Vercel tạo domain mới mỗi lần deploy, nên nên thêm wildcard:

1. Click **Add domain** lần nữa
2. Nhập pattern:
   ```
   *.vercel.app
   ```
3. Click **Add**

⚠️ **Lưu ý:** Firebase có thể không support wildcard cho email link. Trong trường hợp đó, bạn phải add từng domain cụ thể sau mỗi lần deploy Vercel.

---

## 🔧 Alternative Solution: Dùng Custom Domain

Nếu bạn có domain riêng (VD: `promptmaster.com`):

1. Setup custom domain trên Vercel
2. Add domain đó vào Firebase Authorized domains
3. Domain sẽ fixed, không đổi sau mỗi deploy

---

## 📋 Danh sách domains nên add:

Trong Firebase Console → Authentication → Settings → Authorized domains, đảm bảo có:

- ✅ `localhost` (cho development)
- ✅ `127.0.0.1` (cho development)
- ✅ `prompt-573fc.firebaseapp.com` (Firebase default)
- ✅ `project-folder-3-c5jtupr6b-thoais-projects-ec3109c4.vercel.app` (Vercel hiện tại)
- ✅ `*.vercel.app` (wildcard - nếu Firebase hỗ trợ)
- ✅ Custom domain của bạn (nếu có)

---

## 🧪 Test sau khi add domain:

1. **Reload trang Vercel**
2. Click **"Đăng nhập bằng Email Link"**
3. Nhập email → Click **Gửi**
4. Check console (F12):
   - ✅ Không còn error `auth/unauthorized-continue-uri`
   - ✅ Thấy log: "✅ Email link đã gửi thành công"
5. Check email inbox (và spam folder)

---

## ⚡ Quick Command để check domain hiện tại:

Mở Console (F12) → Console tab, paste:

```javascript
console.log('🌐 Current Domain:', window.location.origin);
console.log('📋 Add domain này vào Firebase:', window.location.hostname);
```

Copy domain từ console → Add vào Firebase Authorized domains

---

## 🔄 Nếu Vercel deploy lại (domain mới):

Vercel có thể tạo domain mới khi deploy:
```
project-folder-3-NEW_HASH.vercel.app
```

**Giải pháp:**

1. **Option 1: Add domain mới** vào Firebase mỗi lần deploy
2. **Option 2: Setup custom domain** trên Vercel (không đổi)
3. **Option 3: Use Vercel production domain** (`*.vercel.app` trong project settings)

---

## 📸 Screenshot hướng dẫn:

### Firebase Console → Authentication → Settings:
```
┌─────────────────────────────────────────────┐
│  Authorized domains                          │
│  ┌─────────────────────────────────────┐    │
│  │ localhost                            │    │
│  │ prompt-573fc.firebaseapp.com        │    │
│  │ project-folder-3-*.vercel.app  ← ADD │    │
│  └─────────────────────────────────────┘    │
│  [Add domain]                                │
└─────────────────────────────────────────────┘
```

---

## ✅ Sau khi fix xong:

Domain của bạn sẽ được authorize, và các tính năng sau sẽ hoạt động:

- ✅ Email Link Sign-in
- ✅ Email Verification
- ✅ Password Reset Email
- ✅ Google OAuth redirect

---

## 🆘 Vẫn gặp lỗi?

### **Lỗi khác có thể gặp:**

1. **auth/operation-not-allowed**
   - Fix: Bật "Email link (passwordless sign-in)" trong Sign-in method

2. **auth/invalid-api-key**
   - Fix: Check Firebase config trong `index.html`

3. **Domain added nhưng vẫn lỗi**
   - Fix: Đợi 1-2 phút để Firebase sync
   - Reload trang và thử lại

4. **Email không đến**
   - Fix: Check spam folder
   - Domain đã add nhưng email vẫn không gửi → Check Firebase quota

---

## 🎯 Next Steps sau khi fix:

1. ✅ Add domain vào Firebase
2. ✅ Test email link sign-in
3. ✅ Test email verification
4. ✅ Test Google OAuth
5. 🚀 Production ready!

---

## 📞 Need Help?

Nếu sau khi add domain vẫn lỗi:
1. Check Firebase Console logs
2. Check browser console (F12)
3. Verify domain được add chính xác (không có https://, không có trailing slash)
4. Clear cache và reload

---

**🔗 Firebase Console Link:**
https://console.firebase.google.com/project/prompt-573fc/authentication/settings

**📖 Firebase Docs:**
https://firebase.google.com/docs/auth/web/email-link-auth
