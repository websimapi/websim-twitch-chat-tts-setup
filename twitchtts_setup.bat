@echo off
echo Installing Twitch TTS System...

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
  echo Node.js is not installed. Please install Node.js from https://nodejs.org/
  pause
  exit /b
)

REM Create directory for the application
mkdir "%USERPROFILE%\TwitchTTS"
cd "%USERPROFILE%\TwitchTTS"

REM Download application files from GitHub (you would need to host these files)
echo Downloading application files...
powershell -Command "& {Invoke-WebRequest -Uri 'YOUR_REPO_URL/server.js' -OutFile 'server.js'}"
powershell -Command "& {Invoke-WebRequest -Uri 'YOUR_REPO_URL/package.json' -OutFile 'package.json'}"
powershell -Command "& {Invoke-WebRequest -Uri 'YOUR_REPO_URL/index.html' -OutFile 'index.html'}"
powershell -Command "& {Invoke-WebRequest -Uri 'YOUR_REPO_URL/style.css' -OutFile 'style.css'}"
powershell -Command "& {Invoke-WebRequest -Uri 'YOUR_REPO_URL/script.js' -OutFile 'script.js'}"

REM Install dependencies
echo Installing dependencies...
npm install

REM Create start script
echo @echo off > start.bat
echo start http://localhost:3000 >> start.bat
echo node server.js >> start.bat

REM Create desktop shortcut
echo Creating desktop shortcut...
powershell -Command "& {$WshShell = New-Object -comObject WScript.Shell; $Shortcut = $WshShell.CreateShortcut('%USERPROFILE%\Desktop\Twitch TTS.lnk'); $Shortcut.TargetPath = '%USERPROFILE%\TwitchTTS\start.bat'; $Shortcut.Save()}"

echo Installation complete!
echo A shortcut has been created on your desktop.
echo You can now launch Twitch TTS using the desktop shortcut.
pause