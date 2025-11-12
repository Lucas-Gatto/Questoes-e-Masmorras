import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API_URL from '../config';
import "../pages/trocar-senha.css";

const TrocarSenha = () => {
  const navigate = useNavigate();
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsLoading(true);

    if (!senhaAtual || !novaSenha || !confirmarSenha) {
      setMessage('Preencha todos os campos.');
      setIsLoading(false);
      return;
    }

    if (novaSenha !== confirmarSenha) {
      setMessage('As senhas não coincidem.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/user/trocar-senha`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // importante para enviar a session
        body: JSON.stringify({
          senhaAtual,
          novaSenha,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || 'Erro ao trocar senha.');
        setIsLoading(false);
        return;
      }

      setMessage(data.message);
      setIsLoading(false);

      setTimeout(() => {
        navigate('/perfil');
      }, 2000);

    } catch (error) {
      console.log(error);
      setMessage('Erro ao conectar ao servidor.');
      setIsLoading(false);
    }
  };

  return (
    <div className="editar-usuario-main">
      <div className="editar-usuario-painel">
        <h1>Trocar Senha</h1>
        <p>Atualize sua senha abaixo:</p>

        <form onSubmit={handleSubmit} className="form-editar">
          <input
            type="password"
            placeholder="Senha atual"
            value={senhaAtual}
            onChange={(e) => setSenhaAtual(e.target.value)}
            disabled={isLoading}
            required
          />
          <input
            type="password"
            placeholder="Nova senha"
            value={novaSenha}
            onChange={(e) => setNovaSenha(e.target.value)}
            disabled={isLoading}
            required
          />
          <input
            type="password"
            placeholder="Confirmar nova senha"
            value={confirmarSenha}
            onChange={(e) => setConfirmarSenha(e.target.value)}
            disabled={isLoading}
            required
          />

          {message && (
            <div className={`feedback-message ${message.includes('sucesso') ? 'success' : 'error'}`}>
              {message}
            </div>
          )}

          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Salvando...' : 'Salvar'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TrocarSenha;