const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});
const tmi = require('tmi.js');

const PORT = process.env.PORT || 3000;

// Enable CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Store active channels and their clients
const activeChannels = new Map();

io.on('connection', (socket) => {
  console.log('Client connected');

  socket.on('join', async (data) => {
    const channel = data.channel;
    
    if (!activeChannels.has(channel)) {
      // Create new TMI client for this channel
      const client = new tmi.Client({
        channels: [channel]
      });

      try {
        await client.connect();
        console.log(`Connected to channel: ${channel}`);
        
        client.on('message', (channel, tags, message, self) => {
          io.emit('chat', {
            username: tags['display-name'],
            message: message,
            color: tags.color || '#FFFFFF'
          });
        });

        activeChannels.set(channel, {
          client,
          users: new Set([socket.id])
        });
      } catch (error) {
        console.error('Error connecting to Twitch:', error);
        socket.emit('error', error.message);
        return;
      }
    } else {
      activeChannels.get(channel).users.add(socket.id);
    }

    socket.channelName = channel;
  });

  socket.on('disconnect', () => {
    if (socket.channelName) {
      const channelData = activeChannels.get(socket.channelName);
      if (channelData) {
        channelData.users.delete(socket.id);
        
        // If no users left, disconnect the TMI client
        if (channelData.users.size === 0) {
          channelData.client.disconnect();
          activeChannels.delete(socket.channelName);
        }
      }
    }
  });
});

http.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});