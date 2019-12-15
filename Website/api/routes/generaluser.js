let express = require('express');

let router = express.Router();

let dustbin = require('../controllers/getDustbins');
let user = require('../controllers/user');

router.get('/leaderboard', async (req, res) => {
    try{
        let result = await user.getLeaderBoard(req.body.month || true);
        return res.json({
            ...result
        })
    } catch(err) {
        return res.json({
            ...err
        });
    }
});

router.get('/empty', (req, res) => {
    dustbin.getEmpty(req, res);
});

module.exports = router;