import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../pages/perfil.css';

const PerfilUsuario = () => {
  const navigate = useNavigate();

  // Dados simulados localmente
  const [usuario] = useState({
    nome: 'Seu Nome Aqui',
    email: 'seuemail@exemplo.com',
  });

  const handleEditar = () => {
    navigate('/alterar-informacoes');
  };

  return (
    <div className="perfil-usuario-main">
      <div className="perfil-usuario-painel">
        <h1>Meu Perfil</h1>
        <div className="info-usuario">
          <p><strong>Nome:</strong> {usuario.nome}</p>
          <p><strong>Email:</strong> {usuario.email}</p>
        </div>
        <button className="btn-editar-info" onClick={handleEditar}>
          Editar Informações
        </button>
      </div>
    </div>
  );
};

export default PerfilUsuario;
