const express = require('express');
const router = express.Router();
const { createSessao, getSessaoById, getSessaoByCode, addAlunoByCode, setClasseByCode, advanceSala, startSessao, finishSessao, avaliarSessaoByCode, awardPontoAlunoByBody, revealEnigma, awardPontoAlunoByCode, advanceTurn, advanceTurnByCode, startTurn, startTurnByCode } = require('../controllers/sessaoController');
const ensureAuth = require('../middleware/ensureAuth');

// Rotas do aluno (públicas)
router.get('/by-code/:codigo', getSessaoByCode);
router.post('/by-code/:codigo/alunos', addAlunoByCode);
router.post('/by-code/:codigo/alunos/:nome/classe', setClasseByCode);
router.post('/by-code/:codigo/avaliacao', avaliarSessaoByCode);
router.put('/by-code/:codigo/alunos/ponto', awardPontoAlunoByCode);
router.put('/by-code/:codigo/turn/next', advanceTurnByCode);
router.put('/by-code/:codigo/turn/start', startTurnByCode);

// Rotas do professor (autenticadas)
router.post('/', ensureAuth, createSessao);
router.get('/:id', ensureAuth, getSessaoById);
router.put('/:id/start', ensureAuth, startSessao);
router.put('/:id/advance', ensureAuth, advanceSala);
router.put('/:id/finish', ensureAuth, finishSessao);
router.put('/:id/alunos/ponto', ensureAuth, awardPontoAlunoByBody);
router.put('/:id/reveal-enigma', ensureAuth, revealEnigma);
router.put('/:id/turn/next', ensureAuth, advanceTurn);
router.put('/:id/turn/start', ensureAuth, startTurn);

module.exports = router;