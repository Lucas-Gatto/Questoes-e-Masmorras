const User = require('../models/User');

const cadastrarUser = async (req, res) => {
  const { email, password, confirmPassword } = req.body;

  try {
    // Validação básica
    if (!email || !password || !confirmPassword) {
      return res.status(400).json({ message: 'Preencha todos os campos' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'As senhas não coincidem' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Email já cadastrado' });
    }

    const user = await User.create({ email, password });

    res.status(201).json({
      message: 'Cadastro realizado com sucesso',
      user: {
        id: user._id,
        email: user.email
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Erro no servidor', error: err.message });
  }
};

module.exports = { cadastrarUser };

