import http from 'http';
import fs from 'fs';
import { WebSocketServer } from 'ws';

const PORT = 3001;

// User story 1: HTTP server that serves public/index.html
const server = http.createServer((req, res) => {
  fs.readFile('./public/index.html', (err, data) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Error loading page');
      return;
    }
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(data);
  });
});

// User story 2: WebSocket server attached to the HTTP server
const wss = new WebSocketServer({ server });

// Helper: send a message to every connected client
function broadcast(message) {
  const data = JSON.stringify(message);
  wss.clients.forEach((client) => {
    if (client.readyState === 1) { // 1 means the connection is open
      client.send(data);
    }
  });
}

// User story 3: listen for new connections
wss.on('connection', (socket, req) => {
  // User story 4: read the username from the URL, then announce it
  const username = new URL(req.url, 'http://localhost').searchParams.get(
    'username',
  );

  broadcast({ type: 'system', text: `${username} joined` });

  // User story 5: when this client sends a message, broadcast it to everyone
  socket.on('message', (rawData) => {
    try {
      const { username, text } = JSON.parse(rawData.toString());
      broadcast({ type: 'chat', username, text });
    } catch (error) {
      console.error('Invalid message received');
    }
  });

  // User story 6: when this client disconnects, tell the others
  socket.on('close', () => {
    broadcast({ type: 'system', text: `${username} left` });
  });
});

// User story 7: start the server
server.listen(PORT, () => {
  console.log(`Chat server running at http://localhost:${PORT}`);
});