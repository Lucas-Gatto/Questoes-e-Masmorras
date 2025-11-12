module.exports = (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Usuário não autenticado' });
  }
  req.user = req.session.user; // garante acesso ao user no controller
  next();
};