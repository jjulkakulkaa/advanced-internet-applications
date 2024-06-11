const io = require("socket.io")(3000);

const users = {};

io.on('connection', (socket) => {
  console.log('connected: ' + socket.id);

  socket.on('login', (nick) => {
    users[socket.id] = nick;
    socket.emit('loggedIn');
    io.emit('message', `${nick} has joined the chat.`);
    io.emit('users', Object.values(users));
  });

  socket.on('message', (message) => {
    const nick = users[socket.id];
    io.emit('message', `${nick}: ${message}`);
  });

  socket.on('disconnect', () => {
    const nick = users[socket.id];
    delete users[socket.id];
    io.emit('message', `${nick} has left the chat.`);
    io.emit('users', Object.values(users));
  });
});
