const userModel = require('../models/users');
const bcrypt    = require('bcryptjs');

const getAllUsers = async (req, res, next) => {
    try {
        // const [data] = await userModel.getAllUser();
        const data = await userModel.findAll();

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

const createNewUser = async (req, res) => {
    const { username, email, fullname, password, address, phoneNumber, group_id } = req.body;

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
            phoneNumber,
            group_id: group_id || 1,
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
}

module.exports = {
    getAllUsers,
    createNewUser,
    updateUser,
    deleteUser
};