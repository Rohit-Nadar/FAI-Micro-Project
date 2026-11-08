@echo off
title Push AquaSearch to GitHub
echo ========================================================
echo Pushing project to https://github.com/Rohit-Nadar/FAI-Micro-Project.git
echo ========================================================
echo.
cd /d "%~dp0"
git remote set-url origin https://github.com/Rohit-Nadar/FAI-Micro-Project.git
git branch -M main
echo If prompted, please click "Sign in with your browser" to authorize GitHub.
echo.
git push -u origin main
echo.
if %ERRORLEVEL% EQU 0 (
    echo ========================================================
    echo SUCCESS! Your project has been pushed to GitHub:
    echo https://github.com/Rohit-Nadar/FAI-Micro-Project
    echo ========================================================
) else (
    echo ========================================================
    echo Git push encountered an issue. Please check the message above.
    echo ========================================================
)
echo.
pause

