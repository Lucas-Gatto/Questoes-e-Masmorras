// Em: src/pages/nova-aventura.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FormularioAventura from '../components/FormularioAventura';

const NovaAventura = () => {
  const navigate = useNavigate();
  
  const [aventura, setAventura] = useState({
    id: Date.now(),
    titulo: '',
    salas: [{ id: Date.now() + 1, nome: '1ª Sala', tipo: 'Enigma' }],
    // ✨ ESTRUTURA NOVA: 6 grupos de perguntas, cada um com uma sub-pergunta inicial ✨
    perguntas: Array.from({ length: 6 }, (_, index) => ({
      id: Date.now() + index + 2,
      subPerguntas: [{ id: Date.now() + index + 100, texto: 'Lorem ipsum...' }]
    }))
  });

  const handleConcluir = () => {
    if (aventura.titulo.trim() === '') {
      alert('Por favor, dê um nome para a sua aventura.');
      return;
    }
    const aventurasExistentes = JSON.parse(localStorage.getItem('minhas_aventuras')) || [];
    const aventurasAtualizadas = [...aventurasExistentes, aventura];
    localStorage.setItem('minhas_aventuras', JSON.stringify(aventurasAtualizadas));
    navigate('/suas-aventuras');
  };

  return (
    <FormularioAventura
      aventura={aventura}
      setAventura={setAventura}
      handleSave={handleConcluir}
      handleDelete={() => navigate('/suas-aventuras')}
      pageTitle="Nova aventura"
      submitButtonText="Concluir"
      navigate={navigate}
    />
  );
};

export default NovaAventura;