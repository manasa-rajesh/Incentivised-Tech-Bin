let express = require('express');

let router = express.Router();

let tokenParser = require('../../utils/authorisation');

let find = require('../controllers/user');
let user = require('../db/user');
let redeem = require('../controllers/redeem');

router.post('/otp', tokenParser.user,(req, res) => {
    redeem.generateOTP(req, res);
});

router.post('/redeem', tokenParser.user,(req, res) => {
    redeem.buyProduct(req, res);
});

router.get('/locations', tokenParser.user, async (req, res) => {
    try {
        let result = await find.getDetails(req.body.user_id);
        if (result.code == 200) {
            return res.json({
                success: true, 
                code: 200, 
                message: 'Found points',
                details: result.details
            })
        }
        return res.json({
            success: false,
            code: 500,
            message: 'Error finding data'
        })        
    } catch(err) {
        return res.json({
            success: false,
            code: 500,
            message: 'Error finding data'
        })
    }
});

module.exports = router;