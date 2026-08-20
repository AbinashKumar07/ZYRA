@echo off
title ZYRA Master Startup

echo Cleaning up old background processes...
FOR /F "tokens=5" %%T IN ('netstat -a -n -o ^| findstr :3000') DO TaskKill.exe /PID %%T /F 2>NUL

echo Starting the Backend...
start "ZYRA Backend" cmd /k "cd backend && .\venv\Scripts\activate && uvicorn server:app --reload"

echo Starting the Frontend...
start "ZYRA Frontend" cmd /k "cd frontend && npm start"

exit