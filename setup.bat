@echo off
echo Setting up TUT3-G6 Full Stack Application...
echo.

echo Creating Backend .env file...
if not exist "Backend\.env" (
    copy "Backend\env.template" "Backend\.env"
    echo Backend .env file created from template.
    echo Please edit Backend\.env with your actual values.
) else (
    echo Backend .env file already exists.
)

echo.
echo Creating Frontend .env file...
if not exist "Frontend\.env" (
    copy "Frontend\env.template" "Frontend\.env"
    echo Frontend .env file created from template.
    echo Please edit Frontend\.env with your actual values.
) else (
    echo Frontend .env file already exists.
)

echo.
echo Installing Backend dependencies...
cd Backend
call npm install
cd ..

echo.
echo Installing Frontend dependencies...
cd Frontend
call npm install
cd ..

echo.
echo Setup complete!
echo.
echo Next steps:
echo 1. Edit Backend\.env with your MongoDB URI, session secret, and SMTP credentials
echo 2. Edit Frontend\.env with your API URL (VITE_API_URL)
echo 3. Run 'npm run dev' in both Backend and Frontend directories
echo 4. Open http://localhost:5173 in your browser
echo.
pause
