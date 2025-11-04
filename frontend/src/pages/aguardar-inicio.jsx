import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './aguardar-inicio.css';
import API_URL from "../config";

const AguardarInicio = () => {
  const navigate = useNavigate();
  const [codigoSessao, setCodigoSessao] = useState('');
  const [nomeAluno, setNomeAluno] = useState('');
  const [aventuraTitulo, setAventuraTitulo] = useState('');

  useEffect(() => {
    // Recupera dados da sessão
    const params = new URLSearchParams(window.location.search);
    const codigo = params.get('codigo') || localStorage.getItem('sessao_codigo') || '';
    const nome = params.get('nome') || localStorage.getItem('aluno_nome') || '';
    
    setCodigoSessao(codigo);
    setNomeAluno(nome);

    if (!codigo) {
      alert('Sessão inválida. Volte ao link da aventura.');
      navigate('/');
      return;
    }

    // Polling para verificar se a sessão foi iniciada
    const poll = async () => {
      try {
        const res = await fetch(`${API_URL}/sessoes/by-code/${codigo}`);
        if (res.ok) {
          const data = await res.json();
          
          // Salva o título da aventura se disponível
          if (data.aventuraSnapshot?.titulo) {
            setAventuraTitulo(data.aventuraSnapshot.titulo);
          }
          
          // Se a sessão foi iniciada (status 'active'), redireciona para as salas
          if (data.status === 'active') {
            navigate(`/salas-aluno?codigo=${codigo}`);
          }
        }
      } catch (e) {
        // Silencioso - continua tentando
      }
    };

    // Faz polling a cada 2 segundos
    const intervalId = setInterval(poll, 2000);
    poll(); // Executa imediatamente também

    return () => clearInterval(intervalId);
  }, [navigate]);

  return (
    <div className="aguardar-inicio-container">
      <div className="aguardar-conteudo">
        <div className="aguardar-card">
          <h1 className="titulo-aventura">
            {aventuraTitulo || 'Carregando aventura...'}
          </h1>
          
          <div className="status-container">
            <div className="loading-spinner"></div>
            <h2 className="mensagem-aguardo">
              Aguarde, a aventura iniciará em breve...
            </h2>
            <p className="info-aluno">
              Olá, <strong>{nomeAluno}</strong>! 
              Você está conectado à sessão <strong>{codigoSessao}</strong>
            </p>
          </div>

          <div className="instrucoes">
            <p>Seu professor está preparando a aventura</p>
            <p>Em breve você será redirecionado para a primeira sala</p>
            <p>Mantenha esta tela aberta</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AguardarInicio;