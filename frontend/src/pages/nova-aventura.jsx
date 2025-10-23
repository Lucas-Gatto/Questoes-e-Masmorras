import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FormularioAventura from '../components/FormularioAventura.jsx';

const NovaAventura = () => {
  const navigate = useNavigate();

  // Define o estado inicial da aventura nova
  const [aventura, setAventura] = useState({
    id: Date.now(), // ID temporário para o localStorage
    titulo: '',
    // Inicializa a primeira sala com todos os campos esperados
    salas: [{ id: Date.now() + 1, nome: '1ª Sala', tipo: 'Enigma', enigma: '', resposta: '', texto: '', vidaMonstro: 'Média', opcoes: [], imagem: '' }],
    perguntas: Array.from({ length: 6 }, (_, index) => ({
      id: Date.now() + index + 2,
      subPerguntas: [{ id: Date.now() + index + 100, texto: 'Lorem ipsum...' }]
    }))
  });

  // Função chamada pelo botão 'Concluir' do FormularioAventura
  const handleConcluir = () => {
    // 1. Validação
    if (!aventura || aventura.titulo.trim() === '') {
      alert('Por favor, dê um nome para a sua aventura.');
      return; // Interrompe se inválido
    }

    // 2. Salvamento (apenas se válido)
    try {
        console.log("Concluindo nova aventura. Dados a salvar:", aventura);
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
        alert('Aventura criada com sucesso!');
        navigate('/suas-aventuras'); // Navega para a lista
    } catch (error) {
        console.error("Erro ao salvar nova aventura:", error);
        alert("Ocorreu um erro ao salvar a aventura.");
    }
  };

  // Função chamada pelo botão 'Cancelar' do FormularioAventura
  const handleCancelar = () => {
      // Opcional: Remover rascunho pré-salvo do localStorage
      // try {
      //     const aventurasExistentes = JSON.parse(localStorage.getItem('minhas_aventuras')) || [];
      //     const aventurasFiltradas = aventurasExistentes.filter(a => a.id !== aventura.id);
      //     localStorage.setItem('minhas_aventuras', JSON.stringify(aventurasFiltradas));
      // } catch (error) { console.error("Erro ao remover rascunho:", error); }
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