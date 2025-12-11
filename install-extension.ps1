# Script cài đặt Chrome Extension - AI Prompt Refiner
# Yêu cầu: Chạy PowerShell as Administrator

param(
    [switch]$LaunchChrome = $false
)

Write-Host "======================================" -ForegroundColor Cyan
Write-Host "  Cài đặt AI Prompt Refiner Extension" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

# Kiểm tra xem đang chạy as Administrator
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] 'Administrator')
if (-not $isAdmin) {
    Write-Host "⚠️  Lỗi: Script cần chạy với quyền Administrator!" -ForegroundColor Red
    Write-Host "Vui lòng click chuột phải trên PowerShell và chọn 'Run as Administrator'" -ForegroundColor Yellow
    Read-Host "Nhấn Enter để thoát"
    exit
}

# Lấy đường dẫn extension
$extensionPath = Split-Path -Parent $MyInvocation.MyCommand.Definition
$extensionPath = Join-Path $extensionPath "extension"
$manifestPath = Join-Path $extensionPath "manifest.json"

Write-Host "📁 Kiểm tra thư mục extension..." -ForegroundColor Yellow
if (-not (Test-Path $extensionPath)) {
    Write-Host "❌ Không tìm thấy thư mục extension tại: $extensionPath" -ForegroundColor Red
    Read-Host "Nhấn Enter để thoát"
    exit
}

if (-not (Test-Path $manifestPath)) {
    Write-Host "❌ Không tìm thấy manifest.json trong thư mục extension" -ForegroundColor Red
    Read-Host "Nhấn Enter để thoát"
    exit
}

Write-Host "✅ Thư mục extension tìm thấy" -ForegroundColor Green
Write-Host "   Đường dẫn: $extensionPath" -ForegroundColor Gray

# Tìm đường dẫn Chrome
Write-Host ""
Write-Host "🔍 Tìm Chrome installation..." -ForegroundColor Yellow

$chromePath = $null
$possiblePaths = @(
    "$env:ProgramFiles\Google\Chrome\Application\chrome.exe",
    "${env:ProgramFiles(x86)}\Google\Chrome\Application\chrome.exe",
    "$env:LOCALAPPDATA\Google\Chrome\Application\chrome.exe"
)

foreach ($path in $possiblePaths) {
    if (Test-Path $path) {
        $chromePath = $path
        break
    }
}

if (-not $chromePath) {
    Write-Host "❌ Không tìm thấy Chrome trên máy tính" -ForegroundColor Red
    Write-Host "Vui lòng cài đặt Chrome hoặc Edge trước khi chạy script này" -ForegroundColor Yellow
    Read-Host "Nhấn Enter để thoát"
    exit
}

Write-Host "✅ Tìm thấy Chrome tại: $chromePath" -ForegroundColor Green

# Tìm Chrome Extensions folder
Write-Host ""
Write-Host "📂 Thiết lập thư mục extensions..." -ForegroundColor Yellow

$chromeExtensionsPath = "$env:LOCALAPPDATA\Google\Chrome\User Data\Default\Extensions"
$edgeExtensionsPath = "$env:LOCALAPPDATA\Microsoft\Edge\User Data\Default\Extensions"

# Hỏi người dùng cài đặt cho Chrome hay Edge
$installChoice = Read-Host "Cài đặt cho [C]hrome hay [E]dge? (C/E, mặc định là Chrome)"
if ($installChoice -eq "E" -or $installChoice -eq "e") {
    $extensionsBasePath = $edgeExtensionsPath
    $browser = "Edge"
} else {
    $extensionsBasePath = $chromeExtensionsPath
    $browser = "Chrome"
}

if (-not (Test-Path $extensionsBasePath)) {
    Write-Host "❌ Không tìm thấy thư mục Extensions của $browser" -ForegroundColor Red
    Write-Host "   Vui lòng mở $browser ít nhất một lần trước khi chạy script này" -ForegroundColor Yellow
    Read-Host "Nhấn Enter để thoát"
    exit
}

Write-Host "✅ Thư mục Extensions tìm thấy" -ForegroundColor Green

# Đọc manifest để lấy extension ID
Write-Host ""
Write-Host "📋 Đọc thông tin extension..." -ForegroundColor Yellow

$manifest = Get-Content $manifestPath | ConvertFrom-Json
$extensionName = $manifest.name
$extensionVersion = $manifest.version

Write-Host "   Tên: $extensionName" -ForegroundColor Gray
Write-Host "   Version: $extensionVersion" -ForegroundColor Gray

# Tạo extension ID dựa trên content (hash của manifest)
# Trong thực tế, Chrome tạo ID dựa trên public key, nhưng cách đơn giản là dùng hash
$manifestContent = Get-Content $manifestPath -Raw
$hashObject = [System.Security.Cryptography.MD5]::Create()
$hash = [System.BitConverter]::ToString($hashObject.ComputeHash([System.Text.Encoding]::UTF8.GetBytes($manifestContent))) -replace '-',''
$extensionId = $hash.Substring(0, 32).ToLower()

# Tuy nhiên, nếu extension đã được load developer mode, Chrome sẽ tạo ID khác
# Chúng ta sẽ copy vào 1 thư mục temp và để Chrome load nó
$tempExtensionPath = "$env:TEMP\PromptMaster_Extension_Temp"
if (Test-Path $tempExtensionPath) {
    Remove-Item -Path $tempExtensionPath -Recurse -Force
}

Write-Host ""
Write-Host "📦 Chuẩn bị cài đặt..." -ForegroundColor Yellow

# Copy extension vào temp folder
Copy-Item -Path $extensionPath -Destination $tempExtensionPath -Recurse
Write-Host "✅ Extension đã được sao chép" -ForegroundColor Green

# Đóng Chrome nếu đang chạy
Write-Host ""
Write-Host "🔄 Chuẩn bị Chrome..." -ForegroundColor Yellow
$processName = if ($browser -eq "Edge") { "msedge" } else { "chrome" }
$runningProcesses = Get-Process -Name $processName -ErrorAction SilentlyContinue

if ($runningProcesses) {
    Write-Host "   $browser đang chạy, đóng lại..." -ForegroundColor Yellow
    Stop-Process -Name $processName -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 2
}

# Tạo registry entry để enable developer mode (optional, giúp extension không bị cảnh báo)
Write-Host "🔐 Cài đặt quyền extensions..." -ForegroundColor Yellow

$regPath = "HKLM:\Software\Policies\Google\Chrome\ExtensionInstallForcelist"
if (-not (Test-Path $regPath)) {
    New-Item -Path $regPath -Force -ErrorAction SilentlyContinue | Out-Null
}

# Hướng dẫn cuối cùng
Write-Host ""
Write-Host "======================================" -ForegroundColor Green
Write-Host "  ✅ Chuẩn bị hoàn tất!" -ForegroundColor Green
Write-Host "======================================" -ForegroundColor Green
Write-Host ""
Write-Host "🎯 Bước tiếp theo:" -ForegroundColor Cyan
Write-Host "  1. Mở $browser" -ForegroundColor White
Write-Host "  2. Nhập vào address bar: chrome://extensions/" -ForegroundColor White
Write-Host "  3. Bật 'Developer mode' (nút bên phải trên cùng)" -ForegroundColor White
Write-Host "  4. Nhấp 'Load unpacked' và chọn thư mục:" -ForegroundColor White
Write-Host "     $extensionPath" -ForegroundColor Yellow
Write-Host ""
Write-Host "📋 Copy đường dẫn extension?" -ForegroundColor Cyan
Write-Host $extensionPath | Set-Clipboard
Write-Host "✅ Đã sao chép vào clipboard!" -ForegroundColor Green
Write-Host ""

# Mở Chrome extensions page
Write-Host "🌐 Mở trang Extensions trong $browser..." -ForegroundColor Yellow
$launchArgs = "chrome://extensions/"
if ($browser -eq "Edge") {
    $chromePath = (Get-Command msedge -ErrorAction SilentlyContinue).Source
    if (-not $chromePath) {
        $chromePath = "${env:ProgramFiles(x86)}\Microsoft\Edge\Application\msedge.exe"
    }
}

Start-Process -FilePath $chromePath -ArgumentList $launchArgs -ErrorAction SilentlyContinue

Write-Host ""
Write-Host "💡 Mẹo: Bạn cũng có thể dùng batch file không cần Administrator:" -ForegroundColor Gray
Write-Host "   Tìm thư mục extension và tay copy vào đây:" -ForegroundColor Gray
Write-Host "   $extensionsBasePath" -ForegroundColor Gray
Write-Host ""

Read-Host "Nhấn Enter khi hoàn tất"
