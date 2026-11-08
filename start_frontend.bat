@echo off
title AquaSearch - React Frontend (Port 5173)
echo ========================================================
echo Starting AquaSearch React + Vite Frontend on http://localhost:5173
echo ========================================================
set "PATH=C:\Users\nadar\AppData\Local\Programs\nodejs;%PATH%"
cd /d "%~dp0frontend"
npm run dev
pause

