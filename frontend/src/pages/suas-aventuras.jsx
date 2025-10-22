import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Aventura from "../components/aventura.jsx";
import "./suas-aventuras.css";


const SuasAventuras = () => {
  const [aventuras, setAventuras] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAventuras = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/aventuras", {
          method: "GET",
          credentials: "include", // 🔥 envia o cookie da sessão
        });
        const data = await res.json();
        if (res.ok) {
          setAventuras(data);
        } else {
          alert(data.error || "Erro ao buscar aventuras");
        }
      } catch (err) {
        console.error(err);
        alert("Erro ao buscar aventuras");
      }
    };

    fetchAventuras();
  }, []);

  const handleDeleteAventura = async (idParaDeletar) => {
  if (!window.confirm("Tem certeza que deseja excluir esta aventura?")) return;

  try {
    const res = await fetch(`http://localhost:3000/api/aventuras/${idParaDeletar}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Erro ao deletar aventura");
    }

    // Atualiza o estado local
    setAventuras((aventurasAtuais) =>
      aventurasAtuais.filter((aventura) => aventura._id !== idParaDeletar)
    );

    alert("Aventura deletada com sucesso!");
  } catch (err) {
    console.error(err);
    alert("Erro ao deletar aventura");
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

        {/* VERIFIQUE AQUI: O map precisa existir e a prop onPlay precisa ser passada */}
        {aventuras && aventuras.map((aventura) => (
          <Aventura
            key={aventura.id}
            titulo={aventura.titulo}
            onDelete={() => handleDeleteAventura(aventura._id)}
            onEdit={() => navigate(`/editar-aventura/${aventura._id}`)}
            onPlay={() => navigate(`/iniciar-aventura/${aventura._id}`)} // A linha que adicionamos
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