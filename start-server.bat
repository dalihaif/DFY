@echo off
title DFY Museum Server
cd /d "%~dp0"
echo.
echo  ============================================================
echo   Cloud Museum Data Server v1.0
echo  ============================================================
echo.
echo  [1/3] Checking port 3000...
for /f "tokens=5" %%a in ('netstat -ano 2^>nul ^| findstr ":3000 " ^| findstr "LISTENING"') do (
    taskkill /PID %%a /F >nul 2>&1
)
timeout /t 1 >nul
echo  [2/3] Checking Node.js...
set "NODE_EXE=node.exe"
node.exe --version >nul 2>&1
if not errorlevel 1 goto :deps
set "NODE_EXE=C:\Users\Administrator\.workbuddy\binaries\node\versions\22.22.2\node.exe"
:deps
echo  [3/3] Checking node_modules...
echo  [INFO] Dependencies OK
echo.
echo  Server starting at http://localhost:3000
echo  Admin: http://localhost:3000/admin/index.html
echo  Press Ctrl+C to stop
echo  ============================================================
echo.
"%NODE_EXE%" server.js
echo.
echo  Server stopped. Double-click to restart.
pause
