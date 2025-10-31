import React from "react";
import "./sala-alternativa-aluno.css";

const SalaAlternativa = ({ sala, aventuraTitulo }) => {
  // Se não há dados da sala, mostra carregamento
  if (!sala) {
    return (
      <div className="sala-wrapper">
        <div className="conteudo-central">
          <div className="quadro-transparente">
            <p>Carregando sala...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="sala-wrapper">
      <div className="conteudo-central">
        <div className="quadro-transparente">
          <h1 className="titulo">{aventuraTitulo || "Aventura"}</h1>
          <h2 className="subtitulo">{sala.nome || "Sala"}</h2>
          <p className="texto-placeholder">
            {sala.texto || "Descrição da sala não disponível"}
          </p>
          {/* Renderiza imagem se disponível */}
          {sala.imagem && (
            <div className="imagem-alternativa">
              <img src={sala.imagem} alt={`Imagem da sala ${sala.nome}`} />
            </div>
          )}

          <div className="opcoes-container">
            {/* Mapeia as opções reais da sala */}
            {(sala.opcoes || []).map((opcao, index) => {
              if (index >= 4) return null; // Limita a 4 opções
              
              const cores = ['red', 'yellow', 'green', 'blue'];
              const corClasse = cores[index % cores.length];
              const textoOpcao = opcao?.texto?.trim() ? opcao.texto : `Opção ${index + 1}`;
              
              return (
                <button
                  key={opcao?.id || index}
                  className={`btn-opcao ${corClasse}`}
                  title={opcao?.texto || `Opção ${index + 1}`}
                >
                  {textoOpcao}
                </button>
              );
            })}
            
            {/* Adiciona placeholders se houver menos de 4 opções */}
            {Array.from({ length: Math.max(0, 4 - (sala.opcoes?.length || 0)) }).map((_, i) => {
              const index = (sala.opcoes?.length || 0) + i;
              const cores = ['red', 'yellow', 'green', 'blue'];
              const corClasse = cores[index % cores.length];
              
              return (
                <button
                  key={`placeholder-${index}`}
                  className={`btn-opcao ${corClasse}`}
                  disabled
                >
                  Opção {index + 1}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalaAlternativa;
