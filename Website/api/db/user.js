let mongoose = require('mongoose');

let user = new mongoose.Schema({
    name: {
        type: String
    },
    number: {
        type: Number
    },
    email: {
        type: String
    },
    lifetime_rewards: {
        type: Number
    },
    net_rewards: {
        type: Number
    },
    level: {
        type: String,
    },
    current: {
        type: Number
    },
    reward_details: [
        {
            date: {
                type: Number
            },
            rewards: {
                metal: {
                    type: Number
                },
                plastic: {
                    type: Number
                },
                glass: {
                    type: Number
                },
            },
            total: {
                type: Number
            },
        }
        
    ],
    coupons_redeemed: [
        {
            name: {
                type: String
            },
            cost: {
                type: Number
            }
        }
    ],
    otp: {
        expires: {
            type: Number
        },
        otp: {
            type: Number
        }
    }
});

module.exports = mongoose.model('user',user);