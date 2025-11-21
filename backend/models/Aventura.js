const mongoose = require("mongoose");
const { Schema } = mongoose;

// Sub-schema para as Sub-perguntas (Perguntas de Rolagem)
const SubPerguntaSchema = new Schema({
  id: Number, // ID gerado pelo frontend (Date.now())
  texto: { type: String, required: true },
});

// Sub-schema para as Perguntas de Rolagem (6 grupos fixos)
const PerguntaSchema = new Schema({
  id: Number, // ID gerado pelo frontend
  subPerguntas: { type: [SubPerguntaSchema], required: true },
});

// Sub-schema para as Opções da sala 'Alternativa'
const OpcaoSchema = new Schema({
  id: Number, // Podemos usar um ID simples (1, 2, 3, 4) ou gerado no front
  // Permite vazio durante edição; validação de conteúdo pode ser feita no front
  texto: { type: String, default: '' },
  // Futuramente: cor: { type: String }, ehCorreta: { type: Boolean }
});

// Sub-schema para as Salas dentro da Aventura
const SalaSchema = new Schema({
  id: Number, // ID local gerado pelo frontend (Date.now())
  nome: { type: String, required: true, default: 'Nova Sala' },
  tipo: { type: String, enum: ["Enigma", "Alternativa", "Monstro"], required: true },
  
  // Campos específicos para Enigma
  enigma: { type: String, default: '' },   // O texto do enigma
  resposta: { type: String, default: '' }, // A resposta do enigma
  
  // Campo de descrição (usado por Monstro e Alternativa)
  texto: { type: String, default: '' },
  
  // Campo específico para Monstro
  vidaMonstro: { type: String, enum: ["Baixa", "Média", "Alta", "Chefe"], default: 'Média' },
  
  // Campo específico para Alternativa, usando o OpcaoSchema
  opcoes: { type: [OpcaoSchema], default: [] }, // Array das 4 opções

  // Indica qual opção é a correta na sala de alternativas
  opcaoCorretaId: { type: Number, default: null },

  // Campo de Imagem (string Base64)
  imagem: { type: String, default: '' },
});

// Schema principal da Aventura
const AventuraSchema = new Schema({
  titulo: { type: String, required: true },
  salas: { type: [SalaSchema], required: true, default: [] }, // Garante que sempre haja um array
  perguntas: { type: [PerguntaSchema], required: true, default: [] }, // Garante que sempre haja um array
  createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Link para o usuário que criou
  // Avaliações agregadas de todas as sessões desta aventura
  avaliacaoMedia: { type: Number, default: 0 },
  avaliacaoCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

// Exporta o modelo principal 'Aventura'
// O terceiro parâmetro ('Aventuras') define o nome da coleção no MongoDB
module.exports = mongoose.model("Aventura", AventuraSchema, 'Aventuras');