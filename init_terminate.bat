@echo off

REM Kill yarn start process
taskkill /IM "node.exe" /F

REM Kill uvicorn processes
taskkill /IM "uvicorn.exe" /F

echo All processes have been terminated.
