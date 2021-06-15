const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    socketID: {
        type: String,
    },
    name: {
        type: String,
        required: true
    },
    room: {
        type: Schema.Types.ObjectID,
        ref: 'Room',
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;