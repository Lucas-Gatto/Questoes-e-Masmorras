const express = require('express');
const router = express.Router();
const ensureAuth = require('../middleware/ensureAuth');
const { sendSiteFeedback } = require('../controllers/feedbackController');

// Envia avaliação do site (somente professor autenticado)
router.post('/site', ensureAuth, sendSiteFeedback);

module.exports = router;