const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/user');
const Room = require('./models/room');

const router = express.Router();

router.post('/create', async (req, res) => {
    try {
        const room = new Room();
        const user = new User(req.body);
        user.room = room.id;
        room.users.push(user.id);
        await user.save();
        await room.save();
        // save name and user ID to access at /:id route
        req.session.data = {
            name: req.body.name,
            id: user.id
        };
        res.json({ redirect: '/chat/' + user.room });
    }
    catch(err) {
        console.log(err);
    }
});

router.post('/join', async (req, res) => {
    try {
        const roomID = req.session.data.room;
        const name = req.body.name;
        const room = await Room.findById(roomID);
        const user = new User({ name: name });
        user.room = room.id;
        room.users.push(user.id);
        await room.save();
        await user.save();
        // save name and user ID to access at /:id route
        req.session.data.name = name;
        req.session.data.id = user.id;
        res.json({ redirect: '/chat/' + roomID, success: true });
    }
    catch(err) {
        console.log(err);
        res.json({ success: false, message: 'Error joining room' });
        return;
    }
});

router.get('/:id', async (req, res, next) => {
    // if user has set their name
    if (req.session.data && req.session.data.name) {
        res.render('chat', req.session.data);
        req.session.destroy();
        return;
    }
    const roomID = req.params.id;
    try {
        if (mongoose.Types.ObjectId.isValid(roomID)) {
            const room = await Room.findById(roomID);
            if (room) {
                // if valid room exists, allow user to join room, save room ID to access at join route
                req.session.data = { room: roomID };
                console.log(__dirname);
                res.sendFile(__dirname + '/public/join.html');
                return;
            }
        }
        // if room does not exist with or ID is invalid, give 404 error
        next();
    }
    catch(err) {
        console.log(err);
    }
});

module.exports = router;