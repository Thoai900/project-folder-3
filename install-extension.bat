@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo.
echo ======================================
echo   Cài đặt AI Prompt Refiner Extension
echo ======================================
echo.

:: Kiểm tra Administrator
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️  Lỗi: Script cần quyền Administrator!
    echo.
    echo Vui lòng right-click file này và chọn "Run as Administrator"
    echo.
    pause
    exit /b 1
)

echo ✓ Chạy với quyền Administrator
echo.

:: Lấy đường dẫn script folder
cd /d "%~dp0"
set "extensionPath=%cd%\extension"
set "manifestPath=%extensionPath%\manifest.json"

echo 📁 Kiểm tra thư mục extension...
if not exist "%extensionPath%" (
    echo ❌ Không tìm thấy thư mục extension!
    echo    Kiểm tra: %extensionPath%
    echo.
    pause
    exit /b 1
)

if not exist "%manifestPath%" (
    echo ❌ Không tìm thấy manifest.json!
    echo.
    pause
    exit /b 1
)

echo ✓ Tìm thấy extension tại: %extensionPath%
echo.

:: Tìm Chrome
echo 🔍 Tìm Chrome installation...
set "chromePath="

if exist "%ProgramFiles%\Google\Chrome\Application\chrome.exe" (
    set "chromePath=%ProgramFiles%\Google\Chrome\Application\chrome.exe"
    set "browserType=Chrome"
) else if exist "%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe" (
    set "chromePath=%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe"
    set "browserType=Chrome"
) else if exist "%LocalAppData%\Google\Chrome\Application\chrome.exe" (
    set "chromePath=%LocalAppData%\Google\Chrome\Application\chrome.exe"
    set "browserType=Chrome"
) else if exist "%ProgramFiles%\Microsoft\Edge\Application\msedge.exe" (
    set "chromePath=%ProgramFiles%\Microsoft\Edge\Application\msedge.exe"
    set "browserType=Edge"
) else if exist "%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe" (
    set "chromePath=%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe"
    set "browserType=Edge"
) else if exist "%LocalAppData%\Microsoft\Edge\Application\msedge.exe" (
    set "chromePath=%LocalAppData%\Microsoft\Edge\Application\msedge.exe"
    set "browserType=Edge"
)

if not defined chromePath (
    echo ❌ Không tìm thấy Chrome hoặc Edge!
    echo.
    pause
    exit /b 1
)

echo ✓ Tìm thấy %browserType% tại: %chromePath%
echo.

:: Tìm extensions folder
echo 📂 Tìm thư mục extensions...
set "extensionsPath=%LocalAppData%\Google\Chrome\User Data\Default\Extensions"

if %browserType%==Edge (
    set "extensionsPath=%LocalAppData%\Microsoft\Edge\User Data\Default\Extensions"
)

if not exist "%extensionsPath%" (
    echo ⚠️  Tạo thư mục extensions...
    mkdir "%extensionsPath%"
)

echo ✓ Extensions folder: %extensionsPath%
echo.

:: Copy extension
echo 📦 Copy extension files...
set "destPath=%extensionsPath%\ai-prompt-refiner"

if exist "%destPath%" (
    echo   Xóa version cũ...
    rmdir /s /q "%destPath%"
)

echo   Copy files...
xcopy "%extensionPath%" "%destPath%" /E /I /Y >nul

if %errorlevel% neq 0 (
    echo ❌ Lỗi khi copy files!
    echo.
    pause
    exit /b 1
)

echo ✓ Copy thành công!
echo.

:: Mở Chrome Extensions page
echo 🌐 Mở Chrome Extensions page...
echo.
start "" "%chromePath%" "chrome://extensions/"

echo.
echo ======================================
echo   ✓ Cài đặt thành công!
echo ======================================
echo.
echo 📋 Bước tiếp theo:
echo   1. Bạn sẽ thấy trang Extensions mở ra
echo   2. Tìm "AI Prompt Refiner" trong danh sách
echo   3. Kiểm tra xem nó đã bật (enabled) hay chưa
echo.
echo 💡 Nếu bạn không thấy extension:
echo   - Reload trang (F5)
echo   - Hoặc đóng Chrome và chạy lại script này
echo.
pause
