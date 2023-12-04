@echo off
SETLOCAL ENABLEDELAYEDEXPANSION

REM Starting yarn in the frontend directory
cd frontend
start cmd /k "yarn start"
cd ..

REM Starting uvicorn for genapi
cd genapi
start cmd /k "uvicorn api.main:app --reload"
cd ..

REM Starting uvicorn for storage
cd storage
start cmd /k "uvicorn api.main:app --port 8080 --reload"
cd ..

ENDLOCAL
