import React, { useState, useEffect } from 'react';
import SalaEnigma from '../components/sala-enigma-aluno';
import SalaAlternativa from '../components/sala-alternativa-aluno';
import SalaMonstro from '../components/sala-monstro-aluno';

const SalasAluno = () => {
  const [salaAtual, setSalaAtual] = useState(null);
  const [codigoSessao, setCodigoSessao] = useState('');
  const [snapshot, setSnapshot] = useState(null);
  const [indiceSala, setIndiceSala] = useState(0);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const c = params.get('codigo') || localStorage.getItem('sessao_codigo') || '';
    setCodigoSessao(c);
    if (!c) return;

    const poll = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/sessoes/by-code/${c}`);
        if (res.ok) {
          const data = await res.json();
          setSnapshot(data.aventuraSnapshot || null);
          const idx = Number(data.currentSalaIndex || 0);
          setIndiceSala(idx);
          const sala = data?.aventuraSnapshot?.salas?.[idx] || null;
          setSalaAtual(sala);
        }
      } catch (e) {
        // silencioso
      }
    };

    const intervalId = setInterval(poll, 2000);
    poll();
    return () => clearInterval(intervalId);
  }, []);

  const renderizarSala = () => {
    if (!salaAtual) {
      return <p style={{ color: 'white' }}>Carregando sala...</p>;
    }

    // Passa o título da aventura do snapshot para os componentes
    const aventuraTitulo = snapshot?.titulo || "Aventura";

    switch (salaAtual.tipo) {
      case 'Enigma':
        return <SalaEnigma sala={salaAtual} aventuraTitulo={aventuraTitulo} />;
      case 'Monstro':
        return <SalaMonstro sala={salaAtual} aventuraTitulo={aventuraTitulo} />;
      case 'Alternativa':
        return <SalaAlternativa sala={salaAtual} aventuraTitulo={aventuraTitulo} />;
      default:
        return <p style={{ color: 'white' }}>Tipo de sala desconhecido.</p>;
    }
  };

  return (
    <div className="salas-aluno-container">
      {renderizarSala()}
    </div>
  );
};

export default SalasAluno;
