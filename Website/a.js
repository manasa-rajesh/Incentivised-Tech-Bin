let db = require('./api/db/dustbins');

let User = new db({
    weight: [],
    total: 0,
    full: false,
    location: {
        lat: 12.9802738,
        long: 79.1644584
    }
})
let mongoose = require('mongoose');

require('dotenv').config();
mongoose.connect(process.env.TESTDB_URL, (err) => {

User.save().then((result) => {
    console.log(result);
}).catch((err) => {
    console.log(err);
});
});
