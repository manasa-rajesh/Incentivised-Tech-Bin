let app = require('./app');
let logger = require('./utils/logger');

let mongoose = require('mongoose');

require('dotenv').config();

if (process.env.ENV == 'production') {
    mongoose.connect(process.env.DB_URL, (err) => {
        if (err) {
            logger.log({
                level: 'error',
                message: `Error connecting to database.. ${err}`
            });
            return;
        }
        app.listen(process.env.PORT, () => {
            logger.log({
                level: 'info',
                message: 'Application is up...'        
            })
        });
    });
} else {
    mongoose.connect(process.env.TESTDB_URL, (err) => {
        if (err) {
            logger.log({
                level: 'error',
                message: `Error connecting to database ${err}`
            });
            return;
        }
        app.listen(process.env.PORT, () => {
            logger.log({
                level: 'info',
                message: 'Application is up...'        
            })
        });
    });
}

