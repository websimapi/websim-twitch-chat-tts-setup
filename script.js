let socket;
const synth = window.speechSynthesis;
let connected = false;

function connectToChannel() {
  const channel = document.getElementById('channel').value.toLowerCase();
  
  if (!channel) {
    alert('Please enter a channel name');
    return;
  }

  if (connected) {
    socket.disconnect();
  }

  socket = io('http://localhost:3000');
  
  socket.on('connect', () => {
    console.log('Connected to server');
    socket.emit('join', { channel });
  });

  socket.on('chat', (data) => {
    displayMessage(data);
    speakMessage(data);
  });

  socket.on('error', (error) => {
    console.error('Socket error:', error);
    alert('Error connecting to channel: ' + error);
  });

  connected = true;
}

function displayMessage(data) {
  const chatMessages = document.getElementById('chat-messages');
  const messageDiv = document.createElement('div');
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

// Load saved settings
window.addEventListener('load', () => {
  document.getElementById('volume').value = localStorage.getItem('tts-volume') || 0.5;
  document.getElementById('rate').value = localStorage.getItem('tts-rate') || 1;
  document.getElementById('pitch').value = localStorage.getItem('tts-pitch') || 1;
});