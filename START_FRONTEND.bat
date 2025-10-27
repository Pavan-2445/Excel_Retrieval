@echo off
echo ========================================
echo   Excel Finder - Starting Frontend
echo ========================================
echo.

echo Checking Node.js installation...
node --version
if errorlevel 1 (
    echo ERROR: Node.js is not installed!
    pause
    exit /b 1
)

echo.
echo Starting Vite development server...
echo Frontend will be available at http://localhost:5173
echo.
echo Press Ctrl+C to stop the server
echo.

npm run dev

pause
