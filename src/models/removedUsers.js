const mongoose = require('mongoose');

const removedUsersSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    
});

const removedUser =new mongoose.model('removedUser', removedUsersSchema);

module.exports = removedUser;



