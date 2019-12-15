let user = require('../db/user');

module.exports = {
    getDetails: (id) => {
        return new Promise((resolve, reject) => {
            user.findOne({_id:id}).then((result) => {
                if (result == null) {
                    return resolve({
                        success: false,
                        message: 'Error finding user'
                    });
                }
                return resolve({
                    code: 200,
                    success: true,
                    name: result.name,
                    total_rewards : result.lifetime_rewards,
                    net_rewards: result.net_rewards,
                    level: result.level,
                    month_rewards: result.current,
                    details: result.reward_details
                })
            }).catch((err) => {
                return reject({
                    success: false,
                    code: 500,
                    message: 'Error finding user'
                })
            });
        });
    },
    getLeaderBoard: (month) => {
        return new Promise((resolve, reject) => {
            if (month) {
                user.find({}).sort([['current', -1]]).limit(10).select('name level current lifetime_rewards').then((result) => {
                    if(result == null) {
                        return resolve({
                            success: false, 
                            code: 500,
                            message: 'Error finding users'
                        })
                    }
                    return resolve({
                        success: false, 
                        code: 200,
                        message: 'Leaderboard found',
                        leaderboard: result
                    })
                })
            } else {
                user.find({}).sort([['lifetime_rewards', -1]]).limit(10).select('name level current lifetime_rewards').then((result) => {
                    if(result == null) {
                        return resolve({
                            success: false, 
                            code: 500,
                            message: 'Error finding users'
                        })
                    }
                    return resolve({
                        success: false, 
                        code: 200,
                        message: 'Leaderboard found',
                        leaderboard: result
                    })
                })
            }
        });
    }
}