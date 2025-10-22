import React, { useState, useEffect } from "react";
import "./entrar-aventura.css";

const EntrarAventura = () => {
  const [aventuraSelecionada, setAventuraSelecionada] = useState(null);

  useEffect(() => {
    const aventurasSalvas = JSON.parse(localStorage.getItem("minhas_aventuras")) || [];

    // Aqui você pode escolher a lógica de seleção:
    // Exemplo: pegar a última aventura criada
    if (aventurasSalvas.length > 0) {
      const ultima = aventurasSalvas[aventurasSalvas.length - 1];
      setAventuraSelecionada(ultima);
    }
  }, []);

  return (
    <div className="aventuras-page-container" role="main">


      {aventuraSelecionada && (
        <h1 className="titulo-aventura">{aventuraSelecionada.titulo}</h1>
      )}

      <input
        id="login-senha"
        type="password"
        placeholder="Digite o nome do seu personagem..."
      />

      <div className="btn-entrar-aventura-container">
        <button className="btn-entrar-aventura">Entrar na Aventura</button>
      </div>
    </div>
  );
};

export default EntrarAventura;
