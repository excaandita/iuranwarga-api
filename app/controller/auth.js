const responseHandle = require('../helpers/response.utils');
const userModel = require('../models/users');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../../config');

const login = async (req, res, next) => {
    const {username, password} = req.body;

    userModel.findOne({ where: { username: username } }).then((user) => {
        if(user) {
            const checkPassword = bcrypt.compareSync(password, user.password)
            if(checkPassword) {
                const token = jwt.sign({
                    user: {
                        id: user.id,
                        username: user.username,
                        fullname: user.fullname,
                        email: user.email
                    }
                }, config.jwtSecret);

                responseHandle.ok(res, {token});

            } else {
                responseHandle.forbidden(res, "Password is incorrect");
            }
        } else {
            responseHandle.forbidden(res, "Username or Email not registered");
        }
    }).catch((error) => {
        responseHandle.error(res, error);

        next();
    });
}

module.exports = {
    login
};