@echo off
title AquaSearch - FastAPI Backend (Port 8000)
echo ========================================================
echo Starting AquaSearch FastAPI Backend on http://127.0.0.1:8000
echo Swagger UI docs available at: http://127.0.0.1:8000/docs
echo ========================================================
cd /d "%~dp0backend"
"C:\Users\nadar\AppData\Local\Programs\Python\Python312\Scripts\uvicorn.exe" app.main:app --host 127.0.0.1 --port 8000 --reload
pause

