import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import HeaderAventura from '../components/HeaderAventura.jsx';
import Footer from '../components/footer.jsx';
import './sala-de-jogo.css';
// Exemplo: import dadoIcon from '../assets/dado.png';

// Função auxiliar para converter string de vida em porcentagem
const getVidaPercentual = (vida) => {
  switch (vida?.toLowerCase()) { // Adiciona toLowerCase para segurança
    case 'baixa': return 25;
    case 'média': return 50; // Atenção ao acento se usar
    case 'media': return 50; // Sem acento
    case 'alta': return 75;
    case 'chefe': return 100;
    default: return 50; // Padrão
  }
};

// Função auxiliar para renderizar a imagem (com fallback)
const renderImagem = (sala) => (
  <div className="imagem-container">
    {sala?.imagem ? ( // Adiciona verificação '?'
      <img src={sala.imagem} alt={`Imagem para ${sala.nome || 'sala'}`} />
    ) : (
      <span className="imagem-fallback-text">Sem Imagem</span> // Texto mais descritivo
    )}
  </div>
);

const SalaDeJogo = () => {
  const { aventuraId } = useParams(); // Pega o ID da aventura da URL
  const navigate = useNavigate();

  const [aventura, setAventura] = useState(null);
  const [salaAtualIndex, setSalaAtualIndex] = useState(0);

  // Efeito para carregar a aventura do localStorage ao montar
  useEffect(() => {
    try {
      const aventurasSalvas = JSON.parse(localStorage.getItem('minhas_aventuras')) || [];
      const aventuraAtual = aventurasSalvas.find(a => a.id === Number(aventuraId));

      if (aventuraAtual && aventuraAtual.salas && aventuraAtual.salas.length > 0) {
        setAventura(aventuraAtual);
      } else {
        alert("Aventura não encontrada ou não possui salas para jogar!");
        navigate('/suas-aventuras');
      }
    } catch (error) {
      console.error("Erro ao carregar a aventura:", error);
      alert("Erro ao carregar dados da aventura.");
      navigate('/suas-aventuras');
    }
  }, [aventuraId, navigate]); // Dependências: Roda se o ID ou navigate mudarem

  // Navega para a próxima sala se não for a última
  const handleAvancarSala = () => {
    if (aventura && salaAtualIndex < aventura.salas.length - 1) {
      setSalaAtualIndex(prevIndex => prevIndex + 1);
    } else {
      console.warn("Tentativa de avançar além da última sala (botão Finalizar deve ser usado).");
    }
  };

  // --- Função MODIFICADA ---
  // Finaliza a aventura e navega para a PÁGINA DE RESULTADOS
  const handleFinalizarAventura = () => {
    console.log("Aventura finalizada. Navegando para resultados...");
    // Navega para a página de resultados da aventura atual
    navigate(`/aventura/${aventuraId}/resultados`);
  }
  // --- FIM DA MODIFICAÇÃO ---

  // Renderiza o conteúdo principal da sala baseado no tipo
  const renderConteudoSala = (sala) => {
    if (!sala) return <p className="loading-sala">Carregando dados da sala...</p>;

    switch (sala.tipo) {
      case 'Enigma':
        return (
          <div className="conteudo-enigma">
            <p className="texto-sala">{sala.enigma || "Enigma não preenchido"}</p>
            {renderImagem(sala)}
            <div className="botoes-grid-enigma">
              <div className="resposta-enigma">{sala.resposta || "Resposta não preenchida"}</div>
              <button className="btn-jogo azul">Revelar</button>
              <button className="btn-jogo dourado">Selecionar Respondente</button>
              {/* Botão Avançar/Finalizar foi movido para fora */}
            </div>
          </div>
        );
      case 'Monstro':
        return (
          <div className="conteudo-monstro">
             <p className="texto-sala">{sala.texto || "Descrição do monstro não preenchida."}</p>
            <div className="monstro-grid">
              <div className="monstro-imagem-container">
                 {renderImagem(sala)}
              </div>
              <div className="monstro-status">
                <div className="vida-monstro-container">
                  <span>Vida do Monstro ({sala.vidaMonstro || 'Média'})</span>
                  <div className="vida-barra">
                    <div
                      className="vida-preenchimento"
                      style={{width: `${getVidaPercentual(sala.vidaMonstro)}%`}}>
                    </div>
                  </div>
                </div>
                <div className="pergunta-nivel">
                  <span>Pergunta de Nível: <strong>2</strong></span> {/* Dado de Exemplo */}
                  <div className="dado-icone">🎲</div>
                </div>
                <div className="turno-jogador">
                  <span>Turno de:</span>
                  <div className="nome-personagem">Personagem 1</div> {/* Dado de Exemplo */}
                  <button className="btn-pular">Pular</button>
                </div>
              </div>
            </div>
             {/* Botão Avançar/Finalizar foi movido para fora */}
          </div>
        );
      case 'Alternativa':
        return (
          <div className="conteudo-alternativa">
            <p className="texto-sala">{sala.texto || "Descrição da alternativa não preenchida."}</p>
            {renderImagem(sala)}
            <div className="botoes-grid-alternativa">
              {/* TODO: Mapear sala.opcoes e torná-los interativos */}
              <button className="btn-opcao-jogo red">Opção 1</button>
              <button className="btn-opcao-jogo yellow">Opção 2</button>
              <button className="btn-jogo azul">Revelar</button>
              <button className="btn-opcao-jogo green">Opção 3</button>
              <button className="btn-opcao-jogo blue">Opção 4</button>
              {/* Botão Avançar/Finalizar foi movido para fora */}
            </div>
          </div>
        );
      default:
        return <p className="error-sala">Tipo de sala desconhecido: {sala.tipo}</p>;
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

  // Garante que temos uma sala para o índice atual (segurança extra)
  const salaAtual = aventura.salas?.[salaAtualIndex];
  const progresso = Array.isArray(aventura.salas) && aventura.salas.length > 0 ? ((salaAtualIndex + 1) / aventura.salas.length) * 100 : 0;
  const isUltimaSala = Array.isArray(aventura.salas) && salaAtualIndex === aventura.salas.length - 1;

  return (
    <div className="sala-de-jogo-page">
      <HeaderAventura />
      <main className="sala-de-jogo-main">
        {/* Barra de Progresso */}
        <div className="progresso-barra-container">
          <div className="progresso-barra-preenchimento" style={{height: `${progresso}%`}}></div>
        </div>

        {/* Painel Central */}
        <div className="sala-painel">
          <h1 className="sala-titulo-aventura">{aventura.titulo || "Aventura Sem Título"}</h1>
          <h2 className="sala-titulo-nome">{salaAtual?.nome || "Carregando Sala..."}</h2>

          {/* Renderiza o conteúdo da sala */}
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
    </div>
  );
};

export default SalaDeJogo;