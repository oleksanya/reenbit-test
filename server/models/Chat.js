const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const chatSchema = new Schema({
    senderId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    receiverId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    messages: [{
        type: Schema.Types.ObjectId,
        ref: 'Message'
    }],
    lastMessage: {
        type: Schema.Types.ObjectId,
        ref: 'Message'
    }
}, {
    timestamps: true
});

const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;