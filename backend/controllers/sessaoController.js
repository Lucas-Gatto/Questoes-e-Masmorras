const Sessao = require('../models/Sessao');

function gerarCodigo(len = 6) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let out = '';
  for (let i = 0; i < len; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

exports.createSessao = async (req, res) => {
  try {
    const { aventuraSnapshot } = req.body;
    if (!aventuraSnapshot || !aventuraSnapshot.titulo || !Array.isArray(aventuraSnapshot.salas)) {
      return res.status(400).json({ message: 'Dados de aventura inválidos para sessão.' });
    }
    let codigo;
    // garante código único
    do {
      codigo = gerarCodigo();
    } while (await Sessao.findOne({ codigo }));

    const sessao = await Sessao.create({
      codigo,
      aventuraSnapshot,
      createdBy: req.user?._id || null,
    });
    const joinUrl = `${req.headers.origin || 'http://localhost:5173'}/entrar-aventura?codigo=${codigo}`;
    res.status(201).json({ id: sessao._id, codigo, joinUrl });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao criar sessão', details: err?.message });
  }
};

exports.getSessaoById = async (req, res) => {
  try {
    const { id } = req.params;
    const sessao = await Sessao.findById(id);
    if (!sessao) return res.status(404).json({ message: 'Sessão não encontrada' });
    res.json(sessao);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao buscar sessão', details: err?.message });
  }
};

exports.getSessaoByCode = async (req, res) => {
  try {
    const { codigo } = req.params;
    const sessao = await Sessao.findOne({ codigo });
    if (!sessao) return res.status(404).json({ message: 'Sessão não encontrada' });
    // alunos e snapshot necessários ao aluno
    res.json({
      id: sessao._id,
      status: sessao.status,
      aventuraSnapshot: sessao.aventuraSnapshot,
      currentSalaIndex: sessao.currentSalaIndex,
      alunos: sessao.alunos,
      codigo: sessao.codigo,
    });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao buscar sessão', details: err?.message });
  }
};

exports.addAlunoByCode = async (req, res) => {
  try {
    const { codigo } = req.params;
    const { nome } = req.body;
    if (!nome || typeof nome !== 'string') return res.status(400).json({ message: 'Nome do aluno obrigatório' });
    const sessao = await Sessao.findOne({ codigo });
    if (!sessao) return res.status(404).json({ message: 'Sessão não encontrada' });
    if (sessao.status === 'finished') return res.status(400).json({ message: 'Sessão encerrada' });
    const existe = sessao.alunos.find(a => a.nome.toLowerCase() === nome.toLowerCase());
    if (!existe) sessao.alunos.push({ nome });
    await sessao.save();
    res.status(200).json({ alunos: sessao.alunos });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao adicionar aluno', details: err?.message });
  }
};

exports.setClasseByCode = async (req, res) => {
  try {
    const { codigo, nome } = req.params;
    const { classe } = req.body;
    if (!classe) return res.status(400).json({ message: 'Classe obrigatória' });
    const sessao = await Sessao.findOne({ codigo });
    if (!sessao) return res.status(404).json({ message: 'Sessão não encontrada' });
    const aluno = sessao.alunos.find(a => a.nome.toLowerCase() === nome.toLowerCase());
    if (!aluno) return res.status(404).json({ message: 'Aluno não encontrado nesta sessão' });
    aluno.classe = classe;
    await sessao.save();
    res.status(200).json({ alunos: sessao.alunos });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao salvar classe', details: err?.message });
  }
};

exports.advanceSala = async (req, res) => {
  try {
    const { id } = req.params;
    const sessao = await Sessao.findById(id);
    if (!sessao) return res.status(404).json({ message: 'Sessão não encontrada' });
    if (sessao.currentSalaIndex < (sessao.aventuraSnapshot?.salas?.length || 0) - 1) {
      sessao.currentSalaIndex += 1;
      sessao.status = 'active';
    } else {
      sessao.status = 'finished';
    }
    await sessao.save();
    res.json({ currentSalaIndex: sessao.currentSalaIndex, status: sessao.status });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao avançar sala', details: err?.message });
  }
};

exports.startSessao = async (req, res) => {
  try {
    const { id } = req.params;
    const sessao = await Sessao.findById(id);
    if (!sessao) return res.status(404).json({ message: 'Sessão não encontrada' });
    sessao.status = 'active';
    sessao.currentSalaIndex = 0;
    await sessao.save();
    res.json({ status: sessao.status, currentSalaIndex: sessao.currentSalaIndex });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao iniciar sessão', details: err?.message });
  }
};