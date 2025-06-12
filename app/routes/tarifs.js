const express = require('express');
const router  = express.Router();

const tarifCon = require('../controller/tarifs.js')

router.get('/',             tarifCon.getAllTarif);
router.get('/:idTarif',     tarifCon.getTarifById);
router.post('/',            tarifCon.createNewTarif);
router.patch('/:idTarif',   tarifCon.updateTarif);
router.delete('/:idTarif',  tarifCon.deleteTarif);

module.exports = router;