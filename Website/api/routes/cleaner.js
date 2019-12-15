let express = require('express');

let router = express.Router();

let cleaner = require('../db/garbageman');
let dustbin = require('../controllers/getDustbins')
let tokenGenerator = require('../../utils/createToken');
let authorisation = require('../../utils/authorisation');


router.post('/login', async (req, res) => {
    try {
        let result = await cleaner.findOne({garbageID: req.body.id, password: req.body.password}).exec();
        if (result == null) {
            return res.json({
                success: false,
                code: 200, 
                message: 'Invalid credential. Please check your username and password'
            });
        }
        let token = await tokenGenerator.generateForCleaner(result._id);
        if (token.code !== 200) {
            return res.json({
                success: false, 
                code: 500, 
                message: 'Error generating token'
            });
        }
        res.cookie('APP',token.token,{maxAge: Date.now() + 60*60*1000})
        return res.redirect('/cleaner/home')
    } catch(err) {
        return res.json({
            success: false,
            code: 500, 
            message: 'Invalid credential. Please check your username and password'
        });
    }
});

router.post('/route', authorisation.cleaner, (req, res) => {

});
router.post('/clean', authorisation.cleaner, (req, res) => {
    dustbin.empty(req,res);
});

module.exports = router;