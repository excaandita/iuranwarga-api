const userModel = require('../models/users')

const getAllUsers = async (req, res, next) => {
    try {
        const [data] = await userModel.getAllUser();

        res.json({
            message: 'GET users successfully',
            data: data
        })
    } catch (error) {
        res.status(500).json({
            message: 'Internal Server Error',
            serverMessage: error
        })
    }
};

const createNewUser = (req, res, next) => {
    console.log(req.body)
    res.json({
        message: 'POST user successfully',
        data: req.body
    })
};

const updateUser = (req, res, next) => {
    console.log(req.params)
    res.json({
        message: 'UPDATE users successfully'
    })
};

module.exports = {
    getAllUsers,
    createNewUser,
    updateUser
};