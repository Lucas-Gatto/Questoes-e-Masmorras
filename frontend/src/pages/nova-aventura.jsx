import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FormularioAventura from '../components/FormularioAventura.jsx'; 

const NovaAventura = () => {
  const navigate = useNavigate();

  const [aventura, setAventura] = useState({
    id: Date.now(),
    titulo: '',
    salas: [{ id: Date.now() + 1, nome: '1ª Sala', tipo: 'Enigma' }],
    perguntas: Array.from({ length: 6 }, (_, index) => ({
      id: Date.now() + index + 2,
      subPerguntas: [{ id: Date.now() + index + 100, texto: 'Lorem ipsum...' }]
    }))
  });

  // Em NovaAventura.jsx
  const handleConcluir = async () => {
    if (aventura.titulo.trim() === '') {
      alert('Por favor, dê um nome para a sua aventura.');
      return;
    }

    try {
      const res = await fetch('http://localhost:3000/api/aventuras', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // 🔥 importante para sessão
        body: JSON.stringify(aventura),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Erro ao salvar a aventura.');
      }

      const data = await res.json();
      console.log('Aventura criada:', data);
      alert('Aventura criada com sucesso!');
      navigate('/suas-aventuras');
    } catch (error) {
      console.error('Erro ao criar aventura:', error);
      alert('Ocorreu um erro ao salvar a aventura.');
    }
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
      isNew={true} 
    />
  );
};

export default NovaAventura;