const responseHandle = require('../helpers/response.utils');
const jwt = require('jsonwebtoken');
const config = require('../../config')

const userModel = require('../models/users');

//isLogin-> digunakan untuk validasi token yg dipakai adalah Admin dan digunakan untuk hak akses Login
const isLogin = async(req, res, next) => {
    try {
        const token = req.headers.authorization ? req.headers.authorization.replace('Bearer ', '') : null;
        
        const data = jwt.verify(token, config.jwtSecret)

        const user = await userModel.findOne({ where : {id : data.user.id} })
        console.log(data)
        if(!user){
            throw new Error()
        } 

        req.user = user
        req.token = token

        next()

    } catch (error) {
        responseHandle.unauthorized(res)
    }
};

module.exports = isLogin;



