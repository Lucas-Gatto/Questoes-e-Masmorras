import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import FormularioAventura from '../components/FormularioAventura'; 

const EditarAventura = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [aventura, setAventura] = useState(null); 
  useEffect(() => {
    const aventurasSalvas = JSON.parse(localStorage.getItem('minhas_aventuras')) || [];
    const aventuraParaEditar = aventurasSalvas.find(a => a.id === Number(id));
    if (aventuraParaEditar) {
      setAventura(aventuraParaEditar);
    } else {
      navigate('/suas-aventuras'); 
    }
  }, [id, navigate]);

  const handleEditar = () => {
    const aventurasSalvas = JSON.parse(localStorage.getItem('minhas_aventuras')) || [];
    const aventurasAtualizadas = aventurasSalvas.map(a =>
      a.id === Number(id) ? aventura : a
    );
    localStorage.setItem('minhas_aventuras', JSON.stringify(aventurasAtualizadas));
    navigate('/suas-aventuras');
  };

  const handleDelete = () => {
    if (window.confirm("Tem certeza que deseja excluir esta aventura?")) {
      const aventurasSalvas = JSON.parse(localStorage.getItem('minhas_aventuras')) || [];
      const aventurasAtualizadas = aventurasSalvas.filter(a => a.id !== Number(id));
      localStorage.setItem('minhas_aventuras', JSON.stringify(aventurasAtualizadas));
      navigate('/suas-aventuras');
    }
  };
  
  if (!aventura) {
    return <div>Carregando...</div>;
  }

  return (
    <FormularioAventura
      aventura={aventura}
      setAventura={setAventura}
      handleSave={handleEditar}
      handleDelete={handleDelete}
      pageTitle={aventura.titulo} 
      submitButtonText="Editar" 
    />
  );
};

export default EditarAventura;