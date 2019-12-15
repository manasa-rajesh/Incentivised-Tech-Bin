let mongoose = require('mongoose');

let garbageman = new mongoose.Schema({
    garbageID: {
        type: String
    },
    password: {
        type: String
    },
    socketId: {
        type: String
    }    
});

module.exports = mongoose.model('garbageman', garbageman);