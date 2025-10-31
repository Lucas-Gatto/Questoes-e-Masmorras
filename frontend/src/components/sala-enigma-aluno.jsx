import React from 'react';
import './sala-enigma.css';


const SalaEnigma = ({ sala, aventuraTitulo }) => {
  // Se não há dados da sala, mostra carregamento
  if (!sala) {
    return (
      <div className="container-sala">
        <div className="conteudo">
          <div className="quadro">
            <p>Carregando sala...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-sala">
      <div className="conteudo">
        <div className="quadro">
          <h1>{aventuraTitulo || "Aventura"}</h1>
          <h2>{sala.nome || "Sala"}</h2>
          <p>
            {sala.enigma || "Enigma não disponível"}
          </p>
          {/* Renderiza imagem se disponível */}
          {sala.imagem && (
            <div className="imagem-enigma">
              <img src={sala.imagem} alt={`Imagem da sala ${sala.nome}`} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SalaEnigma;
