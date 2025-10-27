import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom'; // useParams para pegar ID da aventura se necessário
import './escolher-classe.css';

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
  },
  bardo: {
    nome: "Bardo",
    descricao: "Música e carisma são suas armas, inspiram aliados e confundem inimigos.",
    imagem: bardoImg,
  },
  guerreiro: {
    nome: "Guerreiro",
    descricao: "Combatentes habilidosos, mestres no uso de armas e armaduras.",
    imagem: guerreiroImg,
  },
};

const EscolherClasse = () => {
  const navigate = useNavigate();

  const [selectedClassKey, setSelectedClassKey] = useState('bardo'); 

  const handleClassSelect = (classKey) => {
    setSelectedClassKey(classKey);
  };

  const handleConfirm = () => {
    // TODO: Lógica futura para salvar a classe escolhida e ir para a próxima tela (SalasAluno?)
    console.log(`Classe selecionada: ${selectedClassKey}`);
    alert(`Classe ${classesInfo[selectedClassKey]?.nome} selecionada! Próxima etapa a implementar.`);
    // Exemplo: navigate(`/aventura/${aventuraId}/jogar-aluno`);
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