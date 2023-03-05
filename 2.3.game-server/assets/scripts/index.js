const socket = io('http://localhost:3001');
socket.emit('reply', Math.random());
socket.on('request', (data) => {
  console.log('🌺', data);
});
