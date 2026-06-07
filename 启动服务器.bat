@echo off
chcp 65001 >nul
title 云端院史馆 · 数据服务器

echo.
echo  ╔══════════════════════════════════════════════════════╗
echo  ║      云端院史馆  数据服务器  v1.0                        ║
echo  ║      大理大学第一附属医院                               ║
echo  ╚══════════════════════════════════════════════════════╝
echo.

:: 切换到批处理所在目录（项目根目录）
cd /d "%~dp0"

:: ── 检查并释放 3000 端口 ──────────────────────────────────
echo  [1/3] 检查端口 3000 占用情况...
for /f "tokens=5" %%a in ('netstat -ano 2^>nul ^| findstr ":3000 " ^| findstr "LISTENING"') do (
    echo  [INFO] 结束旧进程 PID: %%a
    taskkill /PID %%a /F >nul 2>&1
)
timeout /t 1 >nul

:: ── 检查 Node.js ────────────────────────────────────────
echo  [2/3] 检查 Node.js 运行环境...
set NODE_EXE=node.exe
node.exe --version >nul 2>&1
if errorlevel 1 (
    :: 尝试 WorkBuddy 内置版本
    set NODE_EXE=C:\Users\Administrator\.workbuddy\binaries\node\versions\22.22.2\node.exe
    if not exist "%NODE_EXE%" (
        :: 尝试系统安装版本
        set NODE_EXE=C:\Program Files\nodejs\node.exe
        if not exist "%NODE_EXE%" (
            echo.
            echo  [错误] 未找到 Node.js，请先安装 Node.js！
            echo  下载地址: https://nodejs.org
            pause
            exit /b 1
        )
    )
)
for /f "delims=" %%v in ('"%NODE_EXE%" --version 2^>nul') do echo  [INFO] Node.js 版本: %%v

:: ── 检查依赖 ────────────────────────────────────────────
echo  [3/3] 检查 node_modules 依赖...
if not exist "node_modules\express\package.json" (
    echo  [INFO] 正在安装依赖，请稍候...
    "%NODE_EXE%" "%~dp0\node_modules\.bin\npm" install >nul 2>&1
    if errorlevel 1 (
        npm install
    )
)
echo  [INFO] 依赖检查完毕

echo.
echo  ──────────────────────────────────────────────────────
echo  [启动] 服务器启动中，请稍候...
echo  ──────────────────────────────────────────────────────
echo.

:: ── 稍等后打开浏览器 ────────────────────────────────────
:: 用 powershell 延迟打开，等服务器启动完成
start "" powershell -WindowStyle Hidden -Command "Start-Sleep -Seconds 2; Start-Process 'http://localhost:3000/admin/index.html'"

:: ── 启动服务器（前台运行，显示日志）────────────────────
"%NODE_EXE%" server.js

:: 服务器退出后提示
echo.
echo  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo  [提示] 服务器已停止。如需重启，请重新双击此文件。
echo  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
pause
