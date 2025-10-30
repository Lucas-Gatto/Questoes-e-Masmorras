const express = require('express');
const router = express.Router();
const { createSessao, getSessaoById, getSessaoByCode, addAlunoByCode, setClasseByCode, advanceSala, startSessao } = require('../controllers/sessaoController');
const ensureAuth = require('../middleware/ensureAuth');

// Rotas do professor (autenticadas)
router.post('/', ensureAuth, createSessao);
router.get('/:id', ensureAuth, getSessaoById);
router.put('/:id/start', ensureAuth, startSessao);
router.put('/:id/advance', ensureAuth, advanceSala);

// Rotas do aluno (públicas)
router.get('/by-code/:codigo', getSessaoByCode);
router.post('/by-code/:codigo/alunos', addAlunoByCode);
router.post('/by-code/:codigo/alunos/:nome/classe', setClasseByCode);

module.exports = router;