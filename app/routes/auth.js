const express = require('express');
const authCon = require('../controller/auth.js')

const router = express.Router();

router.post('/login', authCon.login);

module.exports = router;