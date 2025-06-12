const { DataTypes } = require('sequelize');
const sequelize     = require('../../config/database');

const Tarifs = sequelize.define('tarifs', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        tarif_name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'Tarif Name must not be empty',
                }
            },
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'Description must not be empty',
                }
            }
        },
        nominal: {
            type: DataTypes.DECIMAL(12, 0), 
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'Nominal must not be empty',
                },
                min: {
                    args: [0],
                    msg: 'Nominal must be greater than or equal to 0'
                }
            }
        },
        auto: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM('aktif', 'nonaktif'),
            defaultValue: 'aktif',
        },
        deletedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        }
    }, 
    {
        tableName: 'tarifs',
        timestamps: true,
        paranoid: true,
    });

    module.exports = Tarifs;