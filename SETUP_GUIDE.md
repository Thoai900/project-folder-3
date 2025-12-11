# 🚀 Hướng dẫn Hoàn chỉnh: AI Prompt Refiner System

## 📋 Tổng quan

Hệ thống gồm 2 phần chính:
1. **Backend API** (Vercel Serverless Functions) - Đã deploy
2. **Chrome Extension** - Cần cài đặt thủ công

---

## 🔧 PHẦN 1: Backend API (Đã hoàn thành ✅)

### Các endpoint đã tạo:

#### 1. `/api/refine-prompt` - Tinh chỉnh prompt
```javascript
POST https://your-domain.vercel.app/api/refine-prompt
Body: { "prompt": "your raw prompt" }
Response: { "original": "...", "refined": "..." }
```

#### 2. `/api/gemini` - Chat với AI
```javascript
POST /api/gemini
Body: { "prompt": "...", "temperature": 0.7 }
```

#### 3. `/api/image-scan` - Scan ảnh
```javascript
POST /api/image-scan
Body: { "imageBase64": "...", "mimeType": "image/jpeg", "action": "scan" }
```

#### 4. `/api/smart-generate` - Tạo prompt template
```javascript
POST /api/smart-generate
Body: { "idea": "your idea" }
```

### Push code lên Vercel:

```bash
git add -A
git commit -m "Add AI Prompt Refiner extension and API"
git push
```

Vercel sẽ tự động deploy trong 1-2 phút.

---

## 🎨 PHẦN 2: Chrome Extension

### Bước 1: Cập nhật API Domain

Mở file `extension/content.js` và thay đổi dòng:

```javascript
const API_ENDPOINT = 'https://project-folder-1.vercel.app/api/refine-prompt';
```

Thay `project-folder-1` bằng **domain Vercel thực tế** của bạn (kiểm tra tại Vercel Dashboard).

### Bước 2: Tạo Icons cho Extension

Extension cần các icon sau trong thư mục `extension/icons/`:
- `icon16.png` (16x16px)
- `icon32.png` (32x32px)
- `icon48.png` (48x48px)
- `icon128.png` (128x128px)

**Option 1**: Tự tạo bằng tool design (Figma, Canva)
**Option 2**: Download icon miễn phí từ [Flaticon](https://www.flaticon.com/) hoặc [Icons8](https://icons8.com/)

Gợi ý: Tìm icon "magic wand", "sparkles", "ai" hoặc "star"

### Bước 3: Load Extension vào Chrome

1. Mở Chrome
2. Vào `chrome://extensions/`
3. Bật **Developer mode** (toggle góc trên bên phải)
4. Click **Load unpacked**
5. Chọn thư mục `d:\project-folder (1)\extension`
6. Extension xuất hiện với tên "AI Prompt Refiner"

### Bước 4: Test Extension

1. Truy cập https://chat.openai.com hoặc https://gemini.google.com
2. Nút màu tím **"Tinh chỉnh"** sẽ xuất hiện góc dưới bên phải
3. Nhập một prompt vào textarea
4. Click nút "Tinh chỉnh" hoặc nhấn `Ctrl+Shift+R`
5. Prompt sẽ được tự động cải thiện

---

## 🎯 Cách sử dụng

### A. Tinh chỉnh Prompt trực tiếp

1. **Vào trang AI bất kỳ** (ChatGPT, Claude, Gemini...)
2. **Nhập prompt thô**:
   ```
   Giải thích React
   ```
3. **Click nút "Tinh chỉnh"**
4. **Prompt được cải thiện tự động**:
   ```
   Hãy đóng vai một Senior React Developer với 10 năm kinh nghiệm.
   Giải thích chi tiết về React, bao gồm:
   1. Khái niệm cơ bản và triết lý thiết kế
   2. Virtual DOM và cơ chế reconciliation
   3. Hooks và lifecycle
   4. Ví dụ thực tế với code snippet
   
   Giải thích theo cấu trúc dễ hiểu cho người mới bắt đầu.
   ```

### B. Sử dụng Prompt Templates

1. **Click icon extension** trên thanh toolbar Chrome
2. **Popup hiện ra** với danh sách prompt mẫu
3. **Lọc theo category**: Giáo dục, Lập trình, Marketing...
4. **Click vào prompt** để copy vào clipboard
5. **Paste vào trang AI** và sử dụng

---

## 📁 Cấu trúc Project hoàn chỉnh

```
d:\project-folder (1)/
├── api/                          # Vercel Serverless Functions
│   ├── gemini.js                 # Chat API
│   ├── image-scan.js             # Image processing
│   ├── smart-generate.js         # Smart generation
│   └── refine-prompt.js          # ⭐ Prompt refinement
│
├── extension/                    # Chrome Extension
│   ├── manifest.json             # Extension config
│   ├── popup.html                # Popup UI
│   ├── popup.js                  # Popup logic
│   ├── content.js                # ⭐ Main injection script
│   ├── content.css               # Styling
│   ├── background.js             # Service worker
│   ├── README.md                 # Extension docs
│   └── icons/                    # Icon files (cần tạo)
│       ├── icon16.png
│       ├── icon32.png
│       ├── icon48.png
│       └── icon128.png
│
├── js/
│   ├── app.js                    # Main web app
│   └── data.js                   # Prompt library
│
├── css/
├── images/
├── index.html
├── .env.example
├── .gitignore
└── README.md
```

---

## 🛠️ Troubleshooting

### 1. Nút "Tinh chỉnh" không xuất hiện

**Nguyên nhân**: Selector không khớp với textarea của trang AI

**Giải pháp**:
- Mở DevTools (F12) trên trang AI
- Inspect textarea element
- Copy selector chính xác
- Thêm vào mảng `TEXTAREA_SELECTORS` trong `content.js`

### 2. Lỗi "API key not found"

**Nguyên nhân**: Chưa set `GEMINI_API_KEY` trên Vercel

**Giải pháp**:
1. Vào Vercel Dashboard
2. Project Settings → Environment Variables
3. Thêm: `GEMINI_API_KEY` = your_key
4. Redeploy project

### 3. Lỗi CORS

**Nguyên nhân**: API không cho phép request từ extension

**Giải pháp**: Thêm headers trong serverless function:
```javascript
res.setHeader('Access-Control-Allow-Origin', '*');
res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
```

### 4. Extension không load

**Nguyên nhân**: Thiếu icon files hoặc manifest.json sai

**Giải pháp**:
- Tạo đầy đủ 4 icon files
- Kiểm tra syntax `manifest.json`
- Reload extension tại `chrome://extensions/`

---

## 🎨 Tùy chỉnh nâng cao

### Thay đổi màu sắc nút

Sửa trong `extension/content.css`:

```css
.ai-refiner-btn {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    /* Đổi thành màu khác */
}
```

### Thêm trang AI mới

Sửa trong `extension/manifest.json`:

```json
"matches": [
    "https://your-new-ai-site.com/*"
]
```

### Thay đổi prompt template trong popup

Sửa mảng `FEATURED_PROMPTS` trong `extension/popup.js`

---

## 📊 Workflow hoàn chỉnh

```
User nhập prompt thô
       ↓
Click nút "Tinh chỉnh" (hoặc Ctrl+Shift+R)
       ↓
Content Script lấy text từ textarea
       ↓
Gửi POST request đến /api/refine-prompt
       ↓
Vercel Serverless Function nhận request
       ↓
Gọi Google Gemini API với system instruction
       ↓
Gemini trả về prompt đã tinh chỉnh
       ↓
API response về extension
       ↓
Content Script thay thế text trong textarea
       ↓
User thấy prompt mới + animation highlight
```

---

## 🎉 Hoàn thành!

Bạn đã có:
✅ Backend API bảo mật với Vercel Serverless
✅ Chrome Extension inject vào mọi trang AI
✅ Tính năng Prompt Refiner hoạt động realtime
✅ Thư viện prompt templates có sẵn
✅ Keyboard shortcut (Ctrl+Shift+R)

**Next Steps:**
1. Tạo icons cho extension
2. Test trên nhiều trang AI khác nhau
3. Tùy chỉnh prompt templates theo nhu cầu
4. Publish lên Chrome Web Store (optional)

---

## 📞 Support

Nếu gặp vấn đề, kiểm tra:
1. Console log (F12) trên trang AI
2. Network tab để xem API calls
3. Vercel Dashboard để xem deployment logs
4. `chrome://extensions/` để xem extension errors

Good luck! 🚀
