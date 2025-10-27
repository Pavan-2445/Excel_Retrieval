@echo off
echo ========================================
echo   Excel Finder - Starting Backend
echo ========================================
echo.

cd backend

echo Checking Python installation...
python --version
if errorlevel 1 (
    echo ERROR: Python is not installed!
    pause
    exit /b 1
)

echo.
echo Starting Flask server...
echo Backend will be available at http://localhost:5000
echo.
echo Press Ctrl+C to stop the server
echo.

python app.py

pause
