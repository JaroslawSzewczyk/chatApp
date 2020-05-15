const express = require('express');
const path = require('path');
const messages = require('./messages');

const app = express();

app.use(express.static(path.join(__dirname, '/client')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/client/index.html'));
});

app.use((req, res) => {
  res.status(404).json({message: '404 not found...'});
})

app.listen(8000, () => {
  console.log('Server is running on port: 8000');
});