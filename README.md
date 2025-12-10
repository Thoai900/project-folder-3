# Hướng dẫn Deploy với Vercel Serverless Functions

## 🔐 Bảo mật API Key

Dự án này đã được refactor để sử dụng **Vercel Serverless Functions**, bảo vệ API key của Google Gemini khỏi việc bị lộ trên client-side.

## 📁 Cấu trúc thư mục

```
project/
├── api/                          # Serverless Functions
│   ├── gemini.js                 # Chat với AI
│   ├── image-scan.js             # Scan ảnh và tinh chỉnh text
│   └── smart-generate.js         # Tạo prompt thông minh
├── css/
├── images/
├── js/
│   ├── app.js                    # Frontend logic
│   └── data.js                   # Dữ liệu prompts
├── .env.example                  # Template cho biến môi trường
├── .gitignore                    # Ignore .env file
├── index.html
├── manifest.json
├── service-worker.js
└── vercel.json                   # Cấu hình Vercel
```

## 🚀 Hướng dẫn Deploy lên Vercel

### 1. Chuẩn bị

- Tạo tài khoản miễn phí tại [vercel.com](https://vercel.com)
- Cài đặt [Vercel CLI](https://vercel.com/docs/cli) (tùy chọn)
- Lấy API key của Google Gemini tại [Google AI Studio](https://makersuite.google.com/app/apikey)

### 2. Deploy từ GitHub (Khuyến nghị)

1. Push code lên GitHub repository
2. Truy cập [vercel.com/new](https://vercel.com/new)
3. Import repository của bạn
4. Trong phần **Environment Variables**, thêm:
   ```
   GEMINI_API_KEY=your_actual_api_key_here
   ```
5. Click **Deploy**

### 3. Deploy bằng Vercel CLI

```bash
# Cài đặt Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Thêm environment variable
vercel env add GEMINI_API_KEY
```

Khi được hỏi, nhập API key của bạn và chọn môi trường (Production/Preview/Development).

### 4. Deploy thủ công qua Dashboard

1. Đăng nhập vào [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click **Add New... → Project**
3. Kéo thả thư mục dự án vào
4. Thêm **Environment Variable**: `GEMINI_API_KEY`
5. Click **Deploy**

## ⚙️ Cấu hình Environment Variables

### Trên Vercel Dashboard:
1. Mở project → **Settings** → **Environment Variables**
2. Thêm biến:
   - **Key**: `GEMINI_API_KEY`
   - **Value**: Your API key
   - **Environment**: Production (hoặc tất cả)

### Local Development:
1. Copy file `.env.example` thành `.env`:
   ```bash
   cp .env.example .env
   ```
2. Mở `.env` và điền API key:
   ```
   GEMINI_API_KEY=your_actual_api_key_here
   ```
3. Chạy local dev server với Vercel CLI:
   ```bash
   vercel dev
   ```

## 🔧 API Endpoints

### 1. `/api/gemini` - Chat với AI
**Request:**
```json
{
  "prompt": "Viết cho tôi một bài thơ",
  "temperature": 0.7
}
```

### 2. `/api/image-scan` - Scan ảnh/Tinh chỉnh text
**Request (Scan):**
```json
{
  "imageBase64": "base64_encoded_image",
  "mimeType": "image/jpeg",
  "action": "scan"
}
```

**Request (Refine):**
```json
{
  "action": "refine",
  "currentText": "text cần tinh chỉnh",
  "imageBase64": "",
  "mimeType": ""
}
```

### 3. `/api/smart-generate` - Tạo prompt từ ý tưởng
**Request:**
```json
{
  "idea": "Tạo prompt về phân tích văn học"
}
```

## 🛡️ Bảo mật

- ✅ API key được lưu trong biến môi trường trên server
- ✅ Client không bao giờ thấy được API key
- ✅ `.env` file được ignore trong `.gitignore`
- ✅ Chỉ `.env.example` (không chứa key thật) được commit

## 📝 Thay đổi so với phiên bản cũ

### Trước (Không bảo mật):
```javascript
// js/data.js
const GEMINI_API_KEY = "AIzaSy..."; // ❌ Key bị lộ

// js/app.js
const url = `https://generativelanguage.googleapis.com/.../key=${GEMINI_API_KEY}`;
```

### Sau (Bảo mật):
```javascript
// api/gemini.js
const apiKey = process.env.GEMINI_API_KEY; // ✅ Key ở server

// js/app.js
const url = '/api/gemini'; // ✅ Gọi internal endpoint
```

## ❓ Troubleshooting

### Lỗi "API key not found"
- Kiểm tra đã thêm `GEMINI_API_KEY` trong Vercel Environment Variables chưa
- Redeploy lại project sau khi thêm biến môi trường

### Lỗi CORS
- Serverless functions tự động xử lý CORS
- Nếu vẫn lỗi, kiểm tra `vercel.json` config

### Local development không hoạt động
- Đảm bảo đã tạo file `.env` và điền API key
- Sử dụng `vercel dev` thay vì các local server khác

## 📚 Tài liệu tham khảo

- [Vercel Serverless Functions](https://vercel.com/docs/functions)
- [Google Gemini API](https://ai.google.dev/docs)
- [Environment Variables on Vercel](https://vercel.com/docs/environment-variables)

## 🎉 Hoàn thành!

Sau khi deploy thành công, ứng dụng của bạn sẽ:
- Chạy với domain `.vercel.app`
- API key được bảo mật hoàn toàn
- Tự động scale theo nhu cầu
- Miễn phí với Vercel Hobby plan
