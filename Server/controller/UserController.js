require('dotenv').config();

const User = require('../models/User')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const saltRounds = 10;



class UserController {
    static async registerUser(req, res, next) {
        try {

            if (req.body.password !== req.body.passwordConfirmation) {
                return res.status(400).json({
                    result: 'failed',
                    msg: 'different confirmation password'
                });
            }

            const user = await User.find(
                { email: req.body.email }
            )

            if (user.length !== 0) {
                return res.status(422).json({
                    result: 'failed',
                    msg: 'email already exist'
                }); 
            }

            bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
                if (err) {
                    res.status(500).json({
                        result: 'failed',
                        msg: 'something wrong. try again'
                    });
                }
                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    password: hash,
                    birth: req.body.birth,
                    profile_picture_url: req.body.profile_picture_url
                });
                newUser.save().then(data => {
                    console.log(data);
                });
                res.status(200).json({
                    result: 'success',
                    msg: 'data registered'
                });
            });

        } catch (err) {
            res.status(500).json({
                result: 'failed',
                msg: `${err}`
            });
        }
    }

    static async login(req, res, next) {
        try{
            
            const user = await User.find(
                { email: req.body.email }
            )

            if (user.length === 0) {
                return res.status(403).json({
                    result: 'failed',
                    msg: 'email does not exists'
                })
            }

            bcrypt.compare(req.body.password, user[0].password, function(err, result) {
                if (err) {
                    res.status(500).json({
                        result: 'failed',
                        msg: 'something wrong. try again'
                    });
                }

                if (!result) {
                    return res.status(403).json({
                        result: 'failed',
                    msg: 'wrong password'
                    });
                }



                const payLoad = {
                    id: user[0].id,
                    name: user[0].name,
                    profile_picture: user[0].profile_picture_url,
                    birth: user[0].birth
                }
            
                const accessToken = jwt.sign(payLoad, process.env.ACCESS_TOKEN_SECRET, {
                    expiresIn: '24h'
                });

                res.status(200).json({
                    result: 'success',
                    msg: 'successfuly logged in',
                    accessToken: accessToken
                });
            });

        }catch(err) {
            res.status(500).json({
                result: 'failed',
                msg: `${err}`
            });
        }
    }
}

module.exports = UserController