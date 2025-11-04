import React from "react";
// Usa estilos da página do mestre via salas-aluno.jsx

const getVidaPercentual = (vidaMonstro) => {
  const map = { Baixa: 33, Média: 66, Alta: 100 };
  return map[vidaMonstro] ?? 66;
};

const SalaMonstro = ({ sala }) => {
    // Se não há dados da sala, mostra carregamento
    if (!sala) {
        return <p className="loading-sala">Carregando dados da sala...</p>;
    }

    return (
        <div className="conteudo-monstro">
          <p className="texto-sala">{sala.texto || "Descrição do monstro não preenchida."}</p>
          <div className="monstro-grid">
            <div className="monstro-imagem-container">
              <div className="imagem-container">
                {sala.imagem ? (
                  <img src={sala.imagem} alt={`Imagem da sala ${sala.nome || ''}`} />
                ) : (
                  <span className="imagem-fallback-text">Imagem não disponível</span>
                )}
              </div>
            </div>
            <div className="monstro-status">
              <div className="vida-monstro-container">
                <span>Vida do Monstro ({sala.vidaMonstro || 'Média'})</span>
                <div className="vida-barra">
                  <div
                    className="vida-preenchimento"
                    style={{ width: `${getVidaPercentual(sala.vidaMonstro)}%` }}
                  ></div>
                </div>
              </div>
              <div className="pergunta-nivel">
                <span>Pergunta de Nível: <strong>2</strong></span>
                <div className="dado-icone">🎲</div>
              </div>
              <div className="turno-jogador">
                <span>Turno de:</span>
                <div className="nome-personagem">Personagem 1</div>
              </div>
              <div className="timer-container-mestre">
                <span>00:30</span>
              </div>
            </div>
          </div>
        </div>
    );
};

export default SalaMonstro;
