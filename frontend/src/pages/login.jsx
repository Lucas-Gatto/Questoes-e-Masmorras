import React from 'react';
import './login.css';
import bonecos from '../assets/bonecos.png';

function Login() {
  return (
    <div className="login-page-container">
      <div className="auth-wrapper">
        <div className="auth-box">
          <h2>Bem vindo de Volta!</h2>
          <form>
            <label htmlFor="login-usuario">Usuário:</label>
            <input id="login-usuario" type="email" defaultValue="login@gmail.com" />

            <label htmlFor="login-senha">Senha:</label>
            <input id="login-senha" type="password" defaultValue="**********" />

            <a href="#" className="forgot-password">Esqueci minha senha</a>

            <button type="button" className="btn btn-yellow">ENTRAR</button>
          </form>
        </div>
        <img src={bonecos} alt="Personagens" className="character-image" />
        <div className="auth-box">
          <h2>Cadastre-se</h2>
          <form>
            <label htmlFor="register-usuario">Usuário:</label>
            <input id="register-usuario" type="email" defaultValue="login@gmail.com" />

            <label htmlFor="register-senha">Senha:</label>
            <input id="register-senha" type="password" defaultValue="**********" />

            <label htmlFor="register-confirmar-senha">Confirmar senha:</label>
            <input id="register-confirmar-senha" type="password" defaultValue="**********" />

            <button type="button" className="btn btn-red">CADASTRAR</button>
          </form>
        </div>

      </div>
    </div>
  );
}

export default Login;