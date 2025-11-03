require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Sessao = require('../models/Sessao');

async function run() {
  await connectDB();
  try {
    const sessao = await Sessao.create({
      codigo: 'TESTE123',
      status: 'waiting',
      aventuraSnapshot: { titulo: 'Teste', salas: [] },
      alunos: [{ nome: 'Aluno X', classe: 'bardo' }],
    });
    console.log('Sessão criada:', sessao._id.toString());

    // Incrementa ponto
    const aluno = sessao.alunos.find(a => a.nome === 'Aluno X');
    aluno.pontos = (aluno.pontos || 0) + 1;
    await sessao.save();

    const recarregada = await Sessao.findById(sessao._id);
    const aluno2 = recarregada.alunos.find(a => a.nome === 'Aluno X');
    console.log('Pontos persistidos:', aluno2.pontos);

    // Limpeza
    await Sessao.deleteOne({ _id: sessao._id });
    console.log('Sessão de teste removida.');
  } catch (err) {
    console.error('Falha no teste de pontos:', err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

run();