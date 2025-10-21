const User = require('../models/User');
const bcrypt = require('bcrypt');

// Cadastro
const cadastrarUser = async (req, res) => {
  const { email, password, confirmPassword } = req.body;

  try {
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

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashedPassword });

    res.status(201).json({
      message: 'Cadastro realizado com sucesso',
      user: { id: user._id, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ message: 'Erro no servidor', error: err.message });
  }
};

// Login
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: 'Preencha todos os campos.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    const senhaCorreta = await bcrypt.compare(password, user.password);
    if (!senhaCorreta) {
      return res.status(401).json({ message: 'Senha incorreta.' });
    }

    // 🔥 Salva o usuário na sessão
    req.session.user = { _id: user._id, email: user.email };

    res.status(200).json({
      message: 'Login realizado com sucesso!',
      user: req.session.user,
    });
  } catch (err) {
    res.status(500).json({ message: 'Erro no servidor.', error: err.message });
  }
};

// Logout
const logoutUser = (req, res) => {
  req.session.destroy();
  res.json({ message: 'Logout realizado.' });
};

module.exports = { cadastrarUser, loginUser, logoutUser };
