const express = require('express');

const userCon = require('../controller/users.js')

const router = express.Router();

router.get('/', userCon.getAllUsers);
router.get('/:idUser', userCon.getUserById);
router.post('/', userCon.createNewUser);
router.patch('/:idUser', userCon.updateUser);
router.delete('/:idUser', userCon.deleteUser);

module.exports = router;