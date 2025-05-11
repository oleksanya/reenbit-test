const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    secondName: {
        type: String,
        required: true
    },
    profileImg: {
        type: String,
        default: 'default-profile.png'
    },
    chats: [{
        type: Schema.Types.ObjectId,
        ref: 'Chat'
    }]
}, {
    timestamps: true
});

const User = mongoose.model('User', userSchema);

module.exports = User;