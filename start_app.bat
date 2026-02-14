@echo off
setlocal
title Anti-AI Writer Launcher
echo ===================================================
echo     STARTING ANTI-AI WRITER ENV
echo ===================================================
echo.
echo [1/3] Navigating to project directory...
cd /d "%~dp0"

if not exist package.json (
    echo ERROR: package.json was not found in this folder.
    echo Make sure this script is inside the project root.
    pause
    exit /b 1
)

where npm >nul 2>&1
if errorlevel 1 (
    echo ERROR: npm is not available in PATH.
    echo Install Node.js, then reopen this terminal.
    pause
    exit /b 1
)

echo [2/3] Checking dependencies...
if not exist node_modules (
    echo node_modules not found. Installing dependencies...
    call npm install
    if errorlevel 1 (
        echo ERROR: npm install failed.
        pause
        exit /b 1
    )
) else (
    echo Dependencies already installed.
)

echo [3/3] Opening browser and starting development server...
echo.
echo Keep this window open while using the app.
echo.
start "" "http://localhost:5173"
call npm run dev
pause
