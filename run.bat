@echo off
title Gifkers - Python Sticker Generator

echo.
echo ===================================================
echo     Starting Gifkers Python Sticker Generator
echo ===================================================
echo.

:: Use the directory where this bat file lives
pushd "%~dp0"

:: -------------------------------------------------------
:: 1. Backend Setup
:: -------------------------------------------------------
echo [Backend] Checking dependencies...
pushd backend

if not exist ".venv\Scripts\activate.bat" (
    echo [Backend] Creating virtual environment...
    python -m venv .venv
    if errorlevel 1 (
        echo [ERROR] Python not found! Install Python 3.11+ from https://python.org
        pause
        exit /b 1
    )
    echo [Backend] Installing Python dependencies - first time only...
    call .venv\Scripts\activate.bat
    pip install -r requirements.txt
    echo [Backend] Installation complete!
) else (
    echo [Backend] Dependencies already installed. Skipping.
)

echo [Backend] Launching FastAPI server on http://127.0.0.1:8000 ...
set "BACKEND_DIR=%CD%"
start "Gifkers-Backend" /D "%BACKEND_DIR%" cmd /k "call .venv\Scripts\activate.bat & python -m uvicorn app.main:app --reload --port 8000"

popd

:: Give backend a moment to boot
timeout /t 3 /nobreak >nul

:: -------------------------------------------------------
:: 2. Frontend Setup
:: -------------------------------------------------------
echo [Frontend] Checking dependencies...
pushd frontend

if not exist "node_modules" (
    echo [Frontend] Installing npm packages - first time only...
    call npm install
    if errorlevel 1 (
        echo [ERROR] Node.js not found! Install Node 18+ from https://nodejs.org
        pause
        exit /b 1
    )
    echo [Frontend] Installation complete!
) else (
    echo [Frontend] Dependencies already installed. Skipping.
)

echo [Frontend] Launching React dev server...
set "FRONTEND_DIR=%CD%"
start "Gifkers-Frontend" /D "%FRONTEND_DIR%" cmd /k "npm run dev"

popd

echo.
echo ===================================================
echo   Both servers are starting!
echo   Backend  : http://127.0.0.1:8000
echo   Frontend : http://localhost:5173
echo ===================================================
echo.
echo   Press any key to close this launcher window.
echo   (The servers keep running in their own windows.)
echo.
pause >nul
