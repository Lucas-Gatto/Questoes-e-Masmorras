const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/aventuraController');
const ensureAuth = require('../middleware/ensureAuth');

router.use(ensureAuth); // protege todas as rotas
router.post('/', ctrl.createAventura);
router.get('/', ctrl.listAventuras);
router.put("/:id", ctrl.updateAventura);
router.get("/:id", ctrl.getAventuraById);
router.delete('/:id', ctrl.deleteAventura);

module.exports = router;
