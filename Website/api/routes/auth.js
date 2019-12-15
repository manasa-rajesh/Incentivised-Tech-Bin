let express = require('express');

let router = express.Router();

let upload = require('../../utils/upload');
let login = require('../controllers/login.js')

router.post('/login', upload.single('image'), (req, res) => {
    if (!req.body.file) {
        return res.json({
            code: 400,          
            success: false,
            message: 'Please scan your face'
        }); 
    } else {
        login(req, res);
    }    
});

module.exports = router;