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
        req.session.data = {
            name: req.body.name,
            room: room.id,
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
        if (!room) {
            res.json({ redirect: '/' });
            return;
        }
        const user = new User({ name: name });
        user.room = room.id;
        room.users.push(user.id);
        await user.save();
        await room.save();
        req.session.data.name = name;
        req.session.data.id = user.id;
        res.json({ redirect: '/chat/' + roomID });
    }
    catch(err) {
        console.log(err);
    }
});

router.get('/:id', async (req, res, next) => {
    // if user has set their name
    if (req.session.data && req.session.data.name) {
        res.render('chat', req.session.data);
        req.session.destroy();
        return;
    }
    // need user to set their name
    const roomID = req.params.id;
    try {
        if (mongoose.Types.ObjectId.isValid(roomID)) {
            const room = await Room.findById(roomID);
            if (room) {
                // if room exists
                req.session.data = { room: roomID };
                res.render('join');
                return;
            }
        }
        // if room does not exist with or ID is invalid
        next();
    }
    catch(err) {
        console.log(err);
    }
});

module.exports = router;