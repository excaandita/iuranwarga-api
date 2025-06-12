const responseHandle = require('../helpers/response.utils');
const wargaModel = require('../models/wargas');
const { Op }     = require('sequelize');

const getAllWarga = async (req, res, next) => {
    try {
        const page   = parseInt(req.query.page)  || 1;
        const limit  = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const { name, address } = req.query;

        let where = {};
        if (name) {
            where.name = { [Op.like]: `%${name}%` };
        }
        if (address) {
            where.address = { [Op.like]: `%${address}%` };
        }

        const result = await wargaModel.findAndCountAll({
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
        }, 'Get warga successfully');

    } catch (error) {
        responseHandle.error(res, error);
    }
};

const getWargaById = async (req, res, next) => {
    const { idWarga } = req.params;

    try {
        const warga = await wargaModel.findByPk(idWarga);
        if (!warga) {
            return res.status(404).json({
                status: 404,
                message: 'Warga not found',
                data: null,
            });
        }

        responseHandle.ok(res, warga, 'Warga retrieved successfully');
    } catch (error) {
        responseHandle.error(res, error);
    }
}

const createNewWarga = async (req, res) => {
    const { name, nik, no_kk, address, phoneNumber, status, tanggal_masuk, tanggal_keluar } = req.body;

    if (!name || !nik || !no_kk || !address|| !phoneNumber) {
        return res.status(400).json({
            message: 'Invalid data provided. All fields are required.',
            data: null,
        });
    }

    try {
        const existingNIK = await wargaModel.findOne({ where: { nik } });
        if (existingNIK) {
            return res.status(400).json({
                message: 'NIK already exists',
                data: null,
            });
        }

        const newWarga = await wargaModel.create({
            name,
            nik,
            no_kk,
            address,
            phoneNumber,
            status,
            tanggal_masuk,
            tanggal_keluar
        });

        res.status(201).json({
            message: 'Warga created successfully',
            data: newWarga,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Internal Server Error',
            errorMessage: error.message,
        });
    }
};

const updateWarga = async (req, res, next) => {
    const { idWarga } = req.params; 
    const { body }   = req; 

    try {
        const warga = await wargaModel.findByPk(idWarga);
        if (!warga) {
            return res.status(404).json({
                message: 'Warga not found',
                data: null,
            });
        }

        if (body.nik && body.nik !== warga.nik) {
            const existingWarga = await wargaModel.findOne({ where: { nik: body.nik } });
            if (existingWarga && existingWarga.id !== warga.id) {
                return res.status(400).json({
                    message: 'NIK already exists',
                    data: null,
                });
            }
        }

        Object.keys(body).forEach(key => {
            if (body[key] !== undefined) {
                warga[key] = body[key];
            }
        });

        await warga.save();

        res.status(200).json({
            message: 'Update Warga successfully',
            data: warga,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Internal Server Error',
            serverMessage: error.message,
        });
    }
};

const deleteWarga = async (req, res) => {
    const {idWarga} = req.params;

    try {
        const warga = await wargaModel.findByPk(idWarga);

        if (!warga) {
            return res.status(404).json({
                message: 'Warga not found',
                data: null
            });
        }

        await warga.destroy();
        
        res.json({
            message: 'Delete Warga successfully',
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
    getAllWarga,
    getWargaById,
    createNewWarga,
    updateWarga,
    deleteWarga
};
