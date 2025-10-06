const User = require('../models/User');
const bcrypt = require('bcrypt');

//Cadastro
const cadastrarUser = async (req, res) => {
  const { email, password, confirmPassword } = req.body;

  try {
    //Validação básica
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

//Login
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    //Validação básica
    if (!email || !password) {
      return res.status(400).json({ message: 'Preencha todos os campos.' });
    }

    //Verifica se o usuário existe
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    //Compara a senha
    const senhaCorreta = await bcrypt.compare(password, user.password);
    if (!senhaCorreta) {
      return res.status(401).json({ message: 'Senha incorreta.' });
    }

    //Login bem-sucedido
    res.status(200).json({
      message: 'Login realizado com sucesso!',
      user: {
        id: user._id,
        email: user.email
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Erro no servidor.', error: err.message });
  }
};

module.exports = { cadastrarUser, loginUser };

