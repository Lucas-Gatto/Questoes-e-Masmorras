import React, { useEffect, useMemo, useState } from "react";
import API_URL from "../config";
// Usa estilos da página do mestre via salas-aluno.jsx

// Calcula pontos de vida do monstro conforme número de jogadores e categoria
const getVidaMonstroPontos = (vida, numJogadores) => {
  const v = (vida || '').toLowerCase();
  const n = Math.max(0, Number(numJogadores || 0));
  if (v.includes('baixa')) return Math.floor(n / 2);
  if (v.includes('média') || v.includes('media')) return n;
  if (v.includes('alta')) return n * 2;
  if (v.includes('chefe')) return n * 3;
  return n; // padrão: média
};

const SalaMonstro = ({ sala, currentPlayerName = '—', timerText = '00:30', turnEndsAt = null, numJogadores = 0, monstroVidaAtual = null }) => {
    const myName = useMemo(() => {
      try {
        const s = (sessionStorage.getItem('aluno_nome') || '').trim();
        if (s) return s;
      } catch (_) {}
      return (localStorage.getItem('aluno_nome') || '').trim();
    }, []);
    const isMyTurn = useMemo(() => {
      const a = (myName || '').toLocaleLowerCase();
      const b = (currentPlayerName || '').toLocaleLowerCase();
      return a && b && a === b;
    }, [myName, currentPlayerName]);

    const [nivelPergunta, setNivelPergunta] = useState(2);
    const [hasRolled, setHasRolled] = useState(false);

    // Reseta apenas a permissão de rolar ao mudar de jogador ou iniciar novo turno
    useEffect(() => {
      setHasRolled(false);
    }, [currentPlayerName, turnEndsAt]);

    // Código da sessão para sincronizar valor da rolagem com backend
    const codigoSessao = useMemo(() => {
      const params = new URLSearchParams(window.location.search);
      return params.get("codigo") || localStorage.getItem("sessao_codigo") || "";
    }, []);

    const handleRollDice = async () => {
      if (!isMyTurn || hasRolled) return;
      const roll = Math.floor(Math.random() * 6) + 1; // 1-6
      setNivelPergunta(roll);
      setHasRolled(true);
      // Envia valor da rolagem ao backend para o professor visualizar
      try {
        if (codigoSessao) {
          await fetch(`${API_URL}/sessoes/by-code/${codigoSessao}/monstro/roll`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ valor: roll })
          });
        }
      } catch (_) {
        // silencioso: a rolagem local permanece
      }
    };
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
                <span>
                  {(() => {
                    const vidaTotal = getVidaMonstroPontos(sala.vidaMonstro, numJogadores);
                    const vidaExibida = (monstroVidaAtual != null && Number.isFinite(monstroVidaAtual)) ? Math.min(vidaTotal, Math.max(0, monstroVidaAtual)) : vidaTotal;
                    return `Vida do Monstro (${sala.vidaMonstro || 'Média'}): ${vidaExibida} / ${vidaTotal} ${vidaTotal === 1 ? 'ponto' : 'pontos'}`;
                  })()}
                </span>
                {(() => {
                  const vidaTotal = getVidaMonstroPontos(sala.vidaMonstro, numJogadores);
                  const vidaExibida = (monstroVidaAtual != null && Number.isFinite(monstroVidaAtual)) ? Math.min(vidaTotal, Math.max(0, monstroVidaAtual)) : vidaTotal;
                  return (
                    <div className="vida-barra" style={{ display: 'flex', gap: '2px', alignItems: 'center' }}>
                      {vidaTotal > 0 ? (
                        Array.from({ length: vidaTotal }).map((_, i) => (
                          <div
                            key={i}
                            style={{
                              flex: 1,
                              height: '12px',
                              backgroundColor: i < vidaExibida ? '#dc3545' : '#6c757d',
                              borderRadius: '2px'
                            }}
                          />
                        ))
                      ) : (
                        <div style={{ width: '100%', height: '12px', backgroundColor: '#6c757d', borderRadius: '2px' }} />
                      )}
                    </div>
                  );
                })()}
              </div>
              <div className="pergunta-nivel">
                <span>Pergunta de Nível: <strong>{nivelPergunta}</strong></span>
                <div
                  className="dado-icone"
                  onClick={handleRollDice}
                  title={isMyTurn ? (hasRolled ? 'Você já rolou neste turno' : 'Clique para rolar o dado') : 'Aguarde seu turno para rolar'}
                  role="button"
                  aria-disabled={!isMyTurn || hasRolled}
                  style={{
                    cursor: (!isMyTurn || hasRolled) ? 'not-allowed' : 'pointer',
                    opacity: (!isMyTurn || hasRolled) ? 0.6 : 1
                  }}
                >
                  🎲
                </div>
              </div>
              <div className="turno-jogador">
                <span>Turno de:</span>
                <div className="nome-personagem">{currentPlayerName}</div>
              </div>
              <div className="timer-container-mestre">
                <span>{timerText}</span>
              </div>
            </div>
          </div>
        </div>
    );
};

export default SalaMonstro;
