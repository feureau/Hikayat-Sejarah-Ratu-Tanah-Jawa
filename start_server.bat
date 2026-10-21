@echo off
echo ====================================================
echo Starting Local Web Server for Manuscript Viewer
echo ====================================================
echo.
echo The website will be available at: http://localhost:8000
echo Press Ctrl+C to stop the server.
echo.
python -m http.server 8000
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ====================================================
    echo [ALERT] ERROR: Could not start web server on port 8000!
    echo Port 8000 is already in use by another server or application.
    echo Please close the existing process on port 8000 and try again.
    echo ====================================================
    echo.
)
pause
