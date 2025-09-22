import React from 'react';
import './login.css';

function Login() {
  return (
    <div className="Login-container">

      <div className="auth-box">
        <div className="auth-section">
          <h2>Bem vindo de Volta!</h2>
          <form>
            <label>Usuário:</label>
            <input type="email" placeholder="login@gmail.com" />

            <label>Senha:</label>
            <input type="password" placeholder="**********" />

            <div className="checkbox-group">
              <label>Esqueci minha senha</label>
            </div>

            <button className="btn yellow">ENTRAR</button>

          </form>
        </div>
      </div>


      <div className="auth-box">
        <div className="auth-section">
          <h2>Cadastre-se</h2>
          <form>
            <label>Usuário:</label>
            <input type="email" placeholder="login@gmail.com" />

            <label>Senha:</label>
            <input type="password" placeholder="**********" />

            <label>Confirmar senha:</label>
            <input type="password" placeholder="**********" />

            <button className="btn red">CADASTRAR</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
