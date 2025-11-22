import React, { useState, useEffect, useRef } from "react";
import SalaEnigma from "../components/sala-enigma-aluno";
import SalaAlternativa from "../components/sala-alternativa-aluno";
import SalaMonstro from "../components/sala-monstro-aluno";
import API_URL from "../config";
import './sala-de-jogo.css';

const SalasAluno = () => {
  const [salaAtual, setSalaAtual] = useState(null);
  const [codigoSessao, setCodigoSessao] = useState('');
  const [snapshot, setSnapshot] = useState(null);
  const [indiceSala, setIndiceSala] = useState(0);
  const [enigmaFlags, setEnigmaFlags] = useState([]);
  const [alunos, setAlunos] = useState([]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [turnEndsAt, setTurnEndsAt] = useState(null);
  const [timeLeft, setTimeLeft] = useState(30);
  const [advancing, setAdvancing] = useState(false);
  const [monstroVidaAtual, setMonstroVidaAtual] = useState(null);
  // Refs para controlar polling e cancelamento de requisições
  const pollIdRef = useRef(null);
  const pollAbortRef = useRef(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const c = params.get('codigo') || localStorage.getItem('sessao_codigo') || '';
    setCodigoSessao(c);
    if (!c) return;

    const poll = async () => {
      try {
        // Cancela requisição anterior, se existir
        if (pollAbortRef.current) {
          try { pollAbortRef.current.abort(); } catch (_) {}
        }
        const controller = new AbortController();
        pollAbortRef.current = controller;
        const res = await fetch(`${API_URL}/sessoes/by-code/${c}`);
        if (res.status === 404) {
          // Sessão não existe mais: parar polling e limpar estado/storage
          if (pollIdRef.current) { clearInterval(pollIdRef.current); pollIdRef.current = null; }
          pollAbortRef.current = null;
          try { localStorage.removeItem('sessao_codigo'); } catch (_) {}
          setCodigoSessao('');
          setSnapshot(null);
          setSalaAtual(null);
          setEnigmaFlags([]);
          setAlunos([]);
          setCurrentPlayerIndex(0);
          setTurnEndsAt(null);
          setMonstroVidaAtual(null);
          return;
        }
        if (res.ok) {
          const data = await res.json();
          // Se a sessão terminou, redireciona para avaliação
          if (data?.status === 'finished') {
            window.location.href = '/avaliacao';
            return;
          }
          setSnapshot(data.aventuraSnapshot || null);
          const idx = Number(data.currentSalaIndex || 0);
          setIndiceSala(idx);
          const sala = data?.aventuraSnapshot?.salas?.[idx] || null;
          setSalaAtual(sala);
          // Guarda flags de revelação, se houver
          setEnigmaFlags(Array.isArray(data.enigmaReveladoPorSala) ? data.enigmaReveladoPorSala : []);
          setAlunos(Array.isArray(data.alunos) ? data.alunos : []);
          setCurrentPlayerIndex(Number(data.currentPlayerIndex || 0));
          setTurnEndsAt(data.turnEndsAt || null);
          if (data.monstroVidaAtual != null) {
            const v = Number(data.monstroVidaAtual);
            setMonstroVidaAtual(Number.isFinite(v) ? v : null);
          } else {
            setMonstroVidaAtual(null);
          }
        }
      } catch (e) {
        // silencioso
      }
    };

    // Inicia polling com intervalo maior
    if (pollIdRef.current) { clearInterval(pollIdRef.current); pollIdRef.current = null; }
    pollIdRef.current = setInterval(poll, 5000);
    poll();

    const onVisibilityChange = () => {
      const isHidden = document.visibilityState === 'hidden';
      if (isHidden) {
        if (pollIdRef.current) { clearInterval(pollIdRef.current); pollIdRef.current = null; }
        if (pollAbortRef.current) { try { pollAbortRef.current.abort(); } catch (_) {} pollAbortRef.current = null; }
      } else if (!pollIdRef.current && c) {
        pollIdRef.current = setInterval(poll, 5000);
        poll();
      }
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange);
      if (pollIdRef.current) { clearInterval(pollIdRef.current); pollIdRef.current = null; }
      if (pollAbortRef.current) { try { pollAbortRef.current.abort(); } catch (_) {} pollAbortRef.current = null; }
    };
  }, []);

  // Atualiza timer local: apenas turno (30s)
  useEffect(() => {
    if (!codigoSessao) return;
    const tick = () => {
      // Timer do turno
      if (!turnEndsAt) {
        setTimeLeft(0);
        return;
      }
      const ms = Math.max(0, new Date(turnEndsAt).getTime() - Date.now());
      const secs = Math.ceil(ms / 1000);
      setTimeLeft(secs);
      if (secs <= 0 && !advancing) {
        setAdvancing(true);
        fetch(`${API_URL}/sessoes/by-code/${codigoSessao}/turn/next`, { method: 'PUT' })
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
    };
    const timerId = setInterval(tick, 250);
    return () => clearInterval(timerId);
  }, [turnEndsAt, codigoSessao, advancing]);

  const renderizarSala = () => {
    if (!salaAtual) {
      return <p style={{ color: "white" }}>Carregando sala...</p>;
    }

    // Passa o título da aventura do snapshot para os componentes
    const aventuraTitulo = snapshot?.titulo || "Aventura";

    const revelada = Array.isArray(enigmaFlags) && indiceSala >= 0 && indiceSala < enigmaFlags.length ? !!enigmaFlags[indiceSala] : false;
    const currentPlayerName = alunos?.[currentPlayerIndex]?.nome || '—';
    const mm = String(Math.floor(timeLeft / 60)).padStart(2, '0');
    const ss = String(timeLeft % 60).padStart(2, '0');
    const timerText = `${mm}:${ss}`;
    switch (salaAtual.tipo) {
      case 'Enigma':
        return <SalaEnigma sala={salaAtual} aventuraTitulo={aventuraTitulo} revelada={revelada} currentPlayerName={currentPlayerName} timerText={timerText} />;
      case 'Monstro':
        return <SalaMonstro sala={salaAtual} aventuraTitulo={aventuraTitulo} currentPlayerName={currentPlayerName} timerText={timerText} turnEndsAt={turnEndsAt} numJogadores={Array.isArray(alunos) ? alunos.length : 0} monstroVidaAtual={monstroVidaAtual} alunos={alunos} />;
      case 'Alternativa':
        // Usa key para forçar re-montagem ao trocar de sala e evitar retenção de estado
        return <SalaAlternativa key={indiceSala} sala={salaAtual} aventuraTitulo={aventuraTitulo} revelada={revelada} />;
      default:
        return <p style={{ color: "white" }}>Tipo de sala desconhecido.</p>;
    }
  };

  // Calcula progresso com segurança (mesma lógica da Sala de Jogo)
  const totalSalas = Array.isArray(snapshot?.salas) ? snapshot.salas.length : 0;
  const progresso = totalSalas > 0 ? ((indiceSala + 1) / totalSalas) * 100 : 0;

  // Layout com barra de progresso lateral e painel central igual ao mestre
  return (
    <div className="sala-de-jogo-main">
      {/* Barra de Progresso (mesma estilização) */}
      <div className="progresso-barra-container">
        <div className="progresso-barra-preenchimento" style={{ height: `${progresso}%` }}></div>
      </div>

      {/* Painel Central (mesmo do mestre) */}
      <div className="sala-painel">
        <h1 className="sala-titulo-aventura">{snapshot?.titulo || 'Aventura Sem Título'}</h1>
        <h2 className="sala-titulo-nome">{salaAtual?.nome || 'Carregando Sala...'}</h2>

        {renderizarSala()}
      </div>
    </div>
  );
};

export default SalasAluno;
