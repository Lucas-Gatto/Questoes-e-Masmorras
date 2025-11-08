import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import HeaderAventura from "../components/HeaderAventura.jsx";
import Footer from "../components/footer.jsx";
import playIcon from "../assets/play.png";
import "./iniciar-aventura.css";
import QRCodeLib from "qrcode";
import API_URL from "../config";

const IniciarAventura = () => {
  console.log("Componente IniciarAventura começou a renderizar.");

  const { aventuraId } = useParams();
  const navigate = useNavigate();
  const [aventura, setAventura] = useState(null);
  const [sessao, setSessao] = useState(null);
  const [joinUrl, setJoinUrl] = useState('');
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [alunos, setAlunos] = useState([]);
  const [sessaoCriada, setSessaoCriada] = useState(false);

  const handleCopyLink = async () => {
    const text = joinUrl || `www.site.com/${aventuraId}`;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const ta = document.createElement('textarea');
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
    } catch (e) {
      // silencioso
    }
  };

  // Efeito para carregar dados da aventura do backend
  useEffect(() => {
    console.log(
      `[IniciarAventura useEffect] Carregando dados do backend para aventura ID: ${aventuraId}`
    );
    const carregar = async () => {
      try {
        const res = await fetch(`${API_URL}/aventuras/${aventuraId}`, { credentials: "include" });
        if (res.status === 401) {
          alert("Sua sessão expirou. Faça login novamente.");
          navigate("/");
          return;
        }
        if (!res.ok) {
          alert("Aventura não encontrada!");
          navigate("/suas-aventuras");
          return;
        }
        const data = await res.json();
        setAventura(data);
      } catch (error) {
        console.error(
          "Erro ao carregar dados da aventura em IniciarAventura:",
          error
        );
        navigate("/suas-aventuras");
      }
    };
    carregar();
  }, [aventuraId, navigate]);


  // Cria sessão no backend e prepara QR/link
  const handleCriarSessao = async () => {
    if (!aventura) return;
    try {
      const res = await fetch(`${API_URL}/sessoes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ aventuraSnapshot: { titulo: aventura.titulo, salas: aventura.salas } }),
      });
            if (res.status === 401) {
        alert('Sua sessão expirou. Faça login novamente.');
        navigate('/');
        return;
      }
      const data = await res.json();
      if (!res.ok) {
        alert(data?.message || 'Erro ao criar sessão');
        return;
      }
      const sessaoInfo = { id: data.id, codigo: data.codigo };
      setSessao(sessaoInfo);
      setJoinUrl(data.joinUrl);
      localStorage.setItem('sessao_atual', JSON.stringify(sessaoInfo));
      const url = data.joinUrl;
      const qr = await QRCodeLib.toDataURL(url);
      setQrDataUrl(qr);

      // começa polling de alunos para exibição
      iniciarPollingAlunos(sessaoInfo.id);
      setSessaoCriada(true);
    } catch (err) {
      console.error('Falha ao criar sessão:', err);
      alert('Falha ao criar sessão.');
    }
  };

  const iniciarPollingAlunos = (sessaoId) => {
    // atualiza lista de alunos a cada 2s
    const intervalId = setInterval(async () => {
      try {
        const res = await fetch(`${API_URL}/sessoes/${sessaoId}`, { credentials: 'include' });
        if (res.ok) {
          const s = await res.json();
          setAlunos(Array.isArray(s.alunos) ? s.alunos : []);
        }
      } catch (e) {
        // silencioso
      }
    }, 2000);
    // limpa ao sair
    return () => clearInterval(intervalId);
  };

  // Ao carregar a aventura, cria a sessão automaticamente uma única vez
  useEffect(() => {
    if (aventura && !sessaoCriada) {
      handleCriarSessao();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aventura, sessaoCriada]);

  // Função para iniciar a sessão e navegar para a tela de jogo
  const handleStartGame = async () => {
    if (aventura && sessao?.id) {
      try {
        console.log(
          `Iniciando a aventura "${aventura.titulo}"... Chamando backend para iniciar sessão`
        );
        const res = await fetch(`${API_URL}/sessoes/${sessao.id}/start`, {
          method: "PUT",
          credentials: "include",
        });
        if (!res.ok) {
          console.error("Erro ao iniciar sessão no backend");
          alert("Erro ao iniciar a aventura. Tente novamente.");
          return;
        }
        console.log(
          `Sessão iniciada com sucesso. Navegando para /aventura/${aventuraId}/jogar`
        );
        navigate(`/aventura/${aventuraId}/jogar`);
      } catch (error) {
        console.error("Erro ao iniciar sessão:", error);
        alert("Erro ao iniciar a aventura. Tente novamente.");
      }
    } else {
      console.error(
        "handleStartGame chamado, mas 'aventura' ou 'sessao' é nula."
      );
    }
  };

  // Tela de carregamento
  if (!aventura) {
    return (
      <div
        style={{
          backgroundColor: "#212529",
          minHeight: "100vh",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
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
              {qrDataUrl ? (
                <img src={qrDataUrl} alt="QR de acesso" style={{ width: '200px', height: '200px', borderRadius: '10px' }} />
              ) : (
                <span>QR Code Aqui</span>
              )}
            </div>
            <div className="info-conexao">
              <p>Ou acesse pelo link:</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div className="link-acesso">
                  {joinUrl || `www.site.com/${aventuraId}`}
                </div>
                <button
                  className="link-acesso"
                  onClick={handleCopyLink}
                  title="Copiar link"
                  type="button"
                  aria-label="Copiar link de acesso"
                >
                  {/* Ícone SVG de copiar (estilo similar ao Feather Icons) */}
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <rect x="3" y="3" width="13" height="13" rx="2" ry="2"></rect>
                  </svg>
                </button>
              </div>
              <div style={{ color: '#C68700', fontSize: '0.9rem' }}>
                {sessao?.codigo ? `Código: ${sessao.codigo}` : 'Crie a sessão para gerar o código'}              </div>
              <p>Clique para iniciar aventura:</p>
              <img
                src={playIcon}
                alt="Botão de play"
                className="play-button-iniciar"
                onClick={handleStartGame}
                role="button"
              />
            </div>
          </div>
          {/* Lista de alunos à esquerda (horizontal) */}
          {alunos && alunos.length > 0 && (
            <div style={{ marginTop: '20px' }}>
              <div style={{ display: 'flex', overflowX: 'auto', gap: '10px', padding: '10px 0', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                {alunos.map((a, idx) => (
                  <a key={`${a.nome}-${idx}`} href="#" style={{ color: '#C68700', background: 'rgba(255,255,255,0.1)', padding: '6px 10px', borderRadius: '14px', textDecoration: 'none', whiteSpace: 'nowrap' }}>
                    {a.nome}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default IniciarAventura;