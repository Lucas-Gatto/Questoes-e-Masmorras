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
      enigmaReveladoPorSala: Array.isArray(sessao.enigmaReveladoPorSala) ? sessao.enigmaReveladoPorSala : [],
      currentPlayerIndex: Number(sessao.currentPlayerIndex || 0),
      turnEndsAt: sessao.turnEndsAt || null,
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
    // Inicializa turno
    sessao.currentPlayerIndex = 0;
    const hasAlunos = Array.isArray(sessao.alunos) && sessao.alunos.length > 0;
    sessao.turnEndsAt = hasAlunos ? new Date(Date.now() + 30000) : null;
    await sessao.save();
    res.json({ status: sessao.status, currentSalaIndex: sessao.currentSalaIndex, currentPlayerIndex: sessao.currentPlayerIndex, turnEndsAt: sessao.turnEndsAt });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao iniciar sessão', details: err?.message });
  }
};

// Finaliza a sessão explicitamente (independente do índice atual)
exports.finishSessao = async (req, res) => {
  try {
    const { id } = req.params;
    const sessao = await Sessao.findById(id);
    if (!sessao) return res.status(404).json({ message: 'Sessão não encontrada' });
    const totalSalas = Array.isArray(sessao.aventuraSnapshot?.salas) ? sessao.aventuraSnapshot.salas.length : 0;
    if (totalSalas > 0) {
      sessao.currentSalaIndex = totalSalas - 1;
    }
    sessao.status = 'finished';
    await sessao.save();
    res.json({ status: sessao.status, currentSalaIndex: sessao.currentSalaIndex });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao finalizar sessão', details: err?.message });
  }
};

// Revela resposta do Enigma para a sala atual, persistindo flag
exports.revealEnigma = async (req, res) => {
  try {
    const { id } = req.params;
    const sessao = await Sessao.findById(id);
    if (!sessao) return res.status(404).json({ message: 'Sessão não encontrada' });

    const totalSalas = Array.isArray(sessao.aventuraSnapshot?.salas) ? sessao.aventuraSnapshot.salas.length : 0;
    const idx = Number(sessao.currentSalaIndex || 0);

    // Garante tamanho do array de flags
    if (!Array.isArray(sessao.enigmaReveladoPorSala)) {
      sessao.enigmaReveladoPorSala = [];
    }
    while (sessao.enigmaReveladoPorSala.length < totalSalas) {
      sessao.enigmaReveladoPorSala.push(false);
    }

    // Marca a flag como revelada para a sala atual
    if (idx >= 0 && idx < totalSalas) {
      sessao.enigmaReveladoPorSala[idx] = true;
    }

    await sessao.save();

    res.json({
      currentSalaIndex: sessao.currentSalaIndex,
      enigmaReveladoPorSala: sessao.enigmaReveladoPorSala,
    });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao revelar enigma', details: err?.message });
  }
};

// Registrar avaliação (1 a 5 estrelas) por código e atualizar média incremental
exports.avaliarSessaoByCode = async (req, res) => {
  try {
    const { codigo } = req.params;
    const { estrelas } = req.body;
    const valor = Number(estrelas);
    if (!Number.isFinite(valor) || valor < 1 || valor > 5) {
      return res.status(400).json({ message: 'Estrelas inválidas. Use um valor de 1 a 5.' });
    }

    const sessao = await Sessao.findOne({ codigo });
    if (!sessao) return res.status(404).json({ message: 'Sessão não encontrada' });

    const novoCount = (sessao.avaliacaoCount || 0) + 1;
    const novaMedia = ((sessao.avaliacaoMedia || 0) * (sessao.avaliacaoCount || 0) + valor) / novoCount;
    sessao.avaliacaoCount = novoCount;
    sessao.avaliacaoMedia = novaMedia;
    await sessao.save();

    return res.status(200).json({
      codigo: sessao.codigo,
      avaliacaoMedia: sessao.avaliacaoMedia,
      avaliacaoCount: sessao.avaliacaoCount,
    });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao registrar avaliação', details: err?.message });
  }
};

// Adicionar ponto a um aluno específico por nome (via body)
exports.awardPontoAlunoByBody = async (req, res) => {
  try {
    const { id } = req.params;
    const { nomeAluno } = req.body;
    
    if (!nomeAluno || typeof nomeAluno !== 'string') {
      return res.status(400).json({ message: 'Nome do aluno é obrigatório' });
    }

    const sessao = await Sessao.findById(id);
    if (!sessao) return res.status(404).json({ message: 'Sessão não encontrada' });

    // Encontra o aluno na lista
    const aluno = sessao.alunos.find(a => a.nome.toLowerCase() === nomeAluno.toLowerCase());
    if (!aluno) {
      return res.status(404).json({ message: 'Aluno não encontrado nesta sessão' });
    }

    // Incrementa a pontuação do aluno
    aluno.pontos = (aluno.pontos || 0) + 1;
    
    await sessao.save();
    
    res.status(200).json({ 
      message: `Ponto adicionado para ${aluno.nome}`,
      aluno: {
        nome: aluno.nome,
        pontos: aluno.pontos,
        classe: aluno.classe
      },
      alunos: sessao.alunos
    });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao adicionar ponto', details: err?.message });
  }
};

// Adicionar ponto a um aluno via código da sessão (público)
exports.awardPontoAlunoByCode = async (req, res) => {
  try {
    const { codigo } = req.params;
    const { nomeAluno } = req.body;

    if (!codigo || !nomeAluno || typeof nomeAluno !== 'string') {
      return res.status(400).json({ message: 'Código e nome do aluno são obrigatórios' });
    }

    const sessao = await Sessao.findOne({ codigo });
    if (!sessao) return res.status(404).json({ message: 'Sessão não encontrada' });
    if (sessao.status === 'finished') return res.status(400).json({ message: 'Sessão encerrada' });

    const aluno = sessao.alunos.find(a => a.nome.toLowerCase() === nomeAluno.toLowerCase());
    if (!aluno) return res.status(404).json({ message: 'Aluno não encontrado nesta sessão' });

    aluno.pontos = (aluno.pontos || 0) + 1;
    await sessao.save();

    res.status(200).json({
      message: `Ponto adicionado para ${aluno.nome}`,
      aluno: { nome: aluno.nome, pontos: aluno.pontos, classe: aluno.classe },
      alunos: sessao.alunos,
    });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao adicionar ponto', details: err?.message });
  }
};

// Avança turno para o próximo aluno (professor)
exports.advanceTurn = async (req, res) => {
  try {
    const { id } = req.params;
    const sessao = await Sessao.findById(id);
    if (!sessao) return res.status(404).json({ message: 'Sessão não encontrada' });
    const total = Array.isArray(sessao.alunos) ? sessao.alunos.length : 0;
    if (total === 0) return res.status(400).json({ message: 'Sem alunos na sessão' });
    sessao.currentPlayerIndex = (Number(sessao.currentPlayerIndex || 0) + 1) % total;
    sessao.turnEndsAt = new Date(Date.now() + 30000);
    await sessao.save();
    res.json({ currentPlayerIndex: sessao.currentPlayerIndex, turnEndsAt: sessao.turnEndsAt });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao avançar turno', details: err?.message });
  }
};

// Avança turno por código (aluno, apenas quando timer expirou)
exports.advanceTurnByCode = async (req, res) => {
  try {
    const { codigo } = req.params;
    const sessao = await Sessao.findOne({ codigo });
    if (!sessao) return res.status(404).json({ message: 'Sessão não encontrada' });
    const total = Array.isArray(sessao.alunos) ? sessao.alunos.length : 0;
    if (total === 0) return res.status(400).json({ message: 'Sem alunos na sessão' });
    const now = Date.now();
    const endsAt = sessao.turnEndsAt ? new Date(sessao.turnEndsAt).getTime() : 0;
    // Somente avança se o timer estiver expirado (tolerância de 0.5s)
    if (endsAt && now + 500 >= endsAt) {
      sessao.currentPlayerIndex = (Number(sessao.currentPlayerIndex || 0) + 1) % total;
      sessao.turnEndsAt = new Date(now + 30000);
      await sessao.save();
    }
    res.json({ currentPlayerIndex: sessao.currentPlayerIndex, turnEndsAt: sessao.turnEndsAt });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao avançar turno (código)', details: err?.message });
  }
};