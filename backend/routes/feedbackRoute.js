const express = require('express');
const router = express.Router();
const ensureAuth = require('../middleware/ensureAuth');
const { sendSiteFeedback, getSiteFeedbackStatus } = require('../controllers/feedbackController');

// Envia avaliação do site (somente professor autenticado)
router.post('/site', ensureAuth, sendSiteFeedback);
router.get('/site/status', ensureAuth, getSiteFeedbackStatus);

module.exports = router;