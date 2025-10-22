import React, { useState, useEffect } from 'react';
import SalaEnigma from '../components/sala-enigma-aluno';
import SalaAlternativa from '../components/sala-alternativa-aluno';
import SalaMonstro from '../components/sala-monstro-aluno';

const SalasAluno = () => {
  const [salaAtual, setSalaAtual] = useState(null);

  useEffect(() => {
    const aventurasSalvas = JSON.parse(localStorage.getItem('minhas_aventuras')) || [];

    if (aventurasSalvas.length > 0) {
      const ultimaAventura = aventurasSalvas[aventurasSalvas.length - 1];

      // Aqui você pode escolher qual sala mostrar — neste exemplo, a primeira
      const primeiraSala = ultimaAventura.salas[0];

      if (primeiraSala) {
        setSalaAtual(primeiraSala);
      }
    }
  }, []);

  const renderizarSala = () => {
    if (!salaAtual) {
      return <p style={{ color: 'white' }}>Carregando sala...</p>;
    }

    switch (salaAtual.tipo) {
      case 'Enigma':
        return <SalaEnigma sala={salaAtual} />;
      case 'Monstro':
        return <SalaMonstro sala={salaAtual} />;
      case 'Alternativa':
        return <SalaAlternativa sala={salaAtual} />;
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
