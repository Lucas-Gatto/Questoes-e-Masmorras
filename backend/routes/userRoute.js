const express = require('express');
const router = express.Router();
const { cadastrarUser } = require('../controllers/userController');

router.post('/cadastrar', cadastrarUser);

// router.post('/login', loginUser);

module.exports = router;