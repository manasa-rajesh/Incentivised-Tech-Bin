let multer = require('multer');

let storage = multer.diskStorage({
    destination: 'temp',
    filename: function (req, file, callback) {
        let filename = Date.now() + '.jpeg';
        req.body.file = filename;
        callback(null, filename);
    }
});

let upload = multer({ storage: storage });

module.exports = upload;