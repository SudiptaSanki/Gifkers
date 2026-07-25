@echo off
setlocal enabledelayedexpansion

echo ===================================================
echo     Starting Gifkers Python Sticker Generator
echo ===================================================
echo.

:: 1. Check & Setup Backend Dependencies
cd /d "%~dp0backend"

if not exist ".venv" (
    echo [Backend] Virtual environment not found. Setting up .venv...
    python -m venv .venv
    call .venv\Scripts\activate
    echo [Backend] Installing Python dependencies...
    pip install -r requirements.txt
) else (
    echo [Backend] Dependencies already installed (.venv found). Skipping installation!
    call .venv\Scripts\activate
)

echo [Backend] Starting FastAPI Server on http://127.0.0.1:8000 ...
start "Gifkers Backend API" cmd /k "cd /d %~dp0backend && .venv\Scripts\activate && python -m uvicorn app.main:app --reload --port 8000"

:: 2. Check & Setup Frontend Dependencies
cd /d "%~dp0frontend"

if not exist "node_modules" (
    echo [Frontend] node_modules not found. Installing npm packages...
    call npm install
) else (
    echo [Frontend] Dependencies already installed (node_modules found). Skipping installation!
)

echo [Frontend] Starting React Development Server...
start "Gifkers Frontend React" cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo ===================================================
echo  Both Backend & Frontend servers are running!
echo ===================================================
echo  Your web application should open in your browser.
echo.
pause
