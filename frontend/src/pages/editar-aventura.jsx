import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import FormularioAventura from '../components/FormularioAventura.jsx';

const EditarAventura = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation(); // Usado para forçar o reload

  const [aventura, setAventura] = useState(null); // Estado para guardar a aventura

  // Efeito para carregar a aventura do localStorage
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
        // Sincroniza no backend: PUT se houver backendId, senão tenta criar via POST
        const aventuraAtualizada = aventurasAtualizadas.find(a => a.id === Number(id));
        const payload = {
          titulo: aventuraAtualizada.titulo,
          salas: aventuraAtualizada.salas,
          perguntas: aventuraAtualizada.perguntas,
        };
        if (aventuraAtualizada?.backendId) {
          fetch(`http://localhost:3000/api/aventuras/${aventuraAtualizada.backendId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(payload),
          }).then(async res => {
            if (res.status === 401) {
              alert('Sua sessão expirou. Faça login novamente.');
              navigate('/');
              return;
            }
            if (!res.ok) {
              const txt = await res.text().catch(() => '');
              console.warn('[EditarAventura] Falha ao sincronizar no backend. Status:', res.status, txt);
            }
          }).catch(err => console.warn('[EditarAventura] Erro de rede ao sincronizar no backend:', err));
        } else {
          fetch('http://localhost:3000/api/aventuras', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(payload),
          }).then(async res => {
            if (res.status === 401) {
              alert('Sua sessão expirou. Faça login novamente.');
              navigate('/');
              return;
            }
            if (!res.ok) {
              const txt = await res.text().catch(() => '');
              console.warn('[EditarAventura] Falha ao criar no backend. Status:', res.status, txt);
              return;
            }
            const data = await res.json();
            try {
              const aventurasSalvas2 = JSON.parse(localStorage.getItem('minhas_aventuras')) || [];
              const idx2 = aventurasSalvas2.findIndex(a => a.id === Number(id));
              if (idx2 > -1) {
                aventurasSalvas2[idx2] = { ...aventurasSalvas2[idx2], backendId: data._id };
                localStorage.setItem('minhas_aventuras', JSON.stringify(aventurasSalvas2));
                console.log('[EditarAventura] backendId criado e sincronizado:', data._id);
              }
            } catch (e) {
              console.warn('[EditarAventura] Falha ao atualizar backendId no localStorage:', e);
            }
          }).catch(err => console.warn('[EditarAventura] Erro de rede ao criar aventura no backend:', err));
        }
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
    return (
        <div style={{ backgroundColor: '#212529', minHeight: '100vh', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            Carregando dados da aventura...
        </div>
    );
  }

  // Renderiza o formulário reutilizável
  return (
    <FormularioAventura
      aventura={aventura}
      setAventura={setAventura} // Passa a função para permitir atualizações diretas no estado
      handleSave={handleEditar} // Passa a função que será chamada ao clicar em 'Salvar Alterações'
      handleDelete={handleDelete} // Passa a função para o botão 'Deletar Aventura'
      pageTitle={`Editando: ${aventura.titulo}`}
      submitButtonText="Salvar Alterações"
      navigate={navigate} // Passa a função navigate para a SalaArrastavel
      isNew={false} // Informa explicitamente que NÃO é uma nova aventura
    />
  );
};

export default EditarAventura;