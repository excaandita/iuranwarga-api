const responseHandle = require('../helpers/response.utils');
const userModel = require('../models/users');
const bcrypt    = require('bcryptjs');
const { Op }    = require('sequelize');

const getAllUsers = async (req, res, next) => {
    try {
        const page   = parseInt(req.query.page)  || 1;
        const limit  = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const { name, address } = req.query;

        let where = {};
        if (name) {
            where.fullname = { [Op.like]: `%${name}%` };
        }
        if (address) {
            where.address    = { [Op.like]: `%${address}%` };
        }

        const result = await userModel.findAndCountAll({
            where,
            limit,
            offset,
            order: [['id', 'DESC']]
        });

        const totalPages = Math.ceil(result.count / limit);

        responseHandle.ok(res, {
            totalItems: result.count,
            totalPages: totalPages,
            currentPage: page,
            perPage: limit,
            data: result.rows
        }, 'GET users successfully');

    } catch (error) {
        responseHandle.error(res, error);
    }
};

const getUserById = async (req, res, next) => {
    const { idUser } = req.params;

    try {
        const user = await userModel.findByPk(idUser);
        if (!user) {
            return res.status(404).json({
                status: 404,
                message: 'User not found',
                data: null,
            });
        }

        responseHandle.ok(res, user, 'User retrieved successfully');
    } catch (error) {
        responseHandle.error(res, error);
    }
};

const createNewUser = async (req, res) => {
    const { username, email, fullname, password, address, phoneNumber, group_role } = req.body;

    if (!username || !email || !fullname || !password || !address || !phoneNumber) {
        return res.status(400).json({
            message: 'Invalid data provided. All fields are required.',
            data: null,
        });
    }

    try {
        const existingUser = await userModel.findOne({ where: { username } });
        if (existingUser) {
            return res.status(400).json({
                message: 'Username already exists',
                data: null,
            });
        }

        const existingEmail = await userModel.findOne({ where: { email } });
        if (existingEmail) {
            return res.status(400).json({
                message: 'Email already exists',
                data: null,
            });
        }

        // const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await userModel.create({
            username,
            email,
            fullname,
            password,
            address,
            phoneNumber
        });

        res.status(201).json({
            message: 'User created successfully',
            data: newUser,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Internal Server Error',
            serverMessage: error.message,
        });
    }
};

const updateUser = async (req, res, next) => {
    const { idUser } = req.params; 
    const { body } = req; 

    try {
        const user = await userModel.findByPk(idUser);
        if (!user) {
            return res.status(404).json({
                message: 'User not found',
                data: null,
            });
        }

        if (body.username && body.username !== user.username) {
            const existingUser = await userModel.findOne({ where: { username: body.username } });
            if (existingUser && existingUser.id !== user.id) {
                return res.status(400).json({
                    message: 'Username already exists',
                    data: null,
                });
            }
        }

        if (body.email && body.email !== user.email) {
            const existingEmail = await userModel.findOne({ where: { email: body.email } });
            if (existingEmail && existingEmail.id !== user.id) {
                return res.status(400).json({
                    message: 'Email already exists',
                    data: null,
                });
            }
        }

        if (body.password && body.password) {
            const hashedPassword = await bcrypt.hash(body.password, 10);
            body['password'] = hashedPassword;
        }


        Object.keys(body).forEach(key => {
            if (body[key] !== undefined) {
                user[key] = body[key];
            }
        });

        await user.save();

        res.status(200).json({
            message: 'Update User successfully',
            data: user,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Internal Server Error',
            serverMessage: error.message,
        });
    }
};

const deleteUser = async (req, res) => {
    const {idUser} = req.params;
    try {
        const user = await userModel.findByPk(idUser);

        if (!user) {
            return res.status(404).json({
                message: 'User not found',
                data: null
            });
        }

        await user.destroy();
        
        res.json({
            message: 'Delete User successfully',
            data: null
        })
    } catch (error) {
        res.status(500).json({
            message: 'Internal Server Error',
            serverMessage: error
        })
    }
};

module.exports = {
    getAllUsers,
    getUserById,
    createNewUser,
    updateUser,
    deleteUser
};