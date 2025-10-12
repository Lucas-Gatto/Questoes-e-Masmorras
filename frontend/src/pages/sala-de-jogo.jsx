import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import HeaderAventura from '../components/HeaderAventura.jsx';
import Footer from '../components/footer.jsx';
import './sala-de-jogo.css';

const SalaDeJogo = () => {
  const { aventuraId } = useParams();
  const navigate = useNavigate();

  const [aventura, setAventura] = useState(null);
  const [salaAtualIndex, setSalaAtualIndex] = useState(0);

  useEffect(() => {
    try {
      const aventurasSalvas = JSON.parse(localStorage.getItem('minhas_aventuras')) || [];
      const aventuraAtual = aventurasSalvas.find(a => a.id === Number(aventuraId));

      if (aventuraAtual && aventuraAtual.salas && aventuraAtual.salas.length > 0) {
        setAventura(aventuraAtual);
      } else {
        // Alerta e navegação reativados
        alert("Aventura não encontrada ou não possui salas para jogar!");
        navigate('/suas-aventuras');
      }
    } catch (error) {
      console.error("Erro ao carregar a aventura:", error);
      navigate('/suas-aventuras');
    }
  }, [aventuraId, navigate]);

  const handleAvancarSala = () => {
    if (aventura && salaAtualIndex < aventura.salas.length - 1) {
      setSalaAtualIndex(prevIndex => prevIndex + 1);
    } else {
      alert("Fim da aventura! Parabéns!");
      navigate('/suas-aventuras');
    }
  };
  
  const renderConteudoSala = (sala) => {
    if (!sala) return <p>Carregando dados da sala...</p>;
    
    switch (sala.tipo) {
      case 'Enigma':
        return (
          <div className="conteudo-enigma">
            <p className="texto-sala">{sala.texto || "Qual a quinta heurística de Nielsen?"}</p>
            <div className="imagem-placeholder"><span>EXAMPLE</span></div>
            <div className="botoes-grid-enigma">
              <div className="resposta-enigma">Heurística 5: Prevenção de erros</div>
              <button className="btn-jogo azul">Revelar</button>
              <button className="btn-jogo dourado">Selecionar Respondente</button>
              <button className="btn-jogo vermelho" onClick={handleAvancarSala}>Avançar Sala</button>
            </div>
          </div>
        );
      case 'Monstro':
        return (
          <div className="conteudo-monstro">
             <p className="texto-sala">{sala.texto || "Descrição do monstro e da situação de combate."}</p>
            <div className="monstro-grid">
              <div className="monstro-imagem-container"></div>
              <div className="monstro-status">
                <div className="vida-monstro-container">
                  <span>Vida do Monstro</span>
                  <div className="vida-barra"><div className="vida-preenchimento" style={{width: '80%'}}></div></div>
                </div>
                <div className="pergunta-nivel">
                  <span>Pergunta de Nível: <strong>2</strong></span>
                  <div className="dado-icone">🎲</div>
                </div>
                <div className="turno-jogador">
                  <span>Turno de:</span>
                  <div className="nome-personagem">Personagem 1</div>
                  <button className="btn-pular">Pular</button>
                </div>
              </div>
            </div>
            <button className="btn-jogo vermelho btn-finalizar-aventura" onClick={() => navigate('/suas-aventuras')}>Finalizar Aventura</button>
          </div>
        );
      case 'Alternativa':
        return (
          <div className="conteudo-alternativa">
            <p className="texto-sala">{sala.texto || "Descrição da situação e das escolhas possíveis."}</p>
            <div className="imagem-placeholder"><span>EXAMPLE</span></div>
            <div className="botoes-grid-alternativa">
              <button className="btn-opcao-jogo red">Opção 1</button>
              <button className="btn-opcao-jogo yellow">Opção 2</button>
              <button className="btn-jogo azul">Revelar</button>
              <button className="btn-opcao-jogo green">Opção 3</button>
              <button className="btn-opcao-jogo blue">Opção 4</button>
              <button className="btn-jogo vermelho" onClick={handleAvancarSala}>Avançar Sala</button>
            </div>
          </div>
        );
      default:
        return <p>Tipo de sala desconhecido: {sala.tipo}</p>;
    }
  };

  if (!aventura) {
    return (
      <div style={{ backgroundColor: '#212529', minHeight: '100vh', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        Carregando aventura...
      </div>
    );
  }

  const salaAtual = aventura.salas[salaAtualIndex];
  const progresso = ((salaAtualIndex + 1) / aventura.salas.length) * 100;

  return (
    <div className="sala-de-jogo-page">
      <HeaderAventura />
      <main className="sala-de-jogo-main">
        <div className="progresso-barra-container">
          <div className="progresso-barra-preenchimento" style={{height: `${progresso}%`}}></div>
        </div>
        <div className="sala-painel">
          <h1 className="sala-titulo-aventura">{aventura.titulo}</h1>
          <h2 className="sala-titulo-nome">{salaAtual.nome}</h2>
          {renderConteudoSala(salaAtual)}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SalaDeJogo;