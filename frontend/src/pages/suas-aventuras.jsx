import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Aventura from "../components/aventura.jsx"; // Verifique extensão .jsx
import "./suas-aventuras.css";

const SuasAventuras = () => {
  const [aventuras, setAventuras] = useState([]);

  const navigate = useNavigate();

  // Carrega aventuras do backend (apenas do usuário logado)
  useEffect(() => {
    const carregarAventuras = async () => {
      try {
        const res = await fetch('https://questoes-e-masmorras.onrender.com/api/aventuras', { credentials: 'include' });
        if (res.status === 401) {
          alert('Sua sessão expirou. Faça login novamente.');
          navigate('/');
          return;
        }
        const lista = await res.json();
        setAventuras(Array.isArray(lista) ? lista : []);
      } catch (e) {
        console.error('Falha ao carregar aventuras do backend:', e);
        setAventuras([]);
      }
    };
    carregarAventuras();
  }, [navigate]);

  // Deleta aventura no backend e atualiza estado
  const handleDeleteAventura = async (backendId) => {
    if (!window.confirm("Tem certeza que deseja excluir esta aventura?")) return;
    try {
      const res = await fetch(`https://questoes-e-masmorras.onrender.com/api/aventuras/${backendId}`, { method: 'DELETE', credentials: 'include' });
      if (res.status === 401) {
        alert('Sua sessão expirou. Faça login novamente.');
        navigate('/');
        return;
      }
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data?.message || 'Erro ao excluir aventura');
        return;
      }
      setAventuras((atual) => atual.filter((a) => a._id !== backendId));
    } catch (e) {
      console.error('Falha ao excluir aventura:', e);
      alert('Falha ao excluir aventura.');
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
              key={aventura._id}
              titulo={aventura.titulo}
              onDelete={() => handleDeleteAventura(aventura._id)}
              onEdit={() => navigate(`/editar-aventura/${aventura._id}`)}
              onPlay={() => navigate(`/iniciar-aventura/${aventura._id}`)}
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