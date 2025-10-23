import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import HeaderAventura from '../components/HeaderAventura.jsx';
import Footer from '../components/footer.jsx';
import playIcon from '../assets/play.png';
import './iniciar-aventura.css';

const IniciarAventura = () => {
  // --- 👇 CONSOLE.LOG ADICIONADO AQUI 👇 ---
  console.log("Componente IniciarAventura começou a renderizar.");
  // --- FIM DA ADIÇÃO ---

  const { aventuraId } = useParams();
  const navigate = useNavigate();
  const [aventura, setAventura] = useState(null);

  // Efeito para carregar dados da aventura
  useEffect(() => {
    console.log(`[IniciarAventura useEffect] Carregando dados para aventura ID: ${aventuraId}`); // Log
    try {
      const aventurasSalvas = JSON.parse(localStorage.getItem('minhas_aventuras')) || [];
      const aventuraAtual = aventurasSalvas.find(a => a.id === Number(aventuraId));

      if (aventuraAtual) {
        console.log("[IniciarAventura useEffect] Aventura encontrada:", aventuraAtual); // Log
        setAventura(aventuraAtual);
      } else {
        console.warn(`[IniciarAventura useEffect] Aventura com ID ${aventuraId} não encontrada.`); // Log
        alert("Aventura não encontrada!");
        navigate('/suas-aventuras');
      }
    } catch (error) {
      console.error("Erro ao carregar dados da aventura em IniciarAventura:", error);
      navigate('/suas-aventuras');
    }
  }, [aventuraId, navigate]);

  // Função para navegar para a tela de jogo
  const handleStartGame = () => {
    if (aventura) {
      console.log(`Iniciando a aventura "${aventura.titulo}"... Navegando para /aventura/${aventura.id}/jogar`); // Log
      navigate(`/aventura/${aventura.id}/jogar`);
    } else {
       console.error("handleStartGame chamado, mas 'aventura' é nula."); // Log de erro
    }
  };

  // Tela de carregamento
  if (!aventura) {
    return (
        <div style={{ backgroundColor: '#212529', minHeight: '100vh', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            Carregando lobby da aventura... (Verifique o console F12)
        </div>
    );
  }

  // Renderização principal
  return (
    <div className="iniciar-aventura-page">
      <HeaderAventura />
      <main className="iniciar-aventura-main">
        <div className="iniciar-painel">
          <h1 className="aventura-titulo-iniciar">{aventura.titulo}</h1>

          <div className="conteudo-conexao">
            <div className="qr-code-placeholder">
              <span>QR Code Aqui</span>
            </div>
            <div className="info-conexao">
              <p>Ou acesse pelo link:</p>
              <div className="link-acesso">
                www.site.com/{aventura.id} {/* Exibe o ID da aventura */}
              </div>
              <p>Clique para iniciar aventura:</p>
              <img
                src={playIcon}
                alt="Iniciar Aventura"
                className="play-button-iniciar"
                onClick={handleStartGame} 
                role="button"
              />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default IniciarAventura;