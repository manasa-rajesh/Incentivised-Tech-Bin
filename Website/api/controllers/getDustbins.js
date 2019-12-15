let dustbin = require('../db/dustbins');

module.exports = {
    getEmpty: async (req, res) => {
        try {
            let dustbins_found = await dustbin.find({full:false}).exec();
            if (dustbins_found == null) {
                return res.json({
                    code: 500, 
                    success: false,
                    message: 'Error getting dustbins'        
                });
            }
            return res.json({
                code: 200, 
                message: 'Found dustbins',
                success: true,
                dustbins: dustbins_found
            })
        } catch(err) {
            return res.json({
                code: 500,
                success: false,
                message: 'Error getting dustbins'
            })
        }
    },
    empty: async (req, res) => {
        try {
            let dustbins_emptied = await dustbin.findOneAndUpdate({_id: req.body.dustbin_id},{
                total: 0,
                weight: [],
                full:false
            }).exec();
            if (dustbins_emptied == null) {
                return res.json({
                    code: 500, 
                    success: false,
                    message: 'Error clearing dustbins'        
                });
            }
            return res.json({
                code: 200, 
                message: 'Emptied dustbins',
                success: true,
            });
        } catch(err) {
            return res.json({
                code: 500,
                success: false,
                message: 'Error clearing dustbins'        
            })
        }
    }
}