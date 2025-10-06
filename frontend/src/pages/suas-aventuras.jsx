import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Aventura from "../components/aventura.jsx";
import "./suas-aventuras.css";

const SuasAventuras = () => {
  const [aventuras, setAventuras] = useState(() => {
    const dadosSalvos = localStorage.getItem("minhas_aventuras");
    return dadosSalvos ? JSON.parse(dadosSalvos) : [];
  });

  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem("minhas_aventuras", JSON.stringify(aventuras));
  }, [aventuras]);

  const handleDeleteAventura = (idParaDeletar) => {
    if (window.confirm("Tem certeza que deseja excluir esta aventura?")) {
      setAventuras((aventurasAtuais) =>
        aventurasAtuais.filter((aventura) => aventura.id !== idParaDeletar)
      );
    }
  };

  return (
    <div className="aventuras-page-container" role="main">
      <h1>Suas aventuras</h1>
      <div className="aventuras-grid">
        {aventuras.length === 0 && (
          <h3 style={{ color: "white", opacity: 0.7 }}>
            Nenhuma aventura criada ainda. Clique no '+' para começar!
          </h3>
        )}
        {aventuras.map((aventura) => (
          <Aventura
            key={aventura.id}
            titulo={aventura.titulo}
            onDelete={() => handleDeleteAventura(aventura.id)}
            onEdit={() => navigate(`/editar-aventura/${aventura.id}`)}
          />
        ))}
        <button
          className="add-aventura-btn"
          onClick={() => navigate("/nova-aventura")}
        >
          +
        </button>
      </div>
    </div>
  );
};

export default SuasAventuras;
