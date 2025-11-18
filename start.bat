@echo off
echo ========================================
echo Dinujaya Flora Admin Dashboard
echo ========================================
echo.

echo Checking if MongoDB is running...
echo.

echo Starting Backend Server...
start cmd /k "cd backend && npm start"

timeout /t 3 /nobreak > nul

echo.
echo Starting Frontend Server...
start cmd /k "cd frontend && npm start"

echo.
echo ========================================
echo Servers are starting...
echo ========================================
echo.
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Admin Login:
echo   Email: admin@dinujayaflora.com
echo   Password: admin123
echo.
echo User Login:
echo   Email: user@test.com
echo   Password: user123
echo.
echo Press any key to exit...
pause > nul
