const express = require('express');

const userCon = require('../controller/users.js')

const router = express.Router();

router.get('/', userCon.getAllUsers);
router.post('/', userCon.createNewUser);
router.patch('/:id', userCon.updateUser);

module.exports = router;