import React, { useState, useEffect } from "react";
import "./escolher-classe.css";
import { useNavigate } from "react-router-dom";
import HeaderAventura from "../components/HeaderAventura.jsx";
import Footer from "../components/footer.jsx";

import bardoImg from "../assets/bonecos.png";
import magoImg from "../assets/bonecos.png";
import guerreiroImg from "../assets/bonecos.png";

const EscolherClasse = () => {
  const navigate = useNavigate();
  const [classeSelecionada, setClasseSelecionada] = useState("");
  const [habilidade, setHabilidade] = useState("");
  const [aventuraSelecionada, setAventuraSelecionada] = useState(null);

  useEffect(() => {
    const aventurasSalvas = JSON.parse(localStorage.getItem("minhas_aventuras")) || [];
    if (aventurasSalvas.length > 0) {
      const ultima = aventurasSalvas[aventurasSalvas.length - 1];
      setAventuraSelecionada(ultima);
    }
  }, []);

  const handleConfirmar = () => {
    if (!classeSelecionada) {
      alert("Escolha uma classe antes de confirmar!");
      return;
    }

    console.log({
      classe: classeSelecionada,
      habilidade: habilidade,
    });

    navigate("/salas-aluno");
  };

  return (
    <div className="escolher-classe-container">
      <main className="escolher-classe-conteudo">
        {aventuraSelecionada && (
          <h1 className="titulo-aventura">{aventuraSelecionada.titulo}</h1>
        )}
        <h2>Escolha sua Classe</h2>

        <div className="classes-opcoes">
          <div
            className={`classe-card ${classeSelecionada === "Mago" ? "selecionada" : ""}`}
            onClick={() => setClasseSelecionada("Mago")}
          >
            <img src={magoImg} alt="Mago" />
          </div>

          <div
            className={`classe-card ${classeSelecionada === "Bardo" ? "selecionada" : ""}`}
            onClick={() => setClasseSelecionada("Bardo")}
          >
            <img src={bardoImg} alt="Bardo" />
          </div>

          <div
            className={`classe-card ${classeSelecionada === "Guerreiro" ? "selecionada" : ""}`}
            onClick={() => setClasseSelecionada("Guerreiro")}
          >
            <img src={guerreiroImg} alt="Guerreiro" />
          </div>
        </div>

        {classeSelecionada && (
          <>
            <h3 style={{ color: "white", marginBottom: "0.5rem" }}>
              {classeSelecionada}
            </h3>

            <div className="input-container">
              <input
                type="text"
                className="input-habilidade"
                placeholder={`Habilidade do ${classeSelecionada}...`}
                value={habilidade}
                onChange={(e) => setHabilidade(e.target.value)}
              />

              <button className="btn-confirmar" onClick={handleConfirmar}>
                Confirmar Escolha
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default EscolherClasse;
