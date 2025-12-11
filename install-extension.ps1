# AI Prompt Refiner Extension - Cài đặt tự động
# 
# Cách chạy:
# Option 1: Right-click file -> Run with PowerShell ISE (Recommended)
# Option 2: Mở PowerShell tại thư mục này gõ: .\install-extension.ps1

Write-Host ""
Write-Host "======================================" -ForegroundColor Cyan
Write-Host "  Cài đặt AI Prompt Refiner Extension" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Starting installation..." -ForegroundColor Gray
Write-Host ""

# Pause để người dùng thấy script đang chạy
Start-Sleep -Seconds 1

# Lấy đường dẫn script folder
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
if ([string]::IsNullOrWhiteSpace($scriptPath)) {
    $scriptPath = Get-Location
}

Write-Host "📁 Kiểm tra thư mục extension..." -ForegroundColor Yellow
Write-Host "   Thư mục: $scriptPath" -ForegroundColor Gray

$extensionPath = Join-Path $scriptPath "extension"
$manifestPath = Join-Path $extensionPath "manifest.json"

if (-not (Test-Path $extensionPath)) {
    Write-Host "❌ Không tìm thấy thư mục extension!" -ForegroundColor Red
    Write-Host "   Kiểm tra: $extensionPath" -ForegroundColor Red
    Write-Host ""
    Read-Host "Nhấn Enter để thoát"
    exit 1
}

if (-not (Test-Path $manifestPath)) {
    Write-Host "❌ Không tìm thấy manifest.json!" -ForegroundColor Red
    Write-Host ""
    Read-Host "Nhấn Enter để thoát"
    exit 1
}

Write-Host "✓ Thư mục extension tìm thấy" -ForegroundColor Green
Write-Host ""

# Tìm Chrome/Edge
Write-Host "🔍 Tìm Chrome/Edge..." -ForegroundColor Yellow

$chromePath = $null
$browserType = $null

$paths = @(
    @{ Path = "$env:ProgramFiles\Google\Chrome\Application\chrome.exe"; Type = "Chrome" },
    @{ Path = "$env:ProgramFiles(x86)\Google\Chrome\Application\chrome.exe"; Type = "Chrome" },
    @{ Path = "$env:LOCALAPPDATA\Google\Chrome\Application\chrome.exe"; Type = "Chrome" },
    @{ Path = "$env:ProgramFiles\Microsoft\Edge\Application\msedge.exe"; Type = "Edge" },
    @{ Path = "$env:ProgramFiles(x86)\Microsoft\Edge\Application\msedge.exe"; Type = "Edge" },
    @{ Path = "$env:LOCALAPPDATA\Microsoft\Edge\Application\msedge.exe"; Type = "Edge" }
)

foreach ($item in $paths) {
    if (Test-Path $item.Path) {
        $chromePath = $item.Path
        $browserType = $item.Type
        break
    }
}

if (-not $chromePath) {
    Write-Host "❌ Không tìm thấy Chrome hoặc Edge!" -ForegroundColor Red
    Write-Host "Vui lòng cài đặt Chrome hoặc Edge trước" -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Nhấn Enter để thoát"
    exit 1
}

Write-Host "✓ Tìm thấy $browserType" -ForegroundColor Green
Write-Host ""

# Tìm extensions folder
Write-Host "📂 Tìm Extensions folder..." -ForegroundColor Yellow

if ($browserType -eq "Edge") {
    $extensionsPath = "$env:LOCALAPPDATA\Microsoft\Edge\User Data\Default\Extensions"
} else {
    $extensionsPath = "$env:LOCALAPPDATA\Google\Chrome\User Data\Default\Extensions"
}

if (-not (Test-Path $extensionsPath)) {
    Write-Host "   Tạo Extensions folder..." -ForegroundColor Gray
    New-Item -ItemType Directory -Path $extensionsPath -Force | Out-Null
}

Write-Host "✓ Extensions folder: $extensionsPath" -ForegroundColor Green
Write-Host ""

# Copy extension
Write-Host "📦 Copy extension files..." -ForegroundColor Yellow

$destPath = Join-Path $extensionsPath "ai-prompt-refiner"

if (Test-Path $destPath) {
    Write-Host "   Xóa version cũ..." -ForegroundColor Gray
    Remove-Item -Path $destPath -Recurse -Force -ErrorAction SilentlyContinue
    Start-Sleep -Milliseconds 500
}

try {
    Write-Host "   Copy files..." -ForegroundColor Gray
    Copy-Item -Path $extensionPath -Destination $destPath -Recurse -Force -ErrorAction Stop
    Write-Host "✓ Copy thành công!" -ForegroundColor Green
} catch {
    Write-Host "❌ Lỗi khi copy: $_" -ForegroundColor Red
    Write-Host ""
    Read-Host "Nhấn Enter để thoát"
    exit 1
}

Write-Host ""

# Mở browser
Write-Host "🌐 Mở $browserType Extensions page..." -ForegroundColor Yellow
Write-Host ""

try {
    Start-Process -FilePath $chromePath -ArgumentList "chrome://extensions/" -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 2
} catch {
    Write-Host "⚠️  Không thể mở browser tự động" -ForegroundColor Yellow
    Write-Host "Vui lòng mở thủ công: chrome://extensions/" -ForegroundColor White
}

Write-Host "======================================" -ForegroundColor Green
Write-Host "   ✓ Cài đặt thành công!" -ForegroundColor Green
Write-Host "======================================" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Bước tiếp theo:" -ForegroundColor Cyan
Write-Host "   1. Tìm 'AI Prompt Refiner' trong danh sách Extensions" -ForegroundColor White
Write-Host "   2. Kiểm tra nó đã bật (toggled) chưa" -ForegroundColor White
Write-Host "   3. Ghé ChatGPT, Gemini hoặc Claude để sử dụng!" -ForegroundColor White
Write-Host ""
Write-Host "💡 Nếu không thấy tiện ích:" -ForegroundColor Yellow
Write-Host "   - Reload trang Extensions (F5)" -ForegroundColor White
Write-Host "   - Hoặc đóng và mở lại browser" -ForegroundColor White
Write-Host ""

Read-Host "Nhấn Enter để đóng cửa sổ này"
