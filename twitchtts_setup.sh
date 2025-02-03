#!/bin/bash

echo "Installing Twitch TTS System..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Create directory for the application
mkdir -p ~/TwitchTTS
cd ~/TwitchTTS

# Download application files from GitHub (you would need to host these files)
echo "Downloading application files..."
curl -O YOUR_REPO_URL/server.js
curl -O YOUR_REPO_URL/package.json
curl -O YOUR_REPO_URL/index.html
curl -O YOUR_REPO_URL/style.css
curl -O YOUR_REPO_URL/script.js

# Install dependencies
echo "Installing dependencies..."
npm install

# Create start script
echo "#!/bin/bash" > start.sh
echo "xdg-open http://localhost:3000" >> start.sh
echo "node server.js" >> start.sh
chmod +x start.sh

# Create desktop shortcut
echo "Creating desktop shortcut..."
echo "[Desktop Entry]" > ~/Desktop/TwitchTTS.desktop
echo "Name=Twitch TTS" >> ~/Desktop/TwitchTTS.desktop
echo "Exec=$HOME/TwitchTTS/start.sh" >> ~/Desktop/TwitchTTS.desktop
echo "Type=Application" >> ~/Desktop/TwitchTTS.desktop
echo "Terminal=true" >> ~/Desktop/TwitchTTS.desktop
chmod +x ~/Desktop/TwitchTTS.desktop

echo "Installation complete!"
echo "A desktop shortcut has been created."
echo "You can now launch Twitch TTS using the desktop shortcut."