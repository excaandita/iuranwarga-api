const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const sequelize = require('../../config/database'); // Sesuaikan dengan path konfigurasi database Anda

const HASH_ROUND = 10;

const User = sequelize.define('User', {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Username must not be empty',
            },
            len: {
                args: [8, 225],
                msg: 'Username length must between 8 - 225 characters',
            },
        },
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Email must not be empty',
            },
            isEmail: {
                msg: 'Email Format is not valid',
            },
        },
        unique: {
            args: true,
            msg: 'Email already registered',
        },
    },
    fullname: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Fullname must not be empty',
            },
        },
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Password must not be empty',
            },
            len: {
                args: [8, 225],
                msg: 'Password length must between 8 - 225 characters',
            },
        },
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Address must not be empty',
            },
        },
    },
    phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Phone Number must not be empty',
            },
            len: {
                args: [8, 225],
                msg: 'Phone Number length must between 8 - 225 characters',
            },
        },
    },
    group_id: { 
        type: DataTypes.INTEGER,
        defaultValue: 1, 
    },
    status: {
        type: DataTypes.ENUM('Y', 'N'),
        defaultValue: 'Y',
    },
    deletedAt: {
        type: DataTypes.DATE,
        allowNull: true,
    }
}, {
    tableName: 'users',
    timestamps: true,
    paranoid: true,
    hooks: {
        beforeCreate: async (user) => {
            user.password = await bcrypt.hash(user.password, HASH_ROUND);
        }
    }
});

// User.addHook('afterValidate', async (user, options) => {
//     const existingUser = await User.findOne({ where: { username: user.username } });
//     if (existingUser) {
//         throw new Error('Username already exists');
//     }
// });

// User.addHook('afterValidate', async (user, options) => {
//     const existingEmail = await User.findOne({ where: { email: user.email } });
//     if (existingEmail) {
//         throw new Error('Email already exists');
//     }
// });

module.exports = User;
