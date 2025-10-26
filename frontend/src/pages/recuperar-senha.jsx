import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Link para voltar ao login
import './recuperar-senha.css'; // Novo CSS

// Defina a URL base da sua API (se ainda não tiver importado)
const API_URL = 'http://localhost:3000/api'; // Ajuste a porta se necessário

const RecuperarSenha = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(''); // Para feedback (sucesso/erro)
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault(); // Impede o recarregamento padrão do form
    setIsLoading(true);
    setMessage(''); // Limpa mensagens antigas

    if (!email) {
      setMessage('Por favor, insira seu endereço de email.');
      setIsLoading(false);
      return;
    }

    try {
      // --- Lógica de Chamada ao Backend (Placeholder) ---
      console.log(`Enviando solicitação de recuperação para: ${email}`);
      // TODO: Descomentar e ajustar quando o endpoint do backend existir
      /*
      const response = await fetch(`${API_URL}/user/recuperar-senha`, { // Endpoint hipotético
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json(); // Tenta ler a resposta JSON

      if (!response.ok) {
        // Usa a mensagem do backend se disponível, senão uma genérica
        throw new Error(data.message || `Erro ${response.status}`);
      }
      */
      // --- Simulação de Sucesso (Remover depois) ---
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simula espera da rede
      const data = { message: 'Se um usuário com este email existir, um link de recuperação foi enviado.' };
      // --- Fim da Simulação ---


      setMessage(data.message); // Exibe mensagem de sucesso (ou a mensagem do backend)
      setEmail(''); // Limpa o campo de email

    } catch (error) {
      console.error("Erro ao solicitar recuperação de senha:", error);
      // Mostra a mensagem de erro vinda do backend ou uma padrão
      setMessage(error.message || 'Ocorreu um erro. Tente novamente.');
    } finally {
      setIsLoading(false); // Finaliza o carregamento
    }
  };

  return (
    // Reutiliza estilos de container se houver (ex: login-main) ou crie um novo
    <div className="recuperar-senha-main">
      <div className="recuperar-senha-painel">
        <h1 className="titulo-recuperar">Recuperar Senha</h1>
        <p className="instrucao-recuperar">
          Digite seu email abaixo. Se ele estiver cadastrado, enviaremos um link para você redefinir sua senha.
        </p>

        <form onSubmit={handleSubmit} className="form-recuperar">
          <div className="form-group-recuperar">
            <label htmlFor="email-recuperar">Email</label>
            <input
              type="email"
              id="email-recuperar"
              className="input-email-recuperar" // Estilo similar aos outros inputs
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seuemail@exemplo.com"
              required // Validação básica do HTML5
              disabled={isLoading} // Desabilita enquanto carrega
            />
          </div>

          {/* Exibe mensagens de feedback */}
          {message && (
            <div className={`feedback-message ${message.includes('Erro') ? 'error' : 'success'}`}>
              {message}
            </div>
          )}

          <button
            type="submit"
            className="btn-enviar-recuperacao" // Estilo similar aos botões principais
            disabled={isLoading} // Desabilita enquanto carrega
          >
            {isLoading ? 'Enviando...' : 'Enviar Link de Recuperação'}
          </button>
        </form>

        <div className="link-voltar-login">
          <Link to="/login">Voltar para o Login</Link>
        </div>

      </div>
    </div>
  );
};

export default RecuperarSenha;