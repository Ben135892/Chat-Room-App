const express = require('express');
const session = require('express-session');
const socketio = require('socket.io');
const mongoose = require('mongoose');

const User = require('./models/user');
const Room = require('./models/room');

const chatRoutes = require('./routes/chatRoutes');
const socketEvents = require('./socketEvents');

const app = express();

require('dotenv').config();
const db = process.env.CONNECTION_STRING;

mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }) // to stop warnings
.then(() => {
    const server = app.listen(3000);

    const io = socketio(server);
    socketEvents(io);
})
.catch(err => console.log(err));

app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true })) // to access req.body object

app.use(session({
    secret: 'secret-key', // protect session data
    resave: false,
    saveUninitialized: false
}))

app.get('/', (req, res) => {
    res.sendFile(__dirname + 'public/index.html');
});

app.use('/chat', chatRoutes);

app.use((req, res) => {
    res.send('Not found... 404 error');
});