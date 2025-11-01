import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import FormularioAventura from '../components/FormularioAventura.jsx';
import API_URL from "../config";

const EditarAventura = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation(); // Usado para forçar o reload

  const [aventura, setAventura] = useState(null); // Estado para guardar a aventura

  // Carrega aventura do backend pelo _id da URL
  useEffect(() => {
    const carregar = async () => {
      try {
        const res = await fetch(`${API_URL}/aventuras/${id}`, { credentials: 'include' });
        if (res.status === 401) {
          alert('Sua sessão expirou. Faça login novamente.');
          navigate('/');
          return;
        }
        if (!res.ok) {
          alert('Aventura não encontrada para edição.');
          navigate('/suas-aventuras');
          return;
        }
        const data = await res.json();
        // Gera um id local efêmero para compatibilidade com navegação de edição de sala
        setAventura({ ...data, backendId: data._id, id: Date.now() });
      } catch (e) {
        console.error('Erro ao carregar aventura do backend:', e);
        alert('Ocorreu um erro ao carregar a aventura.');
        navigate('/suas-aventuras');
      }
    };
    carregar();
  }, [id, navigate, location.key]);

  // Função chamada pelo botão 'Salvar Alterações' do FormularioAventura
  const handleEditar = () => {
    // 1. Validação
    if (!aventura || aventura.titulo.trim() === '') {
        alert('A aventura precisa de um nome.');
        return; // Interrompe se inválido
    }

    // 2. Salvamento direto no backend
    try {
      const payload = {
        titulo: aventura.titulo,
        salas: aventura.salas,
        perguntas: aventura.perguntas,
      };
      fetch(`${API_URL}/aventuras/${aventura.backendId || id}`, {
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
          console.warn('[EditarAventura] Falha ao salvar no backend. Status:', res.status, txt);
          alert('Erro ao salvar as alterações.');
          return;
        }
        alert('Aventura atualizada com sucesso!');
        navigate('/suas-aventuras');
      }).catch(err => {
        console.error('[EditarAventura] Erro de rede ao salvar aventura no backend:', err);
        alert('Erro ao salvar as alterações.');
      });
    } catch (error) {
      console.error('Erro ao preparar salvamento:', error);
      alert('Erro ao salvar as alterações.');
    }
  };

  // Função chamada pelo botão 'Deletar Aventura' do FormularioAventura
  const handleDelete = () => {
    if (!window.confirm('Tem certeza que deseja excluir esta aventura?')) return;
    try {
      fetch(`${API_URL}/aventuras/${aventura?.backendId || id}`, {
        method: 'DELETE',
        credentials: 'include',
      }).then(async res => {
        if (res.status === 401) {
          alert('Sua sessão expirou. Faça login novamente.');
          navigate('/');
          return;
        }
        if (!res.ok) {
          const txt = await res.text().catch(() => '');
          console.warn('[EditarAventura] Falha ao deletar no backend. Status:', res.status, txt);
          alert('Erro ao deletar a aventura.');
          return;
        }
        alert('Aventura deletada com sucesso!');
        navigate('/suas-aventuras');
      }).catch(err => {
        console.error('[EditarAventura] Erro de rede ao deletar aventura no backend:', err);
        alert('Erro ao deletar a aventura.');
      });
    } catch (error) {
      console.error('Erro ao preparar deleção:', error);
      alert('Erro ao deletar a aventura.');
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