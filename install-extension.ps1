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

Write-Host "📁 Checking for extension folder..." -ForegroundColor Yellow
Write-Host "   Script location: $scriptPath" -ForegroundColor Gray

$extensionPath = Join-Path $scriptPath "extension"
$manifestPath = Join-Path $extensionPath "manifest.json"

# Nếu không tìm thấy extension folder, download từ GitHub
if (-not (Test-Path $extensionPath)) {
    Write-Host "❌ Extension folder not found" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "📥 Downloading from GitHub..." -ForegroundColor Cyan
    
    $tempZip = Join-Path $env:TEMP "promptmaster-extension.zip"
    $tempFolder = Join-Path $env:TEMP "promptmaster-temp"
    
    try {
        # Download from GitHub
        $downloadUrl = "https://github.com/Thoai900/project-folder--1-/archive/refs/heads/main.zip"
        Write-Host "   Downloading: $downloadUrl" -ForegroundColor Gray
        
        # Tạo WebClient
        $webClient = New-Object System.Net.WebClient
        $webClient.DownloadFile($downloadUrl, $tempZip)
        
        Write-Host "✓ Download complete" -ForegroundColor Green
        
        # Extract zip
        Write-Host "   Extracting files..." -ForegroundColor Gray
        if (Test-Path $tempFolder) {
            Remove-Item $tempFolder -Recurse -Force
        }
        Expand-Archive -Path $tempZip -DestinationPath $tempFolder -Force
        
        # Copy extension folder
        $sourceExtension = Get-ChildItem -Path $tempFolder -Filter "extension" -Recurse | Select-Object -First 1
        if ($sourceExtension) {
            Copy-Item -Path $sourceExtension.FullName -Destination $extensionPath -Recurse -Force
            Write-Host "✓ Extension folder copied" -ForegroundColor Green
        } else {
            throw "Could not find extension folder in download"
        }
        
        # Cleanup
        Remove-Item $tempZip -Force -ErrorAction SilentlyContinue
        Remove-Item $tempFolder -Recurse -Force -ErrorAction SilentlyContinue
        
    } catch {
        Write-Host "❌ Failed to download: $_" -ForegroundColor Red
        Write-Host ""
        Write-Host "📋 Alternative: Download manually from" -ForegroundColor Yellow
        Write-Host "   https://github.com/Thoai900/project-folder--1-/archive/refs/heads/main.zip" -ForegroundColor White
        Write-Host ""
        Write-Host "   Then extract and run this script again" -ForegroundColor Gray
        Write-Host ""
        Read-Host "Press Enter to exit"
        exit 1
    }
}

Write-Host "✓ Extension folder found" -ForegroundColor Green
Write-Host "   Path: $extensionPath" -ForegroundColor Gray
Write-Host ""

# Verify manifest.json exists
if (-not (Test-Path $manifestPath)) {
    Write-Host "❌ manifest.json not found in extension folder!" -ForegroundColor Red
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
}

# Tìm Chrome/Edge
Write-Host "🔍 Finding Chrome/Edge..." -ForegroundColor Yellow

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
    Write-Host "❌ Chrome or Edge not found!" -ForegroundColor Red
    Write-Host "Please install Chrome or Edge first" -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "✓ Found: $browserType" -ForegroundColor Green
Write-Host ""

# Tìm extensions folder
Write-Host "📂 Finding Extensions folder..." -ForegroundColor Yellow

if ($browserType -eq "Edge") {
    $extensionsPath = "$env:LOCALAPPDATA\Microsoft\Edge\User Data\Default\Extensions"
} else {
    $extensionsPath = "$env:LOCALAPPDATA\Google\Chrome\User Data\Default\Extensions"
}

if (-not (Test-Path $extensionsPath)) {
    Write-Host "   Creating Extensions folder..." -ForegroundColor Gray
    New-Item -ItemType Directory -Path $extensionsPath -Force | Out-Null
}

Write-Host "✓ Extensions folder: $extensionsPath" -ForegroundColor Green
Write-Host ""

# Copy extension
Write-Host "📦 Installing extension..." -ForegroundColor Yellow

$destPath = Join-Path $extensionsPath "ai-prompt-refiner"

if (Test-Path $destPath) {
    Write-Host "   Removing old version..." -ForegroundColor Gray
    Remove-Item -Path $destPath -Recurse -Force -ErrorAction SilentlyContinue
    Start-Sleep -Milliseconds 500
}

try {
    Write-Host "   Copying files..." -ForegroundColor Gray
    Copy-Item -Path $extensionPath -Destination $destPath -Recurse -Force -ErrorAction Stop
    Write-Host "✓ Installation successful!" -ForegroundColor Green
    Write-Host "   Location: $destPath" -ForegroundColor Gray
} catch {
    Write-Host "❌ Installation failed: $_" -ForegroundColor Red
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""

# Mở browser
Write-Host "🌐 Opening $browserType..." -ForegroundColor Yellow

try {
    Start-Process -FilePath $chromePath -ArgumentList "chrome://extensions/" -ErrorAction SilentlyContinue
    Write-Host "✓ Opening chrome://extensions/ in your browser" -ForegroundColor Green
    Start-Sleep -Seconds 2
} catch {
    Write-Host "⚠️  Could not open browser automatically" -ForegroundColor Yellow
    Write-Host "Please open manually: chrome://extensions/" -ForegroundColor White
}

Write-Host ""
Write-Host "======================================" -ForegroundColor Green
Write-Host "   ✓ Installation Complete!" -ForegroundColor Green
Write-Host "======================================" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next Steps:" -ForegroundColor Cyan
Write-Host "   1. Look for 'AI Prompt Refiner' in the Extensions list" -ForegroundColor White
Write-Host "   2. Make sure it's ENABLED (toggle should be ON)" -ForegroundColor White
Write-Host "   3. Visit ChatGPT, Gemini, or Claude to use it!" -ForegroundColor White
Write-Host ""
Write-Host "💡 Troubleshooting:" -ForegroundColor Yellow
Write-Host "   - If you don't see the extension, refresh the page (F5)" -ForegroundColor White
Write-Host "   - Close and reopen your browser completely" -ForegroundColor White
Write-Host "   - Run this script again" -ForegroundColor White
Write-Host ""

Read-Host "Press Enter to close this window"

