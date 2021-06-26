const User = require('./models/user');
const Room = require('./models/room');

function socketEvents(io) {

    io.on('connection', socket => {

        socket.on('joined', async data => {
            try {
                const user = await User.findById(data.id);
                socket.join(user.room);
                socket.broadcast.to(user.room).emit('message', user.name + ' has joined!');
                user.socketID = socket.id;
                await user.save();
            }
            catch(err) {
                console.log(err);
            }
        });

        socket.on('message', async data => {
            try {
                const user = await User.findOne({ socketID: socket.id }).exec();
                socket.broadcast.to(user.room).emit('message', user.name + ': ' + data.message);
            }
            catch(err) {
                console.log(err);
            }
        });

        socket.on('disconnect', async () => {
            try {
                const user = await User.findOne({ socketID: socket.id }).exec();
                socket.broadcast.to(user.room).emit('message', user.name + ' has left!');
                // remove user from database and from room array
                await User.findByIdAndRemove(user.id);
                const room = await Room.findById(user.room);
                room.users.remove(user.id);
                await room.save();
                // if room has no more current users, delete room
                if (room.users.length == 0) 
                    await Room.findByIdAndRemove(room.id);
            }
            catch(err) {
                console.log(err);
            }
        })

    });

}

module.exports = socketEvents;