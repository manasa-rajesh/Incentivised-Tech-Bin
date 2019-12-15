let tokenParser = require('./createToken');

module.exports = {
    index: (req, res, next) => {
        let token = req.cookies['APP'];
        if (token === undefined) {
            return next();
        }
        tokenParser.verify(token).then((result) => {
            if (result.code !== 200) {
                return res.render('index',{message: 'Please login again'}); 
            }
            req.body.user_id = result.user;
            return res.redirect('/home');
        }).catch((err) => {
            return res.render('index',{message: 'Please login again'});
        })
    },
    home: (req, res, next) => {
        let token = req.cookies['APP'];
        if (token === undefined) {
            return res.redirect('/');
        }
        tokenParser.verify(token).then((result) => {
            if (result.code !== 200) {
                res.cookie('APP','',{'maxAge':0});
                return res.redirect('/');
            }
            req.body.user_id = result.user;
            next();
        }).catch((err) => {
            return res.redirect('/');
        })    
    },
    user: (req, res, next) => {
        let token = req.cookies['APP'];
        if (token === undefined) {
            return res.redirect('/');
        }
        tokenParser.verify(token).then((result) => {
            if (result.code !== 200) {
                res.cookie('APP','',{'maxAge':0});
                return res.redirect('/');
            }
            req.body.user_id = result.user;
            next();
        }).catch((err) => {
            res.cookie('APP','',{'maxAge':0});
            return res.redirect('/');
        })    
    },
    cleaner: (req, res, next) => {
        let token = req.cookies['APP'];
        if (token === undefined) {
            return res.redirect('/cleaner/login');
        }
        tokenParser.verify(token).then((result) => {
            if (result.code !== 200 || result.access !== 'cleaner') {
                res.cookie('APP','',{'maxAge':0});
                return res.redirect('/cleaner/login');
            }
            req.body.user_id = result.user;
            next();
        }).catch((err) => {
            res.cookie('APP','',{'maxAge':0});
            return res.redirect('/cleaner/login');
        })    
    },
}