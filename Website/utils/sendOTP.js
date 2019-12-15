let nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
           user: 'vatsalkandoi1998@gmail.com',
           pass: 'v@salk@ndoi1998'
       }
   });

module.exports = (otp, mail) => {
    const mailOptions = {
        from: 'vatsalkandoi1998@gmail.com', // sender address
        to: mail, // list of receivers
        subject: 'OTP', // Subject line
        html: `${otp}`
    }
    transporter.sendMail(mailOptions, function (err, info) {
        if(err)
            return {
                code: 500,
                message: 'Error generating OTP'
            }
        else
            return {
                code: 200, 
                success: true,
                message: 'OTP sent to the registered email'
            }
    });
}