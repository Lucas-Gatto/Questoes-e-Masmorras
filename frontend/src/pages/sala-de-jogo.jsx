import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import HeaderAventura from '../components/HeaderAventura.jsx';
import Footer from '../components/footer.jsx';
import './sala-de-jogo.css';
import API_URL from "../config";
// Exemplo: import dadoIcon from '../assets/dado.png';

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

// Função auxiliar para renderizar a imagem (com fallback para placeholder)
const renderImagem = (sala) => (
  <div className="imagem-container">
    {sala?.imagem ? ( // Adiciona verificação '?'
      <img src={sala.imagem} alt={`Imagem para ${sala.nome || 'sala'}`} />
    ) : (
      // Usa o placeholder do protótipo se não houver imagem
      <div className="imagem-placeholder"><span>EXAMPLE</span></div>
    )}
  </div>
);


const SalaDeJogo = () => {
  const { aventuraId } = useParams(); // Pega o ID da aventura da URL
  const navigate = useNavigate();

  const [aventura, setAventura] = useState(null); // Estado para a aventura carregada
  const [salaAtualIndex, setSalaAtualIndex] = useState(0); // Índice da sala atual
  const [sessaoAtual, setSessaoAtual] = useState(null);
  const [respostaRevelada, setRespostaRevelada] = useState(false); // Controle de revelação da resposta (Enigma)
  const [alunos, setAlunos] = useState([]); // Lista de alunos da sessão
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [turnEndsAt, setTurnEndsAt] = useState(null);
  const [tickNow, setTickNow] = useState(Date.now());
  const [advancing, setAdvancing] = useState(false);
  const [showModalAlunos, setShowModalAlunos] = useState(false); // Controle do modal de seleção de alunos
  const [currentRollValue, setCurrentRollValue] = useState(2);
  const [showModalPergunta, setShowModalPergunta] = useState(false);
  const [textoPerguntaRolagem, setTextoPerguntaRolagem] = useState('');
  const [monstroVidaAtual, setMonstroVidaAtual] = useState(null);

  // Efeito para carregar a aventura do backend ao montar
  useEffect(() => {
    const carregar = async () => {
      try {
        const res = await fetch(`${API_URL}/aventuras/${aventuraId}`, { credentials: 'include' });
        if (res.status === 401) {
          alert('Sua sessão expirou. Faça login novamente.');
          navigate('/');
          return;
        }
        if (!res.ok) {
          alert('Aventura não encontrada ou não possui salas para jogar!');
          navigate('/suas-aventuras');
          return;
        }
        const data = await res.json();
        if (Array.isArray(data.salas) && data.salas.length > 0) {
          setAventura(data);
          setSalaAtualIndex(0);
        } else {
          alert('Aventura não encontrada ou não possui salas para jogar!');
          navigate('/suas-aventuras');
        }
      } catch (error) {
        console.error('Erro ao carregar a aventura do backend:', error);
        alert('Erro ao carregar dados da aventura.');
        navigate('/suas-aventuras');
      }
      // carrega sessão atual se existir
      try {
        const s = JSON.parse(localStorage.getItem('sessao_atual')) || null;
        if (s && s.id) setSessaoAtual(s);
      } catch { }
    };
    carregar();
  }, [aventuraId, navigate]);

  // Atualiza exibição do timer do mestre e carrega alunos ao ter sessão
  useEffect(() => {
    if (!sessaoAtual?.id) return;
    carregarAlunos();
    const idTimer = setInterval(() => setTickNow(Date.now()), 500);
    const idPoll = setInterval(() => carregarAlunos(), 3000);
    return () => { clearInterval(idTimer); clearInterval(idPoll); };
  }, [sessaoAtual?.id]);


  // Avança turno automaticamente quando o timer chegar a zero no mestre
  useEffect(() => {
    if (!sessaoAtual?.id || !turnEndsAt || advancing) return;
    const remaining = new Date(turnEndsAt).getTime() - tickNow;
    if (remaining <= 0) {
      setAdvancing(true);
      fetch(`${API_URL}/sessoes/${sessaoAtual.id}/turn/next`, { method: 'PUT', credentials: 'include' })
        .then(r => r.ok ? r.json() : null)
        .then(data => {
          if (data) {
            setCurrentPlayerIndex(Number(data.currentPlayerIndex || 0));
            setTurnEndsAt(data.turnEndsAt || null);
          }
        })
        .catch(() => {})
        .finally(() => setAdvancing(false));
    }
  }, [tickNow, turnEndsAt, sessaoAtual?.id, advancing]);

  // Reseta a revelação da resposta ao trocar de sala
  useEffect(() => {
    setRespostaRevelada(false);
    // Ao trocar de sala, limpar estado local de vida do monstro para evitar
    // exibir valor antigo (ex.: 0) até a próxima sincronização com backend.
    setMonstroVidaAtual(null);
  }, [salaAtualIndex]);

  // Navega para a próxima sala se não for a última
  const handleAvancarSala = () => {
    if (aventura && salaAtualIndex < aventura.salas.length - 1) {
      setSalaAtualIndex(prevIndex => prevIndex + 1); // Incrementa o índice
      // se houver sessão do professor, sincroniza com backend
      if (sessaoAtual?.id) {
        fetch(`${API_URL}/sessoes/${sessaoAtual.id}/advance`, {
          method: 'PUT',
          credentials: 'include',
        }).catch(() => { });
      }
    } else {
      // Se já está na última sala, não faz nada (botão Finalizar é que age)
      console.warn("Tentativa de avançar além da última sala.");
    }
  };

  // Navega para a tela de resultados ao finalizar
  const handleFinalizarAventura = async () => {
    try {
      // Se houver sessão do professor, marca como finalizada no backend
      if (sessaoAtual?.id) {
        await fetch(`${API_URL}/sessoes/${sessaoAtual.id}/finish`, {
          method: 'PUT',
          credentials: 'include',
        });
      }
    } catch (e) {
      // Falhas não impedem navegação para resultados
      console.warn('Falha ao finalizar sessão no backend:', e);
    }
    console.log("Aventura finalizada. Navegando para resultados...");
    navigate(`/aventura/${aventuraId}/resultados`); // Navega para a rota de resultados
  }

  // Carrega a lista de alunos da sessão atual
  const carregarAlunos = async () => {
    if (!sessaoAtual?.id) return;
    try {
      const res = await fetch(`${API_URL}/sessoes/${sessaoAtual.id}`, {
        credentials: 'include'
      });
      if (res.ok) {
        const data = await res.json();
        setAlunos(Array.isArray(data.alunos) ? data.alunos : []);
        setCurrentPlayerIndex(Number(data.currentPlayerIndex || 0));
        setTurnEndsAt(data.turnEndsAt || null);
        if (data.currentRollValue != null) {
          setCurrentRollValue(Number(data.currentRollValue) || 2);
        }
        if (data.monstroVidaAtual != null) {
          const v = Number(data.monstroVidaAtual);
          setMonstroVidaAtual(Number.isFinite(v) ? v : null);
        }
      }
    } catch (e) {
      console.warn('Erro ao carregar alunos:', e);
    }
  };

  // Revela resposta do Enigma e sincroniza com backend
  const handleRevelarEnigma = async () => {
    setRespostaRevelada(true);
    if (sessaoAtual?.id) {
      try {
        await fetch(`${API_URL}/sessoes/${sessaoAtual.id}/reveal-enigma`, {
          method: 'PUT',
          credentials: 'include',
        });
      } catch (e) {
        // falha não impede UX local
      }
    }
  };

  // Abre o modal de seleção de alunos
  const handleSelecionarRespondente = () => {
    carregarAlunos();
    setShowModalAlunos(true);
  };

  // Seleciona um aluno como respondente e adiciona ponto
  const handleSelecionarAluno = async (nomeAluno) => {
    if (!sessaoAtual?.id) return;
    try {
      const res = await fetch(`${API_URL}/sessoes/${sessaoAtual.id}/alunos/ponto`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ nomeAluno })
      });

      const contentType = res.headers.get('content-type') || '';
      if (res.ok) {
        const data = contentType.includes('application/json') ? await res.json() : { message: await res.text() };
        if (data?.aluno?.nome) {
          alert(`Ponto adicionado para ${data.aluno.nome}! Total: ${data.aluno.pontos} pontos`);
          setShowModalAlunos(false);
          setAlunos(Array.isArray(data.alunos) ? data.alunos : alunos);
        } else {
          alert(typeof data.message === 'string' ? data.message : 'Operação concluída.');
        }
      } else {
        const errorPayload = contentType.includes('application/json') ? await res.json() : { message: await res.text() };
        alert(errorPayload?.message || 'Erro ao adicionar ponto');
      }
    } catch (e) {
      console.error('Erro ao selecionar aluno:', e);
      alert('Erro ao adicionar ponto ao aluno');
    }
  };

  // Resposta correta na Pergunta de Rolagem: pontua e avança turno
  const handlePerguntaRolagemCerta = async () => {
    try {
      const nomeAluno = alunos?.[currentPlayerIndex]?.nome || '';
      const classeAluno = (alunos?.[currentPlayerIndex]?.classe || '').toLowerCase();
      const isGuerreiro = classeAluno.includes('guerreiro');
      if (!sessaoAtual?.id || !nomeAluno) {
        setShowModalPergunta(false);
        return;
      }
      // Adiciona ponto ao jogador do turno
      const resPonto = await fetch(`${API_URL}/sessoes/${sessaoAtual.id}/alunos/ponto`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ nomeAluno })
      });
      if (resPonto.ok) {
        const data = await resPonto.json();
        setAlunos(Array.isArray(data.alunos) ? data.alunos : alunos);
      }
      // Decrementa vida do monstro: 1 ponto normalmente, 2 pontos se classe "Guerreiro"
      try {
        const resVida1 = await fetch(`${API_URL}/sessoes/${sessaoAtual.id}/monstro/vida/decrement`, { method: 'PUT', credentials: 'include' });
        if (resVida1.ok) {
          const vidaData1 = await resVida1.json();
          const v1 = Number(vidaData1?.monstroVidaAtual);
          if (Number.isFinite(v1)) setMonstroVidaAtual(v1);
        }
        if (isGuerreiro) {
          const resVida2 = await fetch(`${API_URL}/sessoes/${sessaoAtual.id}/monstro/vida/decrement`, { method: 'PUT', credentials: 'include' });
          if (resVida2.ok) {
            const vidaData2 = await resVida2.json();
            const v2 = Number(vidaData2?.monstroVidaAtual);
            if (Number.isFinite(v2)) setMonstroVidaAtual(v2);
          }
        }
      } catch (_) { /* silencioso */ }
      // Avança turno automaticamente
      const resTurno = await fetch(`${API_URL}/sessoes/${sessaoAtual.id}/turn/next`, { method: 'PUT', credentials: 'include' });
      if (resTurno.ok) {
        const turnData = await resTurno.json();
        setCurrentPlayerIndex(Number(turnData.currentPlayerIndex || 0));
        setTurnEndsAt(turnData.turnEndsAt || null);
      }
    } catch (_) { /* silencioso */ }
    finally {
      setShowModalPergunta(false);
    }
  };

  // Resposta errada: avança turno sem pontuar nem causar dano
  const handlePerguntaRolagemErrada = async () => {
    try {
      if (!sessaoAtual?.id) {
        setShowModalPergunta(false);
        return;
      }
      const resTurno = await fetch(`${API_URL}/sessoes/${sessaoAtual.id}/turn/next`, { method: 'PUT', credentials: 'include' });
      if (resTurno.ok) {
        const turnData = await resTurno.json();
        setCurrentPlayerIndex(Number(turnData.currentPlayerIndex || 0));
        setTurnEndsAt(turnData.turnEndsAt || null);
      }
    } catch (_) { /* silencioso */ }
    finally {
      setShowModalPergunta(false);
    }
  };

  // Renderiza o conteúdo principal da sala baseado no tipo
  const renderConteudoSala = (sala) => {
    // Segurança: Retorna mensagem se a sala for nula/indefinida
    if (!sala) return <p className="loading-sala">Carregando dados da sala...</p>;

    switch (sala.tipo) {
      // --- Layout para ENIGMA ---
      case 'Enigma':
        return (
          <div className="conteudo-enigma">
            <p className="texto-sala">{sala.enigma || "Enigma não preenchido"}</p>
            {renderImagem(sala)} {/* Renderiza imagem ou placeholder */}
            <div className="botoes-grid-enigma">
              <div className={`resposta-enigma ${respostaRevelada ? '' : 'borrada'}`}>{sala.resposta || "Resposta não preenchida"}</div>
              <button className="btn-jogo azul" onClick={handleRevelarEnigma} disabled={respostaRevelada}>Revelar</button>
              <button className="btn-jogo dourado" onClick={handleSelecionarRespondente}>Selecionar Respondente</button>
              {/* Botão Avançar/Finalizar foi movido para fora */}
            </div>
            &nbsp;
            <div className="turno-jogador">
              {/* TODO: Lógica futura para definir o jogador da vez */}
              <span>Turno de:</span>
              <div className="nome-personagem">{alunos?.[currentPlayerIndex]?.nome || '—'}</div>
              <button className="btn-pular" onClick={async () => {
                if (!sessaoAtual?.id) return;
                try {
                  const res = await fetch(`${API_URL}/sessoes/${sessaoAtual.id}/turn/next`, { method: 'PUT', credentials: 'include' });
                  if (res.ok) {
                    const data = await res.json();
                    setCurrentPlayerIndex(Number(data.currentPlayerIndex || 0));
                    setTurnEndsAt(data.turnEndsAt || null);
                  }
                } catch (e) { /* silencioso */ }
              }}>Pular</button>
            </div>
            <div className="timer-container-mestre">
              <span>{(() => {
                if (!turnEndsAt) return '—';
                const ms = Math.max(0, new Date(turnEndsAt).getTime() - tickNow);
                const s = Math.ceil(ms / 1000);
                const mm = String(Math.floor(s / 60)).padStart(2, '0');
                const ss = String(s % 60).padStart(2, '0');
                return `${mm}:${ss}`;
              })()}</span>
            </div>
          </div>
        );
      // --- Layout para MONSTRO ---
      case 'Monstro':
        return (
          <div className="conteudo-monstro">
            <p className="texto-sala">{sala.texto || "Descrição do monstro não preenchida."}</p>
            <div className="monstro-grid">
              <div className="monstro-imagem-container">
                {renderImagem(sala)} {/* Renderiza imagem ou placeholder */}
              </div>
              <div className="monstro-status">
                <div className="vida-monstro-container">
                  <span>
                    {(() => {
                      const totalJogadores = Array.isArray(alunos) ? alunos.length : 0;
                      const vidaTotal = getVidaMonstroPontos(sala.vidaMonstro, totalJogadores);
                      const vidaExibida = monstroVidaAtual != null ? Math.min(vidaTotal, Math.max(0, monstroVidaAtual)) : vidaTotal;
                      return `Vida do Monstro (${sala.vidaMonstro || 'Média'}): ${vidaExibida} / ${vidaTotal} ${vidaTotal === 1 ? 'ponto' : 'pontos'}`;
                    })()}
                  </span>
                  {(() => {
                    const totalJogadores = Array.isArray(alunos) ? alunos.length : 0;
                    const vidaTotal = getVidaMonstroPontos(sala.vidaMonstro, totalJogadores);
                    const vidaExibida = monstroVidaAtual != null ? Math.min(vidaTotal, Math.max(0, monstroVidaAtual)) : vidaTotal;
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
                <div className="pergunta-nivel-professor"
                onClick={() => {
                      // Ao abrir modal, sorteia uma pergunta pelo nível atual
                      const nivel = Number(currentRollValue || 2);
                      const grupos = Array.isArray(aventura?.perguntas) ? aventura.perguntas : [];
                      const idx = Math.max(0, Math.min((grupos.length || 1) - 1, nivel - 1));
                      const grupo = grupos[idx];
                      const sub = Array.isArray(grupo?.subPerguntas) ? grupo.subPerguntas : [];
                      let texto = `Nenhuma pergunta de rolagem cadastrada para nível ${nivel}.`;
                      if (sub.length > 0) {
                        const sorteada = sub[Math.floor(Math.random() * sub.length)];
                        texto = (sorteada?.texto || '').trim() || `Pergunta vazia (nível ${nivel}).`;
                      }
                      setTextoPerguntaRolagem(texto);
                      setShowModalPergunta(true);
                    }}
                    role="button"
                    title="Abrir Pergunta de Rolagem"
                    style={{ cursor: 'pointer' }}
                    >
                  <span>
                    Pergunta de Nível: <strong>{currentRollValue}</strong>
                  </span>
                </div>
                <div className="turno-jogador">
                  {/* TODO: Lógica futura para definir o jogador da vez */}
                  <span>Turno de:</span>
                  <div className="nome-personagem">{alunos?.[currentPlayerIndex]?.nome || '—'}</div>
                  <button className="btn-pular" onClick={async () => {
                    if (!sessaoAtual?.id) return;
                    try {
                      const res = await fetch(`${API_URL}/sessoes/${sessaoAtual.id}/turn/next`, { method: 'PUT', credentials: 'include' });
                      if (res.ok) {
                        const data = await res.json();
                        setCurrentPlayerIndex(Number(data.currentPlayerIndex || 0));
                        setTurnEndsAt(data.turnEndsAt || null);
                      }
                    } catch (e) { /* silencioso */ }
                  }}>Pular</button>
                </div>
                {/* Adiciona Timer aqui se necessário */}
                <div className="timer-container-mestre">
                  <span>{(() => {
                    if (!turnEndsAt) return '—';
                    const ms = Math.max(0, new Date(turnEndsAt).getTime() - tickNow);
                    const s = Math.ceil(ms / 1000);
                    const mm = String(Math.floor(s / 60)).padStart(2, '0');
                    const ss = String(s % 60).padStart(2, '0');
                    return `${mm}:${ss}`;
                  })()}</span>
                </div>
              </div>
            </div>
            {/* Botão Avançar/Finalizar foi movido para fora */}
          </div>
        );
      // --- Layout para ALTERNATIVA (Com textos reais nos botões) ---
      case 'Alternativa':
        return (
          <div className="conteudo-alternativa">
            <p className="texto-sala">{sala.texto || "Descrição da alternativa não preenchida."}</p>
            {renderImagem(sala)} {/* Renderiza imagem ou placeholder */}
            <div className="botoes-grid-alternativa">
              {/* Mapeia as opções REAIS da sala */}
              {(sala.opcoes || []).map((opcao, index) => {
                // Garante que temos 4 opções visuais, mesmo que menos estejam salvas
                if (index >= 4) return null; // Limita a 4 botões visuais

                const cores = ['red', 'yellow', 'green', 'blue'];
                const corClasse = cores[index % cores.length];
                // Usa o texto real da opção salva, ou um placeholder se vazio/não existir
                const textoOpcao = opcao?.texto?.trim() ? opcao.texto : `Opção ${index + 1} (vazio)`;
                const idOpcao = opcao?.id != null ? opcao.id : index + 1; // Garante um ID
                const isCorreta = respostaRevelada && sala?.opcaoCorretaId === idOpcao; // destaca se revelado e id bate

                return (
                  <button
                    key={idOpcao}
                    className={`btn-opcao-jogo ${corClasse} ${isCorreta ? 'correta' : ''}`}
                    // onClick={() => handleAlgumaAcaoProfessor(idOpcao)} // Ação futura do professor
                    title={opcao?.texto || `Opção ${index + 1}`} // Mostra texto completo no hover
                  >
                    {textoOpcao} {/* Exibe o texto real ou fallback */}
                  </button>
                );
              })}
              {/* Adiciona placeholders se houver menos de 4 opções salvas */}
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

              {/* Mantém o botão Revelar */}
              <button className="btn-jogo azul" onClick={handleRevelarEnigma} disabled={respostaRevelada}>Revelar</button>

              {/* Mensagem se não houver opções */}
              {(!sala?.opcoes || sala.opcoes.length === 0) && (
                <p className="sem-opcoes-mensagem">Nenhuma opção configurada.</p>
              )}
              {/* Botão Avançar foi movido para fora */}
            </div>
          </div>
        );
      // --- FIM DO LAYOUT ALTERNATIVA ---
      default:
        // Caso o tipo seja inválido ou inesperado
        return <p className="error-sala">Erro: Tipo de sala desconhecido encontrado ({sala.tipo})</p>;
    }
  };

  // --- Renderização Principal ---

  // Tela de carregamento enquanto 'aventura' é nulo
  if (!aventura) {
    return (
      <div style={{ backgroundColor: '#212529', minHeight: '100vh', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        Carregando aventura... (Verifique o console F12)
      </div>
    );
  }

  // Define a sala atual com segurança (usando optional chaining)
  const salaAtual = aventura.salas?.[salaAtualIndex];
  // Calcula progresso e se é a última sala com segurança
  const progresso = Array.isArray(aventura.salas) && aventura.salas.length > 0 ? ((salaAtualIndex + 1) / aventura.salas.length) * 100 : 0;
  const isUltimaSala = Array.isArray(aventura.salas) && aventura.salas.length > 0 && salaAtualIndex === aventura.salas.length - 1;

  return (
    <div className="sala-de-jogo-page">
      <HeaderAventura />
      <main className="sala-de-jogo-main">
        {/* Barra de Progresso */}
        <div className="progresso-barra-container">
          <div className="progresso-barra-preenchimento" style={{ height: `${progresso}%` }}></div>
        </div>

        {/* Painel Central */}
        <div className="sala-painel">
          <h1 className="sala-titulo-aventura">{aventura.titulo || "Aventura Sem Título"}</h1>
          <h2 className="sala-titulo-nome">{salaAtual?.nome || "Carregando Sala..."}</h2>

          {/* Renderiza o conteúdo da sala atual */}
          {salaAtual ? renderConteudoSala(salaAtual) : <p className="loading-sala">Carregando sala...</p>}

          {/* Botão Condicional de Navegação (Avançar/Finalizar) */}
          <div className="botoes-navegacao-sala">
            {isUltimaSala ? (
              // Última sala: Botão Finalizar Aventura
              <button className="btn-jogo vermelho btn-finalizar-aventura-bottom" onClick={handleFinalizarAventura}>
                Finalizar Aventura
              </button>
            ) : (
              // Qualquer outra sala: Botão Avançar Sala
              <button className="btn-jogo vermelho btn-avancar-sala-bottom" onClick={handleAvancarSala} disabled={!salaAtual}>
                Avançar Sala
              </button>
            )}
          </div>
        </div>
      </main>
      <Footer />

      {/* Modal de Seleção de Alunos */}
      {showModalAlunos && (
        <div className="modal-overlay" onClick={() => setShowModalAlunos(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Selecionar Respondente</h3>
              <button className="modal-close" onClick={() => setShowModalAlunos(false)}>×</button>
            </div>
            <div className="modal-body">
              {alunos.length === 0 ? (
                <p>Nenhum aluno encontrado na sessão.</p>
              ) : (
                <div className="alunos-list">
                  {alunos.map((aluno, index) => (
                    <div key={index} className="aluno-item" onClick={() => handleSelecionarAluno(aluno.nome)}>
                      <span className="aluno-nome">{aluno.nome}</span>
                      <span className="aluno-pontos">{aluno.pontos || 0} pontos</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal de Pergunta de Rolagem (mesmo estilo do SelecionarRespondente) */}
      {showModalPergunta && (
        <div className="modal-overlay" onClick={() => setShowModalPergunta(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Pergunta de Nível {currentRollValue}</h3>
              <button className="modal-close" onClick={() => setShowModalPergunta(false)}>×</button>
            </div>
            <div className="modal-body">
              <p style={{ whiteSpace: 'pre-wrap' }}>{textoPerguntaRolagem || '—'}</p>
              <div style={{ display: 'inline-flex', gap: '12px', marginTop: '12px'}}>
                <button className="btn-jogo verde" onClick={handlePerguntaRolagemCerta} title="Responder certo">
                  ✅ Certo
                </button>
                <button className="btn-jogo vermelho" onClick={handlePerguntaRolagemErrada} title="Responder errado">
                  ❌ Errado
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalaDeJogo;