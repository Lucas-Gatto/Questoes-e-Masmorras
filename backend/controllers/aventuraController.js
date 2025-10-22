// controllers/AventuraController.js
const Aventura = require("../models/Aventura");

exports.createAventura = async (req, res) => {
  try {
    const aventura = new Aventura({
      ...req.body,
      createdBy: req.user._id,
    });
    await aventura.save();
    res.status(201).json(aventura);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao criar aventura" });
  }
};

exports.listAventuras = async (req, res) => {
  try {
    const aventuras = await Aventura.find({ createdBy: req.user._id });
    res.json(aventuras);
  } catch (err) {
    res.status(500).json({ error: "Erro ao listar aventuras" });
  }
};

exports.updateAventura = async (req, res) => {
  try {
    const aventura = await Aventura.findById(req.params.id);
    if (!aventura) return res.status(404).json({ error: "Aventura não encontrada" });
    
    // Verifica se o usuário logado é o criador
    if (!aventura.createdBy.equals(req.user._id)) 
      return res.status(403).json({ error: "Acesso negado" });

    // Atualiza campos com o que veio do front
    Object.assign(aventura, req.body);

    await aventura.save();
    res.json(aventura);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao atualizar aventura" });
  }
};

exports.getAventuraById = async (req, res) => {
  try {
    const aventura = await Aventura.findById(req.params.id);
    if (!aventura) return res.status(404).json({ error: "Aventura não encontrada" });
    if (!aventura.createdBy.equals(req.user._id)) 
      return res.status(403).json({ error: "Acesso negado" });

    res.json(aventura);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar aventura" });
  }
};

exports.deleteAventura = async (req, res) => {
  try {
    const aventura = await Aventura.findById(req.params.id);
    if (!aventura) return res.status(404).json({ error: "Aventura não encontrada" });
    if (!aventura.createdBy.equals(req.user._id)) return res.status(403).json({ error: "Acesso negado" });
    await aventura.deleteOne();
    res.json({ message: "Aventura deletada" });
  } catch (err) {
    res.status(500).json({ error: "Erro ao deletar aventura" });
  }
};
