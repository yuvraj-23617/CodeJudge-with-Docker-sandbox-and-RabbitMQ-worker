@echo off
setlocal enabledelayedexpansion

echo ============================================================
echo  CodeJudge - One-Click Startup
echo ============================================================
echo.

:: 1. Check if Docker is installed
where docker >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Docker is not installed or not in PATH.
    echo.
    echo Please install Docker Desktop from:
    echo https://www.docker.com/products/docker-desktop/
    echo.
    pause
    exit /b 1
)

:: 2. Check if Docker daemon is running
docker info >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Docker daemon is not running.
    echo.
    echo Please start Docker Desktop and wait for it to be ready.
    echo You should see the Docker whale icon in your system tray.
    echo.
    pause
    exit /b 1
)

:: 3. Check if ports are available
echo [INFO] Checking if ports 8080 and 8081 are available...
netstat -ano | findstr :8080 >nul
if %errorlevel% equ 0 (
    echo [WARNING] Port 8080 is already in use.
    echo Please close the application using port 8080 and try again.
    echo.
    pause
    exit /b 1
)

netstat -ano | findstr :8081 >nul
if %errorlevel% equ 0 (
    echo [WARNING] Port 8081 is already in use.
    echo Please close the application using port 8081 and try again.
    echo.
    pause
    exit /b 1
)

:: 4. Build and start all services
echo [INFO] Building and starting services...
echo This may take 3-5 minutes on the first run.
echo.
docker compose up -d --build

if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Failed to start Docker Compose.
    echo.
    echo To see detailed logs, run:
    echo   docker compose logs
    echo.
    pause
    exit /b 1
)

:: 5. Wait for backend to be healthy
echo.
echo [INFO] Waiting for backend to become healthy...

set MAX_RETRIES=60
set RETRY_COUNT=0

:wait_loop
set /a RETRY_COUNT+=1

if !RETRY_COUNT! geq %MAX_RETRIES% (
    echo.
    echo [ERROR] Backend did not become healthy within %MAX_RETRIES% attempts.
    echo.
    echo Please check the logs with:
    echo   docker compose logs backend
    echo.
    pause
    exit /b 1
)

docker compose exec -T backend nc -z localhost 8080 >nul 2>nul

if %errorlevel% equ 0 (
    echo [SUCCESS] Backend is healthy!
    goto open_browser
)

if !RETRY_COUNT! leq 5 (
    echo Waiting... !RETRY_COUNT!/%MAX_RETRIES%
) else if !RETRY_COUNT! equ 10 (
    echo Still waiting... this may take a moment
) else if !RETRY_COUNT! equ 20 (
    echo Taking longer than expected... please be patient
) else if !RETRY_COUNT! equ 40 (
    echo Almost there... building may still be in progress
)

timeout /t 2 /nobreak >nul
goto wait_loop

:open_browser
echo.
echo [INFO] Opening browser...
start http://localhost:8081

echo.
echo ============================================================
echo  ✅ CodeJudge is now running!
echo ============================================================
echo.
echo  📍 Frontend:  http://localhost:8081
echo  📍 Backend:   http://localhost:8080
echo  📍 RabbitMQ:  http://localhost:15672
echo     (username: %RABBITMQ_USER%, password: %RABBITMQ_PASSWORD%)
echo.
echo  💡 Instructions:
echo    1. Register a new user account
echo    2. Browse available problems
echo    3. Submit your solutions
echo.
echo  🛑 To stop CodeJudge, double-click STOP_CODEJUDGE.bat
echo.
echo ============================================================
pause