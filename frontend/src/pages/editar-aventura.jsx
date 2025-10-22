import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import FormularioAventura from '../components/FormularioAventura';

const EditarAventura = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [aventura, setAventura] = useState(null);

  // Buscar aventura no backend
  useEffect(() => {
    const fetchAventura = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/aventuras/${id}`, {
          credentials: 'include', // se estiver usando sessão
        });
        if (!res.ok) throw new Error('Erro ao buscar aventura');
        const data = await res.json();
        setAventura(data);
      } catch (err) {
        console.error(err);
        navigate('/suas-aventuras'); // volta caso não encontre
      }
    };
    fetchAventura();
  }, [id, navigate]);

  // Atualizar aventura (U)
  const handleEditar = async () => {
    if (!aventura.titulo || aventura.titulo.trim() === '') {
      alert('Por favor, dê um título à aventura.');
      return;
    }

    try {
      const res = await fetch(`http://localhost:3000/api/aventuras/${id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(aventura),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Erro ao atualizar aventura');
      }

      alert('Aventura atualizada com sucesso!');
      navigate('/suas-aventuras');
    } catch (err) {
      console.error(err);
      alert('Ocorreu um erro ao atualizar a aventura');
    }
  };

  // Deletar aventura
  const handleDelete = async () => {
    if (!window.confirm('Tem certeza que deseja excluir esta aventura?')) return;

    try {
      const res = await fetch(`http://localhost:3000/api/aventuras/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Erro ao deletar aventura');
      }

      alert('Aventura deletada com sucesso!');
      navigate('/suas-aventuras');
    } catch (err) {
      console.error(err);
      alert('Ocorreu um erro ao deletar a aventura');
    }
  };

  if (!aventura) return <div>Carregando...</div>;

  return (
    <FormularioAventura
      aventura={aventura}
      setAventura={setAventura}
      handleSave={handleEditar}
      handleDelete={handleDelete}
      pageTitle={aventura.titulo}
      submitButtonText="Editar"
      navigate={navigate}
    />
  );
};

export default EditarAventura;