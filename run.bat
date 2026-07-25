@echo off
title Gifkers Launcher
color 0A

echo ===================================================
echo     Starting Gifkers Python Sticker Generator
echo ===================================================
echo.

pushd "%~dp0"

:: -------------------------------------------------------
:: 1. BACKEND
:: -------------------------------------------------------
echo [1/3] Checking Backend Python environment...
pushd backend

if exist ".venv\Scripts\activate.bat" goto check_packages

echo   - Creating Python virtual environment...
python -m venv .venv
if errorlevel 1 goto python_missing

:check_packages
if exist ".venv\Scripts\uvicorn.exe" goto start_backend

echo   - Installing Python dependencies...
call .venv\Scripts\activate.bat
pip install -r requirements.txt
goto start_backend

:python_missing
echo.
echo   ERROR: Python 3 is not found on your system.
echo   Please install Python 3.11+ from https://python.org
echo   Make sure to check "Add python.exe to PATH" during install.
echo.
pause
exit /b 1

:start_backend
echo   - Starting Backend on http://127.0.0.1:8000 ...
set "BACKEND_DIR=%CD%"
start "Gifkers-Backend" /MIN /D "%BACKEND_DIR%" cmd /k "call .venv\Scripts\activate.bat & python -m uvicorn app.main:app --reload --port 8000"
popd

timeout /t 3 /nobreak >nul

:: -------------------------------------------------------
:: 2. FRONTEND
:: -------------------------------------------------------
echo [2/3] Checking Frontend Node environment...
pushd frontend

if exist "node_modules\vite" goto start_frontend

echo   - Installing npm packages...
call npm install
if errorlevel 1 goto node_missing
goto start_frontend

:node_missing
echo.
echo   ERROR: Node.js is not found on your system.
echo   Please install Node.js 18+ from https://nodejs.org
echo.
pause
exit /b 1

:start_frontend
echo   - Starting Frontend on http://localhost:5173 ...
set "FRONTEND_DIR=%CD%"
start "Gifkers-Frontend" /MIN /D "%FRONTEND_DIR%" cmd /k "npm run dev"
popd

timeout /t 4 /nobreak >nul

:: -------------------------------------------------------
:: 3. OPEN BROWSER
:: -------------------------------------------------------
echo [3/3] Opening browser...
start http://localhost:5173

echo.
echo ===================================================
echo   Gifkers is running!
echo   App: http://localhost:5173
echo   Close the minimized server windows to stop.
echo ===================================================
echo.
pause
