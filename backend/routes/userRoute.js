const express = require('express');
const router = express.Router();
const { cadastrarUser, loginUser, logoutUser } = require('../controllers/userController');
const { forgotPassword, resetPassword, trocarSenha } = require('../controllers/userController');

//Usuário
router.post('/cadastrar', cadastrarUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);

//Recuperação de senha
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

//Trocar senha
router.put('/trocar-senha', trocarSenha);

module.exports = router;