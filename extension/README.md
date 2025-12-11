# AI Prompt Refiner - Chrome Extension

## 📦 Cài đặt Extension

### Cách 1: Load Unpacked (Developer Mode)

1. Mở Chrome và truy cập `chrome://extensions/`
2. Bật **Developer mode** (góc trên bên phải)
3. Click **Load unpacked**
4. Chọn thư mục `extension/` trong project này
5. Extension sẽ xuất hiện trong danh sách

### Cách 2: Build và cài đặt từ file .crx (Production)

```bash
# Đóng gói extension
cd extension
zip -r ai-prompt-refiner.zip *
```

Sau đó upload lên Chrome Web Store hoặc cài đặt thủ công.

## 🚀 Sử dụng

### 1. Tích hợp vào trang AI

Extension tự động inject nút **"Tinh chỉnh"** vào các trang:
- ChatGPT (chat.openai.com)
- Claude (claude.ai)
- Google Gemini (gemini.google.com)
- Microsoft Copilot (copilot.microsoft.com)

### 2. Tinh chỉnh Prompt

**Cách 1**: Click nút "Tinh chỉnh"
- Nhập prompt vào textarea
- Click nút màu tím bên phải màn hình
- Chờ AI xử lý (2-5 giây)
- Prompt được tự động thay thế

**Cách 2**: Phím tắt
- Nhập prompt
- Nhấn `Ctrl+Shift+R`
- Prompt tự động được tinh chỉnh

### 3. Thư viện Prompt Templates

- Click icon extension trên toolbar
- Popup hiện thị các prompt mẫu
- Click vào prompt để copy vào clipboard
- Paste vào trang AI

## 🔧 Cấu hình API Endpoint

Mở file `extension/content.js` và thay đổi:

```javascript
const API_ENDPOINT = 'https://YOUR_DOMAIN.vercel.app/api/refine-prompt';
```

Thay `YOUR_DOMAIN` bằng domain Vercel thực tế của bạn.

## 📂 Cấu trúc thư mục

```
extension/
├── manifest.json          # Extension configuration
├── popup.html            # Popup UI
├── popup.js              # Popup logic
├── content.js            # Script inject vào trang AI
├── content.css           # Styles cho nút refine
├── background.js         # Service worker
└── icons/                # Extension icons
    ├── icon16.png
    ├── icon32.png
    ├── icon48.png
    └── icon128.png
```

## 🎨 Tùy chỉnh

### Thay đổi vị trí nút

Chỉnh sửa trong `content.css`:

```css
.ai-refiner-btn {
    bottom: 100px;  /* Thay đổi vị trí */
    right: 20px;
}
```

### Thêm trang AI mới

Thêm vào `manifest.json`:

```json
"matches": [
    "https://your-ai-site.com/*"
]
```

## ❓ Troubleshooting

### Extension không xuất hiện
- Kiểm tra Developer Mode đã bật chưa
- Reload extension tại `chrome://extensions/`

### Nút không xuất hiện trên trang AI
- Kiểm tra selector trong `content.js`
- Mở Console (F12) xem log

### Lỗi API
- Kiểm tra `API_ENDPOINT` đúng chưa
- Kiểm tra CORS settings trên Vercel
- Xem Network tab trong DevTools

## 📝 License

MIT License - Free to use and modify
