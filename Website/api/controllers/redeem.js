let user = require('../db/user');
let otp = require('../../utils/otp');
let mail = require('../../utils/sendOTP');
module.exports = {
    generateOTP: async (req, res) => {
        try {
            let User = await user.findOne({_id: req.body.user_id, net_rewards: {$gte: req.body.cost}}).exec();
            if (User == null) {
                return res.json({
                    success: false,
                    message: 'Invalid number of reward points. Try collecting more',
                    code: 401
                });
            }
            let otp_result = await otp.generate(req.body.user_id);
            if (otp_result.code != 200) {
                return res.json({
                    code: 500,
                    success: false,
                    message: 'Error generating OTP'
                });
            }
            let result = mail(otp_result.otp, user.email);
            if (result.code != 200) {
                return res.json({
                    code: 500,
                    success: false,
                    message: 'Error generating OTP'
                });
            }
            return res.json({
                code: 200,
                success: true,
                message: 'OTP sent to your registered email'
            });
        } catch (err) {
            return res.json({
                code: 500,
                success: false,
                message: 'Error generating OTP'
            });
        }
    },
    buyProduct: async (req, res) => {
        try {
            let User = await user.findOneAndUpdate({_id: req.body.user_id, 'otp.otp': req.body.otp},{
                $inc: {net_rewards: -req.body.cost },
                $push: { coupons_redeemed: { name: req.body.name, cost: req.body.cost } }
            }).exec();
            if (User == null) {
                return res.json({
                    success: false,
                    message: 'Error redeeming coupon',
                    code: 401
                });
            }
            return res.json({
                code: 200,
                success: true,
                message: 'Successfully redeemed coupon'
            });
        } catch (err) {
            return res.json({
                code: 500,
                success: false,
                message: 'Error redeeming coupon'
            });
        }
    },
}