const express = require('express');
const router  = express.Router();

const wargaCon = require('../controller/wargas.js')

router.get('/',             wargaCon.getAllWarga);
router.get('/:idWarga',     wargaCon.getWargaById);
router.post('/',            wargaCon.createNewWarga);
router.patch('/:idWarga',   wargaCon.updateWarga);
router.delete('/:idWarga',  wargaCon.deleteWarga);

module.exports = router;