const mongoose = require('mongoose');

const AlunoSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  classe: { type: String, default: '' },
  pontos: { type: Number, default: 0 },
}, { _id: false });

const SalaSnapshotSchema = new mongoose.Schema({
  id: Number,
  nome: String,
  tipo: String,
  enigma: String,
  resposta: String,
  texto: String,
  vidaMonstro: String,
  opcoes: [{ id: Number, texto: String }],
  // Necessário para validação de alternativas no aluno
  opcaoCorretaId: { type: Number, default: null },
  imagem: String,
}, { _id: false });

const SessaoSchema = new mongoose.Schema({
  codigo: { type: String, required: true, unique: true },
  status: { type: String, enum: ['waiting', 'active', 'finished'], default: 'waiting' },
  aventuraSnapshot: {
    titulo: { type: String, required: true },
    salas: [SalaSnapshotSchema],
  },
  currentSalaIndex: { type: Number, default: 0 },
  alunos: [AlunoSchema],
  // Controle de turno: índice do jogador atual e prazo de término do turno
  currentPlayerIndex: { type: Number, default: 0 },
  turnEndsAt: { type: Date, default: null },
  // Período de leitura antes do início do turno
  readingEndsAt: { type: Date, default: null },
  // Flags por sala para revelar resposta do Enigma aos alunos
  enigmaReveladoPorSala: { type: [Boolean], default: [] },
  // Avaliações (média e quantidade)
  avaliacaoMedia: { type: Number, default: 0 },
  avaliacaoCount: { type: Number, default: 0 },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('Sessao', SessaoSchema);