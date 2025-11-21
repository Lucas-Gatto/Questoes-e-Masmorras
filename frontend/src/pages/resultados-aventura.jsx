import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import HeaderAventura from '../components/HeaderAventura.jsx';
import Footer from '../components/footer.jsx';
import './resultados-aventura.css';
import API_URL from "../config";

const ResultadosAventura = () => {
  const { aventuraId } = useParams();
  const navigate = useNavigate();
  const [aventura, setAventura] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [shouldEvaluateSite, setShouldEvaluateSite] = useState(true);
  const [jogadores, setJogadores] = useState([]);

  // Carrega os dados da aventura do backend usando o _id da URL
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
          console.error(`Aventura com ID ${aventuraId} não encontrada para exibir resultados.`);
          alert('Erro: Aventura não encontrada.');
          navigate('/suas-aventuras');
          return;
        }
        const data = await res.json();
        setAventura(data);
      } catch (error) {
        console.error('Erro ao carregar dados da aventura para resultados:', error);
        navigate('/suas-aventuras');
      } finally {
        setIsLoading(false);
      }
    };
    carregar();

    // Consulta se deve exibir avaliação do site (só primeira vez)
    (async () => {
      try {
        const sres = await fetch(`${API_URL}/feedback/site/status`, { credentials: 'include' });
        if (sres.ok) {
          const data = await sres.json();
          setShouldEvaluateSite(Boolean(data?.shouldEvaluateSite));
        }
      } catch (_) {
        // silencioso; mantém default true
      }
    })();

    // Carrega jogadores (alunos) e seus pontos da sessão atual (localStorage)
    (async () => {
      try {
        const sessaoLocal = JSON.parse(localStorage.getItem('sessao_atual')) || null;
        const sessaoId = sessaoLocal?.id;
        if (!sessaoId) return; // sem sessão atual
        const resSessao = await fetch(`${API_URL}/sessoes/${sessaoId}`, { credentials: 'include' });
        if (!resSessao.ok) return;
        const sessaoData = await resSessao.json();
        const arrAlunos = Array.isArray(sessaoData?.alunos) ? sessaoData.alunos : [];
        // Ordena por pontos desc, depois por nome
        arrAlunos.sort((a, b) => {
          const pa = Number(a.pontos || 0);
          const pb = Number(b.pontos || 0);
          if (pb !== pa) return pb - pa;
          return String(a.nome || '').localeCompare(String(b.nome || ''));
        });
        setJogadores(arrAlunos);
      } catch (e) {
        // silencioso
      }
    })();
  }, [aventuraId, navigate]);

  const handleEncerrar = () => {
    if (shouldEvaluateSite) {
      navigate('/avaliacao-site');
    } else {
      navigate('/suas-aventuras');
    }
  };

  if (isLoading || !aventura) {
    return (
      <div style={{ /* Estilo carregamento */ }}>
        Carregando resultados da aventura...
      </div>
    );
  }

  return (
    <div className="resultados-page">
      <HeaderAventura />
      <main className="resultados-main">
        <div className="resultados-painel">
          <h2 className="status-concluido">Concluído</h2>
          <h1 className="titulo-aventura-resultados">{aventura.titulo}</h1>
          <p className="descricao-resultados">
            O desempenho dos seus aventureiros foi exemplar!
          </p>

          <div className="tabela-resultados">
            {/* Cabeçalho da Tabela */}
            <div className="tabela-header">
              <div className="tabela-coluna th">Jogadores</div>
              <div className="tabela-coluna th">Pontos</div>
            </div>

            {/* Linhas da Tabela com dados reais de jogadores e pontos */}
            {jogadores.length === 0 ? (
              <div className="tabela-linha">
                <div className="tabela-coluna" style={{ gridColumn: '1 / -1', opacity: 0.8 }}>
                  Nenhum jogador encontrado nesta sessão.
                </div>
              </div>
            ) : (
              jogadores.map((jogador, idx) => (
                <div className="tabela-linha" key={`${jogador.nome}-${idx}`}>
                  <div className="tabela-coluna">{jogador.nome}</div>
                  <div className="tabela-coluna">{Number(jogador.pontos || 0)}</div>
                </div>
              ))
            )}
          </div>

          <button className="btn-jogo vermelho btn-encerrar-resultados" onClick={handleEncerrar}>
            {shouldEvaluateSite ? 'Encerrar e Avaliar o Site' : 'Encerrar'}
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ResultadosAventura;