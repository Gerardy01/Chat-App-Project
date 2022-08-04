require('dotenv').config();

const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validator = require('email-validator');

const saltRounds = 10;



class UserController {

    static async getOneUser(req, res, next) {
        try {

            const user = await User.findOne(
                { _id: req.params.id }
            );

            const data = {
                id: user._id,
                username: user.username,
                name: user.name,
                email: user.email,
                birth: user.birth,
                profilePicture: user.profile_picture_url,
                friends: user.friends,
                group: user.group
            }

            res.status(200).json({
                result: 'success',
                data: data
            });
        } catch(err) {
            res.status(500).json({
                result: 'failed',
                msg: `${err}`
            });
        }
    }

    static async registerUser(req, res, next) {
        try {

            if (req.body.username.length < 5) {
                return res.status(411).json({
                    result: 'failed',
                    type: 'username',
                    msg: 'username less than 5 character'
                }); 
            }

            const userUsername = await User.find(
                { username: req.body.username }
            )
            
            if (userUsername.length !== 0) {
                return res.status(409).json({
                    result: 'failed',
                    type: 'username',
                    msg: 'username already used'
                }); 
            }



            const isValidated = validator.validate(req.body.email);
            
            if (!isValidated) {
                return res.status(400).json({
                    result: 'failed',
                    type: 'email',
                    msg: 'not a well formed email address'
                }); 
            }

            const userEmail = await User.find(
                { email: req.body.email }
            )

            if (userEmail.length !== 0) {
                return res.status(409).json({
                    result: 'failed',
                    type: 'email',
                    msg: 'email already exist'
                }); 
            }



            if (req.body.password.length < 8) {
                return res.status(411).json({
                    result: 'failed',
                    type: 'password',
                    msg: 'password less than 8 character'
                });
            }

            if (req.body.password !== req.body.confirmPassword) {
                return res.status(400).json({
                    result: 'failed',
                    type: 'password',
                    msg: 'different confirmation password'
                });
            }



            bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
                if (err) {
                    throw Error('something wrong. try again')
                }

                const newUser = new User({
                    username: req.body.username,
                    email: req.body.email,
                    password: hash,
                    name: req.body.name,
                    birth: req.body.birth,
                    profile_picture_url: req.body.profile_picture_url,
                    friends: [],
                    group: []
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

            const isEmail = validator.validate(req.body.user);

            let user;

            if (isEmail) {
                user = await User.findOne(
                    { email: req.body.user }
                )
            } else {
                user = await User.findOne(
                    { username: req.body.user }
                )
            }

            if (!user) {
                return res.status(404).json({
                    result: 'failed',
                    msg: 'email or username does not exist'
                })
            }
            bcrypt.compare(req.body.password, user.password, function(err, result) {
                if (err) {
                    throw Error('something wrong. try again')
                }

                if (!result) {
                    return res.status(403).json({
                        result: 'failed',
                        msg: 'wrong password'
                    });
                }



                const payLoad = {
                    id: user.id,
                    name: user.name,
                    profile_picture: user.profile_picture_url,
                    birth: user.birth
                }
            
                const accessToken = jwt.sign(payLoad, process.env.ACCESS_TOKEN_SECRET, {
                    expiresIn: '12h'
                });

                res.status(200).json({
                    result: 'success',
                    msg: 'successfuly logged in',
                    access_token: accessToken
                });
            });

        }catch(err) {
            res.status(500).json({
                result: 'failed',
                msg: `${err}`
            });
        }
    }
    
    static async changeName(req, res, next) {
        try {
            
            const user = await User.findByIdAndUpdate(
                { _id: req.tokenData.id },
                { name: req.body.newName }
            )

            if (!user) {
                return res.status(417).json({
                    result: 'failed',
                    msg: 'id does not valid'
                });
            }

            res.status(200).json({
                result: 'success',
                msg: 'name has been changed'
            });

        } catch(err) {
            res.status(500).json({
                result: 'failed',
                msg: `${err}`
            });
        }
    }

    static async changeBirth(req, res, next) {
        
    }

    static async changeProfilePicture(req, res, next) {
        
    }

    static async changeUsername(req, res, next) {
        try {
            
            const user = await User.findOne(
                { _id: req.tokenData.id }
            );
            
            if (!user) {
                return res.status(417).json({
                    result: 'failed',
                    msg: 'id does not valid'
                });
            }

            bcrypt.compare(req.body.password, user.password, async function(err, result) {
                if (err) {
                    throw Error('something wrong. try again');
                }

                if (!result) {
                    return res.status(403).json({
                        result: 'failed',
                        msg: 'wrong password'
                    });
                }

                await User.findOneAndUpdate(
                    { _id: user.id },
                    { username: req.body.newUsername }
                );
                
                res.status(200).json({
                    result:'success',
                    msg: 'username has been updated'
                });

            });

        } catch(err) {
            res.status(500).json({
                result: 'failed',
                msg: `${err}`
            });
        }
    }
    
    static async changeEmail(req, res, next) {
        try {

            const userEmail = await User.findOne(
                { email: req.body.newEmail }
            );

            if (userEmail) {
                return res.status(409).json({
                    result: 'failed',
                    type: 'email',
                    msg: 'email already exist'
                }); 
            }

            const isValidated = validator.validate(req.body.newEmail);
            
            if (!isValidated) {
                return res.status(400).json({
                    result: 'failed',
                    type: 'email',
                    msg: 'not a well formed email address'
                }); 
            }



            const user = await User.findOne(
                { _id: req.tokenData.id }
            )

            bcrypt.compare(req.body.password, user.password, async function(err, result) {
                if (err) {
                    throw Error('something wrong, try again')
                }

                if(!result) {
                    return res.status(403).json({
                        result: 'failed',
                        msg: 'wrong password'
                    });
                }

                await User.findOneAndUpdate(
                    { _id: user.id },
                    { email: req.body.newEmail }
                );

                res.status(200).json({
                    result: 'success',
                    msg: 'email updated'
                });

            });

        } catch(err) {
            res.status(500).json({
                result: 'failed',
                msg: `${err}`
            });
        }
    }

    static async changePassword(req, res, next) {
        try {

            if (req.body.newPassword.length < 8) {
                return res.status(411).json({
                    result: 'failed',
                    msg: 'password less than 8 character'
                });
            }

            if (req.body.newPassword !== req.body.confirmNewPassword) {
                return res.status(400).json({
                    result: 'failed',
                    msg: 'different confirmation password'
                });
            }



            const user = await User.findOne(
                { _id: req.tokenData.id }
            )

            if (!user) {
                return res.status(417).json({
                    result: 'failed',
                    msg: 'id does not valid'
                });
            }
            
            bcrypt.compare(req.body.oldPassword, user.password, function(err, result) {
                if (err) {
                    throw Error('something wrong, try again')
                }

                if (!result) {
                    return res.status(403).json({
                        result: 'failed',
                        msg: 'wrong password'
                    });
                }

                bcrypt.hash(req.body.newPassword, saltRounds, async function(err, hash) {

                    if (err) {
                        throw Error(err);
                    }

                    await User.findOneAndUpdate(
                        { _id: user.id },
                        { password: hash },
                    );

                    res.status(200).json({
                        result: 'success',
                        msg: 'password changed'
                    });

                });
                
            });

        } catch(err) {
            res.status(500).json({
                result: 'failed',
                msg: `${err}`
            });
        }
    }
}

module.exports = UserController