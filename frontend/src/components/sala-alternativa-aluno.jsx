import React, { useState, useMemo } from "react";
import API_URL from "../config";
// Usa estilos da página do mestre via salas-aluno.jsx

const SalaAlternativa = ({ sala, revelada = false }) => {
  // Se não há dados da sala, mostra carregamento
  if (!sala) {
    return <p className="loading-sala">Carregando dados da sala...</p>;
  }

  const [respondido, setRespondido] = useState(false);
  const [selecionadaId, setSelecionadaId] = useState(null);

  // Recupera código da sessão e nome do aluno para uso na pontuação
  const { codigoSessao, nomeAluno } = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    const codigo = params.get("codigo") || localStorage.getItem("sessao_codigo") || "";
    const nome = localStorage.getItem("aluno_nome") || "";
    return { codigoSessao: codigo, nomeAluno: nome };
  }, []);

  const awardPontoSeCorreta = async () => {
    try {
      if (!codigoSessao || !nomeAluno) return;
      await fetch(`${API_URL}/sessoes/by-code/${codigoSessao}/alunos/ponto`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nomeAluno })
      });
    } catch (_) {
      // silencioso
    }
  };

  const handleClickOpcao = async (idOpcao) => {
    if (respondido) return;
    setSelecionadaId(idOpcao);
    setRespondido(true);
    const correta = Number(sala?.opcaoCorretaId) === Number(idOpcao);
    if (correta) {
      await awardPontoSeCorreta();
    }
  };

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
          const isCorreta = revelada && Number(sala?.opcaoCorretaId) === Number(idOpcao);
          return (
            <button
              key={idOpcao}
              className={`btn-opcao-jogo ${corClasse} ${respondido && idOpcao !== selecionadaId ? 'disabled-grey' : ''} ${isCorreta ? 'correta' : ''}`}
              title={opcao?.texto || `Opção ${index + 1}`}
              onClick={() => handleClickOpcao(idOpcao)}
              disabled={respondido}
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
