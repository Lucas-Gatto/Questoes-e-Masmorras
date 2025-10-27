const express = require('express');
const router = express.Router();
const { cadastrarUser, loginUser, logoutUser } = require('../controllers/userController');
const { forgotPassword, resetPassword } = require('../controllers/userController');

//Usuário
router.post('/cadastrar', cadastrarUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);

//Recuperação de senha
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

module.exports = router;