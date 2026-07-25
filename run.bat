@echo off
title Gifkers Launcher
color 0A

echo ===================================================
echo     Starting Gifkers Python Sticker Generator
echo ===================================================
echo.

pushd "%~dp0"

:: 1. Backend Setup
echo [1/3] Starting Backend Server...
pushd backend

if not exist ".venv\Scripts\activate.bat" (
    echo   - First time setup: Creating Python virtual environment...
    python -m venv .venv
    if errorlevel 1 (
        echo   [ERROR] Python is not installed or not in PATH!
        echo   Please install Python 3.11+ from https://python.org and ensure you check "Add python.exe to PATH" during installation.
        pause
        exit /b 1
    )
    echo   - Installing Python dependencies (this takes a minute)...
    call .venv\Scripts\activate.bat
    pip install -r requirements.txt
)

set "BACKEND_DIR=%CD%"
start "Gifkers Backend Server (DO NOT CLOSE)" /MIN /D "%BACKEND_DIR%" cmd /k "call .venv\Scripts\activate.bat & python -m uvicorn app.main:app --reload --port 8000"
popd

:: Wait a moment for backend to initialize
timeout /t 3 /nobreak >nul

:: 2. Frontend Setup
echo [2/3] Starting Frontend Server...
pushd frontend

if not exist "node_modules" (
    echo   - First time setup: Installing Node.js dependencies (this takes a minute)...
    call npm install
    if errorlevel 1 (
        echo   [ERROR] Node.js is not installed or not in PATH!
        echo   Please install Node.js from https://nodejs.org
        pause
        exit /b 1
    )
)

set "FRONTEND_DIR=%CD%"
start "Gifkers Frontend Server (DO NOT CLOSE)" /MIN /D "%FRONTEND_DIR%" cmd /k "npm run dev"
popd

:: Wait a moment for frontend to initialize
timeout /t 4 /nobreak >nul

:: 3. Open Browser
echo [3/3] Opening browser...
start http://localhost:5173

echo.
echo ===================================================
echo   Gifkers is now running!
echo   
echo   - The app should open automatically in your browser.
echo   - If it doesn't, manually go to: http://localhost:5173
echo   - To stop the app, just close the minimized terminal windows.
echo ===================================================
echo.
pause
