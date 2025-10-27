import React, { useState } from "react";
import "./login.css";
import bonecos from "../assets/bonecos.png";
// 👇 1. Adicione 'Link' à importação aqui
import { useNavigate, Link } from "react-router-dom";

function Login() {
  //Constante de redirecionamento de página
  const navigate = useNavigate();

  //Estados para Login
  const [loginEmail, setLoginEmail] = useState("");
  const [loginSenha, setLoginSenha] = useState("");

  //Estados para cadastro
  const [cadastroEmail, setCadastroEmail] = useState("");
  const [cadastroSenha, setCadastroSenha] = useState("");
  const [cadastroConfirmarSenha, setCadastroConfirmarSenha] = useState("");

  //Função de login
  const handleLogin = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: loginEmail, password: loginSenha }),
      });

      const data = await res.json();
      if (res.ok) {
        console.log("Login OK:", data);
        navigate("/suas-aventuras");
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert("Erro ao fazer login.");
    }
  };

  //Função de cadastro
  const handleCadastro = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/user/cadastrar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: cadastroEmail,
          password: cadastroSenha,
          confirmPassword: cadastroConfirmarSenha,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        console.log("Cadastro OK:", data);
        alert("Cadastro realizado com sucesso!");

        //Limpa os campos
        setCadastroEmail("");
        setCadastroSenha("");
        setCadastroConfirmarSenha("");

      } else {
        alert(data.message);
      }
    } catch (err) {
      alert("Erro ao cadastrar.");
    }
  };

  return (
    <div className="login-page-container" role="main">
      <div className="auth-wrapper">
        <div className="auth-box">
          <h2>Bem vindo de Volta!</h2>
          <form onSubmit={(e) => e.preventDefault()}>
            <label htmlFor="login-usuario">Usuário:</label>
            <input
              id="login-usuario"
              type="email"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
            />

            <label htmlFor="login-senha">Senha:</label>
            <input
              id="login-senha"
              type="password"
              value={loginSenha}
              onChange={(e) => setLoginSenha(e.target.value)}
            />
            <div className="link-recuperar-senha"> 
                <Link to="/recuperar-senha" className="forgot-password">
                    Esqueci minha senha
                </Link>
            </div>
            {/* --- Fim da alteração --- */}

            <button type="button" className="btn btn-yellow" onClick={handleLogin}>
              ENTRAR
            </button>
          </form>
        </div>

        <img src={bonecos} alt="Personagens" className="character-image" />

        <div className="auth-box">
          <h2>Cadastre-se</h2>
          <form onSubmit={(e) => e.preventDefault()}>
            <label htmlFor="register-usuario">Usuário:</label>
            <input
              id="register-usuario"
              type="email"
              value={cadastroEmail}
              onChange={(e) => setCadastroEmail(e.target.value)}
            />

            <label htmlFor="register-senha">Senha:</label>
            <input
              id="register-senha"
              type="password"
              value={cadastroSenha}
              onChange={(e) => setCadastroSenha(e.target.value)}
            />

            <label htmlFor="register-confirmar-senha">Confirmar senha:</label>
            <input
              id="register-confirmar-senha"
              type="password"
              value={cadastroConfirmarSenha}
              onChange={(e) => setCadastroConfirmarSenha(e.target.value)}
            />

            <button type="button" className="btn btn-red" onClick={handleCadastro}>
              CADASTRAR
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;