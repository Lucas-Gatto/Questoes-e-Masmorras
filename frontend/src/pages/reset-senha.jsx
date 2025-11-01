import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
//import './reset-senha.css'; // Crie o CSS no mesmo estilo da recuperar-senha
import API_URL from "../config";

const ResetSenha = () => {
  const { token } = useParams(); // pega o token da URL
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    if (!password || !confirmPassword) {
      setMessage('Preencha todos os campos.');
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setMessage('As senhas não coincidem.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/user/reset-password/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, confirmPassword }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || `Erro ${response.status}`);

      setMessage(data.message);
      setPassword('');
      setConfirmPassword('');
      // redireciona para login depois de alguns segundos
      setTimeout(() => navigate('/login'), 2000);

    } catch (error) {
      console.error("Erro ao redefinir senha:", error);
      setMessage(error.message || 'Ocorreu um erro. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="reset-senha-main">
      <div className="reset-senha-painel">
        <h1>Redefinir Senha</h1>
        <p>Digite a nova senha abaixo.</p>

        <form onSubmit={handleSubmit} className="form-reset">
          <input
            type="password"
            placeholder="Nova senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            required
          />
          <input
            type="password"
            placeholder="Confirme a nova senha"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={isLoading}
            required
          />

          {message && (
            <div className={`feedback-message ${message.includes('erro') || message.includes('inválido') ? 'error' : 'success'}`}>
              {message}
            </div>
          )}

          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Redefinindo...' : 'Redefinir Senha'}
          </button>
        </form>

        <div className="link-voltar-login">
          <Link to="/login">Voltar para o Login</Link>
        </div>
      </div>
    </div>
  );
};

export default ResetSenha;