import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FormularioAventura from '../components/FormularioAventura.jsx';

const NovaAventura = () => {
  const navigate = useNavigate();

  // Define o estado inicial da aventura nova, tentando recarregar rascunho salvo
  const [aventura, setAventura] = useState(() => {
    try {
      const draftIdStr = localStorage.getItem('draft_aventura_id');
      const aventurasExistentes = JSON.parse(localStorage.getItem('minhas_aventuras')) || [];
      if (draftIdStr) {
        const draftId = Number(draftIdStr);
        const aventuraDraft = aventurasExistentes.find(a => a.id === draftId);
        if (aventuraDraft) {
          console.log('[NovaAventura] Carregando rascunho existente com ID:', draftId);
          return aventuraDraft;
        }
      }
    } catch (e) {
      console.error('[NovaAventura] Erro ao tentar carregar rascunho:', e);
    }
    // Fallback: cria nova aventura padrão
    const now = Date.now();
    return {
      id: now, // ID temporário para o localStorage
      titulo: '',
      // Inicializa a primeira sala com todos os campos esperados
      salas: [{ id: now + 1, nome: '1ª Sala', tipo: 'Enigma', enigma: '', resposta: '', texto: '', vidaMonstro: 'Média', opcoes: [], imagem: '' }],
      perguntas: Array.from({ length: 6 }, (_, index) => ({
        id: now + index + 2,
        subPerguntas: [{ id: now + index + 100, texto: 'Lorem ipsum...' }]
      }))
    };
  });

  // Função chamada pelo botão 'Concluir' do FormularioAventura
  const handleConcluir = async () => {
    // 1. Validação
    if (!aventura || aventura.titulo.trim() === '') {
      alert('Por favor, dê um nome para a sua aventura.');
      return; // Interrompe se inválido
    }

    // 2. Salvamento local (apenas se válido)
    try {
      console.log('Concluindo nova aventura. Dados a salvar (localStorage):', aventura);
      const aventurasExistentes = JSON.parse(localStorage.getItem('minhas_aventuras')) || [];
      const indexExistente = aventurasExistentes.findIndex(a => a.id === aventura.id);
      let aventurasAtualizadas;
      if (indexExistente > -1) {
        aventurasAtualizadas = [...aventurasExistentes];
        aventurasAtualizadas[indexExistente] = aventura; // Atualiza rascunho pré-salvo
      } else {
        aventurasAtualizadas = [...aventurasExistentes, aventura]; // Adiciona nova
      }

      localStorage.setItem('minhas_aventuras', JSON.stringify(aventurasAtualizadas));
    } catch (error) {
      console.error('Erro ao salvar nova aventura no localStorage:', error);
      alert('Ocorreu um erro ao salvar a aventura localmente.');
      return;
    }

    // 3. Tentativa de salvar no backend (não altera UI, apenas sincroniza)
    try {
      const payload = {
        titulo: aventura.titulo,
        salas: aventura.salas,
        perguntas: aventura.perguntas,
      };

      const res = await fetch('http://localhost:3000/api/aventuras', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // garante envio do cookie de sessão
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        console.log('[NovaAventura] Aventura salva no backend com sucesso:', data);
      } else {
        const errText = await res.text().catch(() => '');
        console.error('[NovaAventura] Falha ao salvar no backend. Status:', res.status, 'Body:', errText);
        // Não altera a UX: já salvamos localmente; apenas logamos o erro
      }
    } catch (err) {
      console.error('[NovaAventura] Erro de rede ao salvar no backend:', err);
      // Mantém fluxo: salvamento local já está ok
    }

    // 4. Limpa o ID de rascunho e navega
    try {
      localStorage.removeItem('draft_aventura_id');
    } catch {}

    alert('Aventura criada com sucesso!');
    navigate('/suas-aventuras'); // Navega para a lista
  };

  // Função chamada pelo botão 'Cancelar' do FormularioAventura
  const handleCancelar = () => {
    // Opcional: Remover rascunho pré-salvo do localStorage
    try {
      const aventurasExistentes = JSON.parse(localStorage.getItem('minhas_aventuras')) || [];
      // Remove apenas se o título estiver vazio (indicando que não foi realmente editado)
      if (aventura && aventura.titulo.trim() === '') {
        const aventurasFiltradas = aventurasExistentes.filter(a => a.id !== aventura.id);
        localStorage.setItem('minhas_aventuras', JSON.stringify(aventurasFiltradas));
        console.log('Rascunho cancelado removido do localStorage.');
      }
      // Limpa o ID de rascunho ao cancelar
      localStorage.removeItem('draft_aventura_id');
    } catch (error) { console.error('Erro ao remover rascunho:', error); }
    navigate('/suas-aventuras'); // Simplesmente volta para a lista
  }

  return (
    <FormularioAventura
      aventura={aventura}
      setAventura={setAventura}
      handleSave={handleConcluir} // Conectar ao botão 'Concluir'
      handleDelete={handleCancelar} // Conectar ao botão 'Cancelar'
      pageTitle="Nova aventura"
      submitButtonText="Concluir"
      navigate={navigate}
      isNew={true} // Informa que é uma nova aventura
    />
  );
};

export default NovaAventura;