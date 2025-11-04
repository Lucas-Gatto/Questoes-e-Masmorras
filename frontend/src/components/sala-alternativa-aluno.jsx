import React from "react";
// Usa estilos da página do mestre via salas-aluno.jsx

const SalaAlternativa = ({ sala }) => {
  // Se não há dados da sala, mostra carregamento
  if (!sala) {
    return <p className="loading-sala">Carregando dados da sala...</p>;
  }

  return (
    <div className="conteudo-alternativa">
      <p className="texto-sala">{sala.texto || "Descrição da alternativa não preenchida."}</p>
      <div className="imagem-container">
        {sala.imagem ? (
          <img src={sala.imagem} alt={`Imagem da sala ${sala.nome || ''}`} />
        ) : (
          <span className="imagem-fallback-text">Imagem não disponível</span>
        )}
      </div>
      <div className="botoes-grid-alternativa">
        {(sala.opcoes || []).map((opcao, index) => {
          if (index >= 4) return null;
          const cores = ['red', 'yellow', 'green', 'blue'];
          const corClasse = cores[index % cores.length];
          const textoOpcao = opcao?.texto?.trim() ? opcao.texto : `Opção ${index + 1} (vazio)`;
          const idOpcao = opcao?.id != null ? opcao.id : index + 1;
          return (
            <button
              key={idOpcao}
              className={`btn-opcao-jogo ${corClasse}`}
              title={opcao?.texto || `Opção ${index + 1}`}
            >
              {textoOpcao}
            </button>
          );
        })}
        {Array.from({ length: Math.max(0, 4 - (sala.opcoes?.length || 0)) }).map((_, i) => {
          const index = (sala.opcoes?.length || 0) + i;
          const cores = ['red', 'yellow', 'green', 'blue'];
          const corClasse = cores[index % cores.length];
          return (
            <button key={`placeholder-${index}`} className={`btn-opcao-jogo ${corClasse} placeholder`} disabled>
              Opção {index + 1} (vazio)
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SalaAlternativa;
