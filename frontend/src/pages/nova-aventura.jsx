// Em: src/pages/nova-aventura.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FormularioAventura from '../components/FormularioAventura'; // Importando o formulário

const NovaAventura = () => {
  const navigate = useNavigate();
  
  // Estado inicial para uma aventura em branco
  const [aventura, setAventura] = useState({
    titulo: '',
    salas: [{ id: Date.now(), nome: '1ª Sala', tipo: 'Enigma' }],
    perguntas: [{ id: Date.now() + 1, texto: 'Yorem ipsum dolor sit amet...' }]
  });

  const handleConcluir = () => {
    if (aventura.titulo.trim() === '') {
      alert('Por favor, dê um nome para a sua aventura.');
      return;
    }

    const aventurasExistentes = JSON.parse(localStorage.getItem('minhas_aventuras')) || [];
    const novaAventuraComId = { ...aventura, id: Date.now() };
    const aventurasAtualizadas = [...aventurasExistentes, novaAventuraComId];
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
    />
  );
};

export default NovaAventura;