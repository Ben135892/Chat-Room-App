const id = document.getElementById('hidden').value;
const socket = io.connect();

socket.emit('joined', { id: id });

const message = document.getElementById('message');
const chat = document.getElementById('chat-messages');
const form = document.getElementById('form');

function displayMessage(msg) {
    const p = document.createElement('p');
    p.innerText = msg;
    chat.appendChild(p);
    chat.scrollTop = chat.scrollHeight;
};

form.addEventListener('submit', e => {
    e.preventDefault();
    if (message.value == '')
        return;
    displayMessage('You: ' + message.value);
    socket.emit('message', { message: message.value });
    message.value = '';
});

socket.on('message', message => {
    displayMessage(message);
});