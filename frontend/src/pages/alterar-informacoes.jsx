import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../pages/alterar-informacoes.css";

const EditarUsuario = () => {
  const navigate = useNavigate();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    if (!nome || !email) {
      setMessage('Preencha todos os campos.');
      setIsLoading(false);
      return;
    }


    setTimeout(() => {
      setMessage('Informações atualizadas com sucesso!');
      setIsLoading(false);
      setNome('');
      setEmail('');
      setTimeout(() => navigate('/perfil'), 2000);
    }, 1500);
  };

  return (
    <div className="editar-usuario-main">
      <div className="editar-usuario-painel">
        <h1>Editar Informações</h1>
        <p>Atualize seu nome e email:</p>

        <form onSubmit={handleSubmit} className="form-editar">
          <input
            type="text"
            placeholder="Nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            disabled={isLoading}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            required
          />

          {message && (
            <div className={`feedback-message ${message.includes('erro') ? 'error' : 'success'}`}>
              {message}
            </div>
          )}

          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditarUsuario;
