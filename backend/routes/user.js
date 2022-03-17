const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');

//post routes because app send datas
router.post('/signup', userController.signup);
router.post('/login', userController.login);

module.exports = router;