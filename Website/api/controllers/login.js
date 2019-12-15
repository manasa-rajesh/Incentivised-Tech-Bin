let request = require('request-promise');
let fs= require('fs');
let tokenParser = require('../../utils/createToken');
let user = require('../db/user');

module.exports = async (req, res) => {
    try {
        let formData = {
            image: fs.createReadStream(process.cwd()+'/temp/'+req.body.file),
        };
        let resp = await request.post({url:'http://192.168.43.148:80/login', formData: formData});
        resp = JSON.parse(resp)
        console.log(typeof resp);
        let User = await user.findOne({_id: resp.id});
            if (User == null) {
                return res.json({
                    success: false,
                    code: 500,
                    message: 'Error finding user'
                });
            }
            let token = await tokenParser.generate(User._id)
            if (token.code == 200) {
                res.cookie('APP',token.token,{maxAge: Date.now() + 60*60*1000})
                return res.json({
                        code: 200,
                        success: true,
                        message:'logged in',
                        url: '/home'
                    })
            }
            return res.json({
                code: 500,          
                success: false,
                message: 'Error logging in'
            });
        
    } catch (err) {
        console.log(err);
        return res.json({
            code: 500,          
            success: false,
            message: 'Error logging in'
        });
    }
}