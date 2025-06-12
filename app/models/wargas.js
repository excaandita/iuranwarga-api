const { DataTypes } = require('sequelize');
const sequelize     = require('../../config/database');

const Wargas = sequelize.define('wargas', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        nik: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'NIK must not be empty',
                }
            },
            unique: {
                args: true,
                msg: 'NIK already registered',
            }
        },
        no_kk: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'No KK must not be empty',
                }
            }
        },
        address: {
            type: DataTypes.STRING,
            allowNull: false
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
        status: {
            type: DataTypes.ENUM('aktif', 'pindah', 'meninggal'),
            defaultValue: 'aktif',
        },
        tanggal_masuk: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        tanggal_keluar: {
            type: DataTypes.DATE,
            allowNull: true
        },
        deletedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        }
    }, 
    {
        tableName: 'wargas',
        timestamps: true,
        paranoid: true,
    });

module.exports = Wargas;