const { io } = require('socket.io-client');

const socket = io('http://localhost:3000', {
  auth: { token: 'PASTE_A_REAL_ACCESS_TOKEN_HERE' },
});

socket.on('connect', () => {
  console.log('Connected! Socket id:', socket.id);
});

socket.on('new-application', (data) => {
  console.log(' New application received:', data);
});

socket.on('connect_error', (err) => {
  console.log('Connection failed:', err.message);
});