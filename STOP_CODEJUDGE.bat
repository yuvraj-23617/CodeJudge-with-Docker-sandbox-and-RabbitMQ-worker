@echo off
echo ============================================================
echo  CodeJudge - Shutdown
echo ============================================================
echo.

docker info >nul 2>nul
if %errorlevel% neq 0 (
    echo [INFO] Docker is not running. Nothing to stop.
    echo.
    pause
    exit /b 0
)

echo [INFO] Stopping CodeJudge services...
docker compose down

if %errorlevel% equ 0 (
    echo.
    echo ============================================================
    echo  ✅ CodeJudge stopped successfully!
    echo ============================================================
) else (
    echo.
    echo [ERROR] Could not stop services properly.
    echo.
    echo Try manually with:
    echo   docker compose down
    echo.
    echo Or if containers are stuck, try:
    echo   docker compose down --remove-orphans
    echo.
)

echo.
pause