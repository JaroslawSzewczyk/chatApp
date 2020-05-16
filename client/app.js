const loginFrom = document.getElementById('welcome-form');
const messagesSection = document.getElementById('messages-section');
const messagesList = document.getElementById('messages-list');
const addMessageForm = document.getElementById('add-messages-form');
const userNameInput = document.getElementById('username');
const messageContentInput = document.getElementById('message-content');

const socket = io();
let userName ='';

socket.on('join', ({ name }) => login(author));
socket.on('message', ({ author, content }) => addMessage(author, content));
socket.on('manageUser', ({ author, content }) => addMessage(author, content));

function login(event) {
  event.preventDefault();
  if (userNameInput.value === '') {
    alert('Please type your name');
  } else {
    userName = userNameInput.value;
    loginFrom.classList.remove('show');
    messagesSection.classList.add('show');
    socket.emit('join', { name: userName });
  }
}

function sendMessage(event) {
  event.preventDefault();
  if (messageContentInput.value === '') {
    alert('Please type your message');
  } else {
    addMessage(userName, messageContentInput.value);
    socket.emit('message', { author: userName, content: messageContentInput.value });
    messageContentInput.value = '';
  }
}

function addMessage(author, content) {
  const message = document.createElement('li');
  message.classList.add('message');
  message.classList.add('message--received');
  if (author === userName) {
    message.classList.add('message--self');
  }
  if (author === 'Chat Bot') {
    message.classList.add('chat--bot');
  }
  message.innerHTML = `<h3 class="message__author">${author === userName ? 'You' : author}</h3>
    <div class="message__content">${content}</div>`;
  messagesList.appendChild(message);
}

loginFrom.addEventListener('submit', login);

addMessageForm.addEventListener('submit', sendMessage);