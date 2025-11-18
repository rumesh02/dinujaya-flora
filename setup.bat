@echo off
echo ========================================
echo Setting up Dinujaya Flora Admin Dashboard
echo ========================================
echo.

echo Step 1: Installing Backend Dependencies...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install backend dependencies
    pause
    exit /b 1
)

echo.
echo Step 2: Installing Frontend Dependencies...
cd ..\frontend
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install frontend dependencies
    pause
    exit /b 1
)

echo.
echo Step 3: Seeding Database...
cd ..\backend
call node seed.js
if %errorlevel% neq 0 (
    echo WARNING: Failed to seed database. Make sure MongoDB is running.
    echo You can run 'node seed.js' manually later.
)

cd ..

echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo To start the application:
echo   - Run start.bat
echo   OR
echo   - Terminal 1: cd backend && npm start
echo   - Terminal 2: cd frontend && npm start
echo.
echo Default Login Credentials:
echo   Admin: admin@dinujayaflora.com / admin123
echo   User: user@test.com / user123
echo.
echo Press any key to exit...
pause > nul
