


class UserController {
    static async registerUser(req, res, next) {
        console.log(req.body);
        res.status(200).json({
            result: 'success',
            msg: 'data registered'
        });
    }
}

module.exports = UserController