const User = require('../models/User');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const createTransporter = require('../config/emailTransporter');

//Cadastro
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


    const user = await User.create({ email, password });

    res.status(201).json({
      message: 'Cadastro realizado com sucesso',
      user: { id: user._id, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ message: 'Erro no servidor', error: err.message });
  }
};

//Login
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

    //Salva o usuário na sessão
    req.session.user = { _id: user._id, email: user.email };

    res.status(200).json({
      message: 'Login realizado com sucesso!',
      user: req.session.user,
    });
  } catch (err) {
    res.status(500).json({ message: 'Erro no servidor.', error: err.message });
  }
};

//Logout
const logoutUser = (req, res) => {
  req.session.destroy();
  res.json({ message: 'Logout realizado.' });
};

//Esqueci Senha
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    if (!email) return res.status(400).json({ message: 'Informe seu e-mail.' });

    const user = await User.findOne({ email });
    if (!user) {
      //Retorna genérico para segurança
      return res.status(200).json({ message: 'Se este e-mail estiver cadastrado, enviaremos instruções.' });
    }

    //Gera token
    const token = crypto.randomBytes(32).toString('hex');
    user.resetToken = token;
    user.resetTokenExpires = Date.now() + 3600000; // 1h
    await user.save();

    //Criar link de reset
    const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';
    console.log('CLIENT_URL usado para reset:', CLIENT_URL);
    const resetLink = `${CLIENT_URL}/reset-password/${token}`;

    //Criar transporter e enviar e-mail
    const transporter = createTransporter();
    await transporter.sendMail({
      from: `"Equipe QeM" <${process.env.GMAIL_USER}>`,
      to: user.email,
      subject: "Redefinição de senha",
      html: `<p>Olá! Clique <a href="${resetLink}">aqui</a> para redefinir sua senha.</p>`
    });

    res.status(200).json({ message: 'Se este e-mail estiver cadastrado, enviamos instruções.' });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao gerar link.', error: err.message });
  }
};

//Reset Senha
const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password, confirmPassword } = req.body;

  try {
    if (!token || !password || !confirmPassword) {
      return res.status(400).json({ message: 'Preencha todos os campos.' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'As senhas não coincidem.' });
    }

    //Busca o usuário pelo token e verifica se ainda é válido
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpires: { $gt: Date.now() }, //ainda não expirou
    });

    if (!user) {
      return res.status(400).json({ message: 'Token inválido ou expirado.' });
    }

    //Atualiza a senha
    user.password = password; // será criptografada pelo pre('save')
    user.resetToken = undefined;
    user.resetTokenExpires = undefined;
    await user.save();

    res.status(200).json({ message: 'Senha redefinida com sucesso!' });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao redefinir senha.', error: err.message });
  }
};

module.exports = { cadastrarUser, loginUser, logoutUser, forgotPassword, resetPassword };