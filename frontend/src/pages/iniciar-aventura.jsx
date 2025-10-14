import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import HeaderAventura from '../components/HeaderAventura.jsx';
import Footer from '../components/footer.jsx';
import playIcon from '../assets/play.png';
import './iniciar-aventura.css';

const IniciarAventura = () => {
  const { aventuraId } = useParams();
  const navigate = useNavigate();
  const [aventura, setAventura] = useState(null);

  // Efeito que roda quando o componente é montado para carregar os dados da aventura.
  useEffect(() => {
    try {
      const aventurasSalvas = JSON.parse(localStorage.getItem('minhas_aventuras')) || [];
      // Encontra a aventura específica pelo ID pego da URL
      const aventuraAtual = aventurasSalvas.find(a => a.id === Number(aventuraId));

      if (aventuraAtual) {
        setAventura(aventuraAtual);
      } else {
        // Se não encontrar a aventura, avisa o usuário e volta para a página principal
        alert("Aventura não encontrada!");
        navigate('/suas-aventuras');
      }
    } catch (error) {
      console.error("Erro ao carregar dados da aventura:", error);
      navigate('/suas-aventuras');
    }
  }, [aventuraId, navigate]);

  // Função chamada ao clicar no botão de play para iniciar o jogo
  const handleStartGame = () => {
    if (aventura) {
      console.log(`Iniciando a aventura "${aventura.titulo}"...`);
      // Navega para a tela de jogo do mestre
      navigate(`/aventura/${aventura.id}/jogar`);
    }
  };

  // Exibe uma mensagem de carregamento enquanto os dados da aventura não chegam
  if (!aventura) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="iniciar-aventura-page">
      <HeaderAventura />
      <main className="iniciar-aventura-main">
        <div className="iniciar-painel">
          <h1 className="aventura-titulo-iniciar">{aventura.titulo}</h1>
          
          <div className="conteudo-conexao">
            <div className="qr-code-placeholder">
              {/* No futuro, um componente de QR Code real pode ser inserido aqui */}
              <span>QR Code Aqui</span>
            </div>
            <div className="info-conexao">
              <p>Ou acesse pelo link:</p>
              <div className="link-acesso">
                {/* Exibe um link único para a aventura */}
                www.site.com/{aventura.id}
              </div>
              <p>Clique para iniciar aventura:</p>
              <img 
                src={playIcon} 
                alt="Iniciar Aventura" 
                className="play-button-iniciar"
                onClick={handleStartGame}
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