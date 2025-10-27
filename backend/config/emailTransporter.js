const nodemailer = require('nodemailer');

function createTransporter() {
  if (process.env.EMAIL_PROVIDER === 'gmail') {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
      }
    });
  }

  throw new Error('Provedor de e-mail inválido.'); 
}

module.exports = createTransporter;