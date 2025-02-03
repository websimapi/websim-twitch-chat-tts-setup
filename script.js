// Removed ES module import for tmi.js to use the global tmi provided via CDN
const synth = window.speechSynthesis;
let client = null;

export function connectToChannel() {
  const channel = document.getElementById('channel').value.toLowerCase();
  
  if (!channel) {
    alert('Please enter a channel name');
    return;
  }

  if (client) {
    client.disconnect();
  }

  // Use the global tmi variable from the browser CDN version.
  client = new tmi.Client({
    channels: [channel]
  });

  client.connect().catch(error => {
    console.error('Error connecting to Twitch:', error);
    alert('Error connecting to channel: ' + error.message);
  });

  client.on('message', (channel, tags, message, self) => {
    displayMessage({
      username: tags['display-name'] || tags.username,
      message: message,
      color: tags.color || '#FFFFFF'
    });
    speakMessage({
      username: tags['display-name'] || tags.username,
      message: message
    });
  });

  client.on('connected', () => {
    console.log('Connected to Twitch channel:', channel);
    const chatMessages = document.getElementById('chat-messages');
    chatMessages.innerHTML = `<div class="system-message">Connected to ${channel}'s chat!</div>`;
  });
}

function displayMessage(data) {
  const chatMessages = document.getElementById('chat-messages');
  const messageDiv = document.createElement('div');
  messageDiv.className = 'message';
  messageDiv.innerHTML = `<strong style="color: ${data.color}">${data.username}:</strong> ${data.message}`;
  chatMessages.appendChild(messageDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function speakMessage(data) {
  const utterance = new SpeechSynthesisUtterance(`${data.username} says ${data.message}`);
  
  utterance.volume = parseFloat(document.getElementById('volume').value);
  utterance.rate = parseFloat(document.getElementById('rate').value);
  utterance.pitch = parseFloat(document.getElementById('pitch').value);
  
  synth.speak(utterance);
}

// Event listeners for controls
document.getElementById('volume').addEventListener('input', (e) => {
  localStorage.setItem('tts-volume', e.target.value);
});

document.getElementById('rate').addEventListener('input', (e) => {
  localStorage.setItem('tts-rate', e.target.value);
});

document.getElementById('pitch').addEventListener('input', (e) => {
  localStorage.setItem('tts-pitch', e.target.value);
});

// Load saved settings and expose connectToChannel globally
window.addEventListener('load', () => {
  document.getElementById('volume').value = localStorage.getItem('tts-volume') || 0.5;
  document.getElementById('rate').value = localStorage.getItem('tts-rate') || 1;
  document.getElementById('pitch').value = localStorage.getItem('tts-pitch') || 1;
  
  window.connectToChannel = connectToChannel;
});