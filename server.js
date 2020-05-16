const express = require('express');
const path = require('path');
const socket = require('socket.io');
const db = require('./db');

const app = express();

app.use(express.static(path.join(__dirname, '/client')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/client/index.html'));
});

app.use((req, res) => {
  res.status(404).json({ message: '404 not found...' });
});

const server = app.listen(8000, () => {
  console.log('Server is running on port: 8000');
});

const io = socket(server);

io.on('connection', (socket) => {
  console.log('New client! Its id – ' + socket.id);
  
  socket.on('join', (author) => {
    db.users.push({ ...author, id: socket.id });
    console.log('users', db.users);
    socket.broadcast.emit('manageUser', {author: 'Chat Bot', content: `${author.name} has joined the conversation!`});
  });
  socket.on('message', (message) => {
    console.log('Oh, I\'ve got something from ' + socket.id);
    db.messages.push(message);
    socket.broadcast.emit('message', message);
  });  
  socket.on('disconnect', () => {
    let user = db.users.find(user => user.id === socket.id);
    let userIndex = db.users.indexOf(user);
    db.users.splice(userIndex, 1);
    socket.broadcast.emit('manageUser', {author: 'Chat Bot', content: `${user.name} has left the conversation!`});
    console.log('Oh, socket ' + socket.id + ' has left')
  });

  console.log('I\'ve added a listener on message event \n');
});