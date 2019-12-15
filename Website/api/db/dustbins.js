let mongoose = require('mongoose');

let dustbin = new mongoose.Schema({
    weight: {
        glass: {
            type: Number,
        },
        metal: {
            type: Number,
        },
        plastic: {
            type: Number,
        },
    },
    total: {
        type: Number
    },
    full: {
        type: Boolean
    },
    location: {
        lat: {
            type: String
        },
        long: {
            type: String
        }
    }
});

module.exports = mongoose.model('dustbin', dustbin);