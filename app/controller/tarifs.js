const responseHandle = require('../helpers/response.utils');
const tarifModel = require('../models/tarifs');
const { Op }     = require('sequelize');

const getAllTarif = async (req, res, next) => {
    try {
        const page   = parseInt(req.query.page)  || 1;
        const limit  = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const { name, auto, status } = req.query;

        let where = {};
        if (name) {
            where.tarif_name = { [Op.like]: `%${name}%` };
        }
        if (auto) {
            where.auto = auto;
        }
        if (status) {
            where.status = status;
        }

        const result = await tarifModel.findAndCountAll({
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
        }, 'Get Tarif successfully');

    } catch (error) {
        responseHandle.error(res, error);
    }
};

const getTarifById = async (req, res, next) => {
    const { idTarif } = req.params;

    try {
        const tarif = await tarifModel.findByPk(idTarif);
        if (!tarif) {
            return res.status(404).json({
                status: 404,
                message: 'Tarif not found',
                data: null,
            });
        }

        responseHandle.ok(res, tarif, 'Tarif retrieved successfully');
    } catch (error) {
        responseHandle.error(res, error);
    }
}

const createNewTarif = async (req, res) => {
    const { tarif_name, description, nominal, auto } = req.body;

    if (!tarif_name || !description || !nominal || !auto) {
        return res.status(400).json({
            message: 'Invalid data provided. All fields are required.',
            data: null,
        });
    }

    try {
       
        const newTarif = await tarifModel.create({
            tarif_name,
            description,
            nominal,
            auto
        });

        res.status(201).json({
            message: 'Tarif created successfully',
            data: newTarif,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Internal Server Error',
            errorMessage: error.message,
        });
    }
};

const updateTarif = async (req, res, next) => {
    const { idTarif } = req.params; 
    const { body }   = req; 

    try {
        const tarif = await tarifModel.findByPk(idTarif);
        if (!tarif) {
            return res.status(404).json({
                message: 'Tarif not found',
                data: null,
            });
        }

        Object.keys(body).forEach(key => {
            if (body[key] !== undefined) {
                tarif[key] = body[key];
            }
        });

        await tarif.save();

        res.status(200).json({
            message: 'Update Tarif successfully',
            data: tarif,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Internal Server Error',
            serverMessage: error.message,
        });
    }
};

const deleteTarif = async (req, res) => {
    const {idTarif} = req.params;

    try {
        const tarif = await tarifModel.findByPk(idTarif);

        if (!tarif) {
            return res.status(404).json({
                message: 'Tarif not found',
                data: null
            });
        }

        await tarif.destroy();
        
        res.json({
            message: 'Delete Tarif successfully',
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
    getAllTarif,
    getTarifById,
    createNewTarif,
    updateTarif,
    deleteTarif
};
