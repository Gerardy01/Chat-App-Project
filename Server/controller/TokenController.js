const jwt = require('jsonwebtoken');



class TokenController {
    static async getNewToken(req, res, next) {
        try {

            const payLoad = {
                id: req.tokenData.id,
                name: req.tokenData.name,
                profile_picture: req.tokenData.profile_picture,
                birth: req.tokenData.birth
            }
            
            const accessToken = jwt.sign(payLoad, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: '12h'
            });
    
            res.status(200).json({
                result: 'success',
                msg: 'generate new token',
                access_token: accessToken
            });
        } catch(err) {
            console.log(err);
            res.status(401).json({
                result: 'failed',
                msg: 'invalid token'
            });
        }
    }
}

module.exports = TokenController