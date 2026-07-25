@echo off
title Gifkers Launcher
color 0A

echo ===================================================
echo     Starting Gifkers Python Sticker Generator
echo ===================================================
echo.

pushd "%~dp0"

:: 1. Backend Setup
echo [1/3] Checking Backend Python environment...
pushd backend

if not exist ".venv\Scripts\activate.bat" (
    echo   - Creating Python virtual environment (.venv)...
    python -m venv .venv
    if errorlevel 1 (
        echo   [ERROR] Python 3 is not installed or not in PATH!
        echo   Please install Python 3.11+ from https://python.org and check "Add python.exe to PATH".
        pause
        exit /b 1
    )
)

if exist ".venv\Scripts\uvicorn.exe" goto backend_ready

echo   - Installing required Python packages (FastAPI, Pillow, Matplotlib, etc.)...
call .venv\Scripts\activate.bat
pip install -r requirements.txt

:backend_ready
echo   - Launching Backend Server on http://127.0.0.1:8000 ...
set "BACKEND_DIR=%CD%"
start "Gifkers Backend Server (DO NOT CLOSE)" /MIN /D "%BACKEND_DIR%" cmd /k "call .venv\Scripts\activate.bat & python -m uvicorn app.main:app --reload --port 8000"
popd

:: Wait a moment for backend to initialize
timeout /t 3 /nobreak >nul

:: 2. Frontend Setup
echo [2/3] Checking Frontend Node environment...
pushd frontend

if exist "node_modules\vite" goto frontend_ready

echo   - Installing Frontend npm packages...
call npm install
if errorlevel 1 (
    echo   [ERROR] Node.js is not installed or not in PATH!
    echo   Please install Node 18+ from https://nodejs.org
    pause
    exit /b 1
)

:frontend_ready
echo   - Launching Frontend Server on http://localhost:5173 ...
set "FRONTEND_DIR=%CD%"
start "Gifkers Frontend Server (DO NOT CLOSE)" /MIN /D "%FRONTEND_DIR%" cmd /k "npm run dev"
popd

:: Wait a moment for frontend to initialize
timeout /t 3 /nobreak >nul

:: 3. Open Browser
echo [3/3] Opening application in browser...
start http://localhost:5173

echo.
echo ===================================================
echo   Gifkers is now running!
echo   
echo   - Web app: http://localhost:5173
echo   - To stop the servers, close the minimized terminal windows.
echo ===================================================
echo.
pause
