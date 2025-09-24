// Em: src/components/ModalAventura.jsx

import React from 'react';
import './modal-aventura.css';

// As props 'titulo' e 'setTitulo' são essenciais para a comunicação
const ModalAventura = ({ isOpen, onClose, onSave, titulo, setTitulo }) => {
  if (!isOpen) {
    return null;
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    onSave();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      {/* Adicionado onClick no content para parar a propagação do clique */}
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Criar Nova Aventura</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="titulo-aventura">Título:</label>
          <input
            id="titulo-aventura"
            type="text"
            // O valor do input é controlado pelo estado 'novoTitulo' da página pai
            value={titulo}
            // A cada letra digitada, a função 'setTitulo' atualiza o estado
            onChange={(e) => setTitulo(e.target.value)}
            placeholder="Escreva o título da aventura"
            autoFocus
            required
          />
          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-cancelar">Cancelar</button>
            <button type="submit" className="btn-salvar">Salvar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalAventura;