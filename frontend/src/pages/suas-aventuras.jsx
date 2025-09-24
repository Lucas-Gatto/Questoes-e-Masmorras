import React, { useState, useEffect } from 'react';
import Aventura from '../components/aventura.jsx';
import ModalAventura from '../components/ModalAventura.jsx';
import './suas-aventuras.css';

const SuasAventuras = () => {
  const [aventuras, setAventuras] = useState(() => {
    const dadosSalvos = localStorage.getItem('minhas_aventuras');
    return dadosSalvos ? JSON.parse(dadosSalvos) : [];
  });

  useEffect(() => {
    localStorage.setItem('minhas_aventuras', JSON.stringify(aventuras));
  }, [aventuras]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [novoTitulo, setNovoTitulo] = useState('');
  const [aventuraEmEdicao, setAventuraEmEdicao] = useState(null);

  const handleDeleteAventura = (idParaDeletar) => {
    if (window.confirm("Tem certeza que deseja excluir esta aventura?")) {
      setAventuras(aventurasAtuais => aventurasAtuais.filter(aventura => aventura.id !== idParaDeletar));
    }
  };
  
  const handleEditAventura = (aventuraParaEditar) => {
    setAventuraEmEdicao(aventuraParaEditar);
    setNovoTitulo(aventuraParaEditar.titulo);
    setIsModalOpen(true);
  };

  const handleOpenCreateModal = () => {
    setAventuraEmEdicao(null);
    setNovoTitulo('');
    setIsModalOpen(true);
  };

  const handleSaveAventura = () => {
    if (novoTitulo.trim() === '') {
      alert('O título não pode estar vazio!');
      return;
    }

    if (aventuraEmEdicao) {
      setAventuras(aventurasAtuais => aventurasAtuais.map(aventura => 
        aventura.id === aventuraEmEdicao.id ? { ...aventura, titulo: novoTitulo } : aventura
      ));
    } else {
      const novaAventura = { id: Date.now(), titulo: novoTitulo };
      setAventuras(aventurasAtuais => [...aventurasAtuais, novaAventura]);
    }

    setNovoTitulo('');
    setAventuraEmEdicao(null);
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="aventuras-page-container">
        <h2>Suas aventuras</h2>
        <div className="aventuras-grid">
          {aventuras.length === 0 && (
            <p style={{color: 'white', opacity: 0.7}}>Nenhuma aventura criada ainda. Clique no '+' para começar!</p>
          )}
          {aventuras.map(aventura => (
            <Aventura 
              key={aventura.id} 
              titulo={aventura.titulo} 
              onDelete={() => handleDeleteAventura(aventura.id)}
              onEdit={() => handleEditAventura(aventura)}
            />
          ))}
        </div>
        <button className="add-aventura-btn" onClick={handleOpenCreateModal}>
          +
        </button>
      </div>
      <ModalAventura 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveAventura}
        titulo={novoTitulo}
        setTitulo={setNovoTitulo}
      />
    </>
  );
};

export default SuasAventuras;