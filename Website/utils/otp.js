let user = require('../api/db/user');

module.exports = {
    generate: async (userId) => {
        try {
            let val = Math.floor(1000 + Math.random() * 9000);
            let User = await user.findOneAndUpdate({_id: userId},{otp: {
                otp: val,
                expires: new Date(1 * 3600 * 1000).now()            
            }}).exec();
            if (User == null) {
                return {
                    code: 404,
                    success: false,
                    message: 'Error finding user'
                }
            }
            return {
                code: 200,
                success: true,
                message: 'Updated OTP',
                otp: val
            }
        } catch(err) {
            return {
                code: 500,
                success: false,
                message: 'Error updating OTP'
            }
        }
    },
    verify: async (otp, userId) => {
        try {
            let User = await user.findOne({_id: userId, 'otp.otp':otp}).exec();
            if (User == null) {
                return {
                    code: 401,
                    success: false,
                    message: 'OTP mismatch'
                }
            }
            if (User.otp.expires > Dat.now()) {
                return {
                    code: 400,
                    success: false,
                    message: 'Expired'
                }                
            }
            return {
                code: 200,
                success: true,
                message: 'OTP matched',
            }
        } catch(err) {
            return {
                code: 500,
                success: false,
                message: 'Error checking OTP'
            }
        }
    }
}