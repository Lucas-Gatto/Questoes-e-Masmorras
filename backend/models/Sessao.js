const mongoose = require('mongoose');

const AlunoSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  classe: { type: String, default: '' },
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
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('Sessao', SessaoSchema);