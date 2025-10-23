import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import FormularioAventura from '../components/FormularioAventura.jsx';

const EditarAventura = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation(); // Usado para forçar o reload

  const [aventura, setAventura] = useState(null);

  // Efeito para carregar a aventura do localStorage ao montar ou ao voltar
  useEffect(() => {
    console.log("Executando useEffect em EditarAventura... Triggered by location key:", location.key);
    try {
      const aventurasSalvas = JSON.parse(localStorage.getItem('minhas_aventuras')) || [];
      const aventuraParaEditar = aventurasSalvas.find(a => a.id === Number(id));

      if (aventuraParaEditar) {
        console.log("Aventura encontrada no localStorage:", aventuraParaEditar);
        setAventura(aventuraParaEditar); // Define o estado com os dados carregados
      } else {
        console.warn("Aventura NÃO encontrada no localStorage para ID:", id);
        alert("Aventura não encontrada para edição.");
        navigate('/suas-aventuras');
      }
    } catch (error) {
       console.error("Erro ao carregar aventura para edição:", error);
       alert("Ocorreu um erro ao carregar a aventura. Verifique o console.");
       navigate('/suas-aventuras');
    }
  }, [id, navigate, location.key]); // Depende do ID e da chave de localização

  // Função chamada pelo botão 'Salvar Alterações' do FormularioAventura
  const handleEditar = () => {
    // 1. Validação
    if (!aventura || aventura.titulo.trim() === '') {
        alert('A aventura precisa de um nome.');
        return; // Interrompe se inválido
    }

    // 2. Salvamento (apenas se válido)
    try {
        console.log("Salvando alterações da aventura:", aventura);
        const aventurasSalvas = JSON.parse(localStorage.getItem('minhas_aventuras')) || [];
        const aventurasAtualizadas = aventurasSalvas.map(a =>
          a.id === Number(id) ? aventura : a // Substitui a aventura editada
        );
        localStorage.setItem('minhas_aventuras', JSON.stringify(aventurasAtualizadas));
        alert('Aventura atualizada com sucesso!');
        navigate('/suas-aventuras'); // Volta para a lista principal após salvar
    } catch (error) {
        console.error("Erro ao salvar alterações da aventura:", error);
        alert('Erro ao salvar as alterações.');
    }
  };

  // Função chamada pelo botão 'Deletar Aventura' do FormularioAventura
  const handleDelete = () => {
    if (window.confirm("Tem certeza que deseja excluir esta aventura?")) {
      try {
          const aventurasSalvas = JSON.parse(localStorage.getItem('minhas_aventuras')) || [];
          const aventurasAtualizadas = aventurasSalvas.filter(a => a.id !== Number(id));
          localStorage.setItem('minhas_aventuras', JSON.stringify(aventurasAtualizadas));
          alert('Aventura deletada com sucesso!');
          navigate('/suas-aventuras');
      } catch (error) {
          console.error("Erro ao deletar aventura:", error);
          alert('Erro ao deletar a aventura.');
      }
    }
  };

  // Tela de carregamento enquanto 'aventura' é nulo
  if (!aventura) {
    return 
  }

  // Renderiza o formulário reutilizável
  return (
    <FormularioAventura
      aventura={aventura}
      setAventura={setAventura}
      handleSave={handleEditar} // Conecta ao botão 'Salvar Alterações'
      handleDelete={handleDelete} // Conecta ao botão 'Deletar Aventura'
      pageTitle={`Editando: ${aventura.titulo}`}
      submitButtonText="Salvar Alterações"
      navigate={navigate}
      isNew={false} // Informa que NÃO é uma nova aventura
    />
  );
};

export default EditarAventura;