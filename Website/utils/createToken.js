let jwt = require('jsonwebtoken');

module.exports = {
    generate: (id) => {
        return new Promise((resolve, reject) => {
            jwt.sign({
                exp: Math.floor(Date.now() / 1000) + (60 * 60),
                user: id
            }, process.env.JWT,(err, coded) => {
                if (err) {
                    return reject({
                        code: 500,
                        message: 'Error coding token'
                    })
                }
                return resolve({
                    code: 200,
                    token: coded
                })
            });
        })
    },
    generateForCleaner: (id) => {
        return new Promise((resolve, reject) => {
            jwt.sign({
                exp: Math.floor(Date.now() / 1000) + (60 * 60),
                user: id,
                access:'cleaner'
            }, process.env.JWT,(err, coded) => {
                if (err) {
                    return reject({
                        code: 500,
                        message: 'Error coding token'
                    })
                }
                return resolve({
                    code: 200,
                    token: coded
                })
            });
        })
    },
    verify: (token) => {
        return new Promise((resolve, reject) => {
            jwt.verify(token, process.env.JWT, (err, decoded) => {
                if (err) {
                    return reject({
                        code: 500,
                        message: 'Error decoding token'
                    });
                }
                if (Date.now()/1000 > decoded.exp) {
                    return resolve({
                        code: 401,
                        user: decoded.user,
                        access: decoded.access,
                        expired: true
                    });
                }
                return resolve({
                    code: 200,
                    user: decoded.user,
                    expired: false
                });
            });
        });
    }
}