const mongoose = require("mongoose");
const { Schema } = mongoose;

const SubPerguntaSchema = new Schema({
  id: Number, // vem do front
  texto: { type: String, required: true },
});

const PerguntaSchema = new Schema({
  id: Number, // de 1 a 6
  subPerguntas: { type: [SubPerguntaSchema], required: true },
});

const SalaSchema = new Schema({
  id: Number, // id local (Date.now())
  nome: { type: String, required: true },
  tipo: { type: String, enum: ["Enigma", "Alternativa", "Monstro"], required: true },
});

const AventuraSchema = new Schema({
  titulo: { type: String, required: true },
  salas: { type: [SalaSchema], required: true },
  perguntas: { type: [PerguntaSchema], required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Aventura", AventuraSchema, 'Aventuras');
