import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Aventura from "../components/aventura.jsx"; // Verifique extensão .jsx
import "./suas-aventuras.css";

const SuasAventuras = () => {
  const [aventuras, setAventuras] = useState(() => {
    // Carrega do localStorage ao iniciar
    try {
      const dadosSalvos = localStorage.getItem("minhas_aventuras");
      return dadosSalvos ? JSON.parse(dadosSalvos) : [];
    } catch (error) {
      console.error("Erro ao ler aventuras do localStorage:", error);
      return [];
    }
  });

  const navigate = useNavigate();

  // Salva no localStorage sempre que 'aventuras' mudar
  useEffect(() => {
    try {
      localStorage.setItem("minhas_aventuras", JSON.stringify(aventuras));
    } catch (error) {
      console.error("Erro ao salvar aventuras no localStorage:", error);
    }
  }, [aventuras]);

  // Função para deletar (ainda usando localStorage)
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
        {aventuras.length === 0 ? (
          <h3 style={{ color: "white", opacity: 0.7 }}>
            Nenhuma aventura criada ainda. Clique no '+' para começar!
          </h3>
        ) : (
          aventuras.map((aventura) => (
            <Aventura
              key={aventura.id} // Usa ID numérico
              titulo={aventura.titulo}
              onDelete={() => handleDeleteAventura(aventura.id)}
              onEdit={() => navigate(`/editar-aventura/${aventura.id}`)}
              // --- 👇 CONSOLE.LOG ADICIONADO AQUI 👇 ---
              onPlay={() => {
                console.log(`Clicou em Play para aventura ID: ${aventura.id}. Navegando para /iniciar-aventura/${aventura.id}`);
                navigate(`/iniciar-aventura/${aventura.id}`);
              }}
            />
          ))
        )}
        <button
          className="add-aventura-btn"
          onClick={() => navigate("/nova-aventura")}
          aria-label="Adicionar nova aventura"
        >
          +
        </button>
      </div>
    </div>
  );
};

export default SuasAventuras;