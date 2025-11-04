import React from 'react';
// Usa estilos da página do mestre via salas-aluno.jsx


const SalaEnigma = ({ sala, revelada = false }) => {
  // Se não há dados da sala, mostra carregamento
  if (!sala) {
    return <p className="loading-sala">Carregando dados da sala...</p>;
  }

  return (
    <div className="conteudo-enigma">
      <p className="texto-sala">{sala.enigma || 'Enigma não preenchido'}</p>
      <div className="imagem-container">
        {sala.imagem ? (
          <img src={sala.imagem} alt={`Imagem da sala ${sala.nome || ''}`} />
        ) : (
          <span className="imagem-fallback-text">Imagem não disponível</span>
        )}
      </div>
      <div className="botoes-grid-enigma-aluno">
        <div className={`resposta-enigma ${revelada ? '' : 'borrada'}`}>{sala.resposta || 'Resposta não preenchida'}</div>
      </div>
    </div>
  );
};

export default SalaEnigma;
