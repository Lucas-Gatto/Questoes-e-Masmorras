const createTransporter = require('../config/emailTransporter');

// Envia avaliação do site (professor) por e-mail
// Body esperado: { rating: number(1-5), comentario: string }
exports.sendSiteFeedback = async (req, res) => {
  try {
    const { rating, comentario } = req.body || {};
    const valor = Number(rating);
    if (!Number.isFinite(valor) || valor < 1 || valor > 5) {
      return res.status(400).json({ message: 'Nota inválida. Use um valor de 1 a 5.' });
    }
    if (typeof comentario !== 'string' || comentario.trim().length === 0) {
      return res.status(400).json({ message: 'Comentário é obrigatório.' });
    }

    const professorEmail = req.user?.email || 'desconhecido';
    const transporter = createTransporter();

    const subject = `Feedback do Site - Avaliação do Professor (${valor} estrelas)`;
    const html = `
      <div style="font-family: Arial, sans-serif; line-height: 1.5;">
        <h2>Nova avaliação do site</h2>
        <p><strong>Professor:</strong> ${professorEmail}</p>
        <p><strong>Nota:</strong> ${valor} estrela${valor > 1 ? 's' : ''}</p>
        <p><strong>Comentário:</strong></p>
        <blockquote style="border-left: 4px solid #ddd; margin: 8px 0; padding-left: 12px;">${comentario.replace(/</g, '&lt;')}</blockquote>
        <hr />
        <small>Mensagem enviada automaticamente pelo sistema QeM.</small>
      </div>
    `;

    await transporter.sendMail({
      from: `"Equipe QeM" <${process.env.GMAIL_USER}>`,
      to: 'questoesemasmorras@gmail.com',
      subject,
      html,
    });

    return res.status(200).json({ message: 'Feedback enviado com sucesso.' });
  } catch (err) {
    console.error('[sendSiteFeedback] Falha ao enviar feedback:', err);
    return res.status(500).json({ message: 'Erro ao enviar feedback.', error: err?.message });
  }
};