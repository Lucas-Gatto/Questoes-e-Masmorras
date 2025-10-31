import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import HeaderAventura from '../components/HeaderAventura.jsx';
import Footer from '../components/footer.jsx';
import './resultados-aventura.css';

const ResultadosAventura = () => {
  const { aventuraId } = useParams();
  const navigate = useNavigate();
  const [aventura, setAventura] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Carrega os dados da aventura do backend usando o _id da URL
  useEffect(() => {
    const carregar = async () => {
      try {
        const res = await fetch(`https://questoes-e-masmorras.onrender.com/api/aventuras/${aventuraId}`, { credentials: 'include' });
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
  }, [aventuraId, navigate]);

  // --- DADOS DE EXEMPLO PARA A TABELA ---
  // TODO: Substituir por dados reais quando o backend suportar
  const dadosJogadoresExemplo = [
    { id: 1, nome: 'jogador 1', respondidas: 4, corretas: 3 },
    { id: 2, nome: 'jogador 2', respondidas: 5, corretas: 5 },
    { id: 3, nome: 'jogador 3', respondidas: 6, corretas: 5 },
    { id: 4, nome: 'jogador 4', respondidas: 3, corretas: 3 },
  ];
  // --- FIM DOS DADOS DE EXEMPLO ---

  const handleEncerrar = () => {
    navigate('/suas-aventuras'); // Volta para a lista principal
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
            {/* TODO: Adicionar um campo de descrição à aventura ou usar texto padrão */}
            Norem ipsum dolor sit amet consectetur Norem ipsum dolor sit amet consectetur.
            Norem ipsum dolor sit amet consectetur Norem ipsum dolor sit amet consectetur.
          </p>

          <div className="tabela-resultados">
            {/* Cabeçalho da Tabela */}
            <div className="tabela-header">
              <div className="tabela-coluna th">Jogadores</div>
              <div className="tabela-coluna th">Perguntas Respondidas</div>
              <div className="tabela-coluna th">Respostas Corretas</div>
            </div>

            {/* Linhas da Tabela (com dados de exemplo) */}
            {dadosJogadoresExemplo.map((jogador) => (
              <div className="tabela-linha" key={jogador.id}>
                <div className="tabela-coluna">{jogador.nome}</div>
                <div className="tabela-coluna">{jogador.respondidas}</div>
                <div className="tabela-coluna">{jogador.corretas}</div>
              </div>
            ))}
          </div>

          <button className="btn-jogo vermelho btn-encerrar-resultados" onClick={handleEncerrar}>
            Encerrar Aventura
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ResultadosAventura;