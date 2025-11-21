import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './escolher-classe.css';
import API_URL from "../config";
import { toast } from "../contexts/toastService.js";

// --- Imagens das Classes (ajuste os caminhos/nomes) ---
import magoImg from '../assets/mago.png'; // Exemplo
import bardoImg from '../assets/bardo.png'; // Exemplo
import guerreiroImg from '../assets/guerreiro.png'; // Exemplo
// --- FIM Imagens ---

// --- Dados de Exemplo das Classes ---
const classesInfo = {
  mago: {
    nome: "Mago",
    descricao: "Mestres das artes arcanas, conjuram magias poderosas.",
    imagem: magoImg,
    habilidadeTitulo: "Manipulação Temporal",
    habilidade: "Com o uso de magias antigas, o Mago aumenta seu tempo disponível para responder enigmas e perguntas de rolagens.",
  },
  bardo: {
    nome: "Bardo",
    descricao: "Música e carisma são suas armas, inspiram aliados e confundem inimigos.",
    imagem: bardoImg,
    habilidadeTitulo: "Distração Musical",
    habilidade: "O Bardo distrai o monstro e consegue rolar seu dado de perguntas de rolagem uma vez adicional e deve aceitar o novo resultado.",
  },
  guerreiro: {
    nome: "Guerreiro",
    descricao: "Combatentes habilidosos, mestres no uso de armas e armaduras.",
    imagem: guerreiroImg,
    habilidadeTitulo: "Força de Mil Homens",
    habilidade: "Entre pancadas poderosas, o Guerreiro causa um ponto de dano adicional em monstros se responder corretamente sua pergunta de rolagem.",
  },
};

const EscolherClasse = () => {
  const navigate = useNavigate();
  const show = (msg, opts) => toast.show(msg, opts);

  const [selectedClassKey, setSelectedClassKey] = useState('bardo'); 

  const handleClassSelect = (classKey) => {
    setSelectedClassKey(classKey);
  };

    const handleConfirm = async () => {
    const params = new URLSearchParams(window.location.search);
    const codigo = params.get('codigo');
    const nome = decodeURIComponent(params.get('nome') || '');
    const classe = selectedClassKey;
    if (!codigo || !nome) {
      show('Sessão inválida. Volte ao link da aventura.', { type: 'error' });
      return;
    }
    try {
      const res = await fetch(`${API_URL}/sessoes/by-code/${codigo}/alunos/${encodeURIComponent(nome)}/classe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ classe }),
      });
      if (!res.ok) {
        const data = await res.json();
        show(data?.message || 'Erro ao salvar classe', { type: 'error' });
        return;
      }
      show(`Classe ${classesInfo[selectedClassKey]?.nome} selecionada!`, { type: 'success' });
      navigate(`/aguardar-inicio?codigo=${codigo}&nome=${encodeURIComponent(nome)}`);
    } catch (err) {
      show('Erro ao salvar classe', { type: 'error' });
    }
  };

  const selectedClassData = classesInfo[selectedClassKey];

  return (
    <div className="escolher-classe-page">
      <main className="escolher-classe-main">
        <div className="escolher-classe-painel">
          {/* Títulos */}
          <h1 className="titulo-aventura-escolha">
            {/* TODO: Carregar nome real da aventura */}
            TITULO DA AVENTURA
          </h1>
          <h2 className="titulo-escolha">Escolha sua Classe</h2>

          {/* Seleção de Classes */}
          <div className="classes-container">
            {Object.keys(classesInfo).map((key) => (
              <div
                key={key}
                className={`classe-item ${selectedClassKey === key ? 'selected' : ''}`}
                onClick={() => handleClassSelect(key)}
              >
                <img
                  src={classesInfo[key].imagem}
                  alt={classesInfo[key].nome}
                  className="classe-imagem"
                />
              </div>
            ))}
          </div>

          {/* Informações da Classe Selecionada e Botão */}
          {selectedClassData && (
            <div className="info-classe-container">
              <div className="nome-classe-display">{selectedClassData.nome}</div>
              <div className="descricao-classe-display">
                {selectedClassData.descricao}
              </div>
              {/* Habilidade da Classe */}
              {selectedClassData.habilidade && (
                <div className="habilidade-classe-display">
                  <strong>{selectedClassData.habilidadeTitulo || 'Habilidade'}</strong>
                  <div>{selectedClassData.habilidade}</div>
                </div>
              )}
              <button className="btn-confirmar-escolha" onClick={handleConfirm}>
                Confirmar Escolha
              </button>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default EscolherClasse;