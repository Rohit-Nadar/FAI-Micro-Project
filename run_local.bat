@echo off
title AquaSearch Launcher
echo ========================================================
echo Launching AquaSearch Application (Backend + Frontend)...
echo ========================================================

start "AquaSearch Backend" "%~dp0start_backend.bat"
timeout /t 2 >nul
start "AquaSearch Frontend" "%~dp0start_frontend.bat"

echo.
echo Both servers are launching!
echo Backend:  http://127.0.0.1:8000 (Swagger: /docs)
echo Frontend: http://localhost:5173
echo.

