const express = require('express');
const router = express.Router();
const { cadastrarUser, loginUser, logoutUser } = require('../controllers/userController');
const { forgotPassword, resetPassword, trocarSenha, buscarAvatar, atualizarAvatar } = require('../controllers/userController');
const autenticar = require('../middleware/ensureAuth');

//Usuário
router.post('/cadastrar', cadastrarUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);

//Recuperação de senha
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

//Trocar senha
router.put('/trocar-senha', trocarSenha);

// Avatar
router.get('/avatar', autenticar, buscarAvatar);
router.put('/avatar', autenticar, atualizarAvatar);

module.exports = router;