import React from "react"; // Removido useEffect daqui
import "./formulario-aventura.css";
import editIcon from "../assets/editar.png";
import deleteIcon from "../assets/excluir.png";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// --- Componente SalaArrastavel ---
const SalaArrastavel = ({
  sala,
  index,
  handleSalaChange,
  handleDeleteSala,
  aventura, // Recebe a aventura inteira
  isNew,    // Recebe o booleano 'isNew'
  navigate,
}) => {

  const handleEditClick = () => {
    // --- LÓGICA DE PRÉ-SALVAMENTO RESTAURADA (SÓ PARA isNew=true) ---
    if (isNew) {
      console.log("[handleEditClick - Pré-Salvamento] (isNew=true) Estado da aventura ANTES de salvar:", aventura);
      try {
        const aventurasExistentes = JSON.parse(localStorage.getItem('minhas_aventuras')) || [];
        const indexExistente = aventurasExistentes.findIndex(a => a.id === aventura.id);
        let aventurasAtualizadas;
        if (indexExistente > -1) {
          aventurasAtualizadas = [...aventurasExistentes];
          aventurasAtualizadas[indexExistente] = aventura; // Atualiza rascunho
        } else {
          aventurasAtualizadas = [...aventurasExistentes, aventura]; // Salva rascunho pela 1ª vez
        }
        localStorage.setItem('minhas_aventuras', JSON.stringify(aventurasAtualizadas));
        console.log("[handleEditClick - Pré-Salvamento] Dados salvos no localStorage.");
      } catch (error) {
         console.error("Erro ao pré-salvar aventura:", error);
         alert("Ocorreu um erro ao tentar salvar o rascunho da aventura.");
         return; // Interrompe se não conseguir salvar
      }
    }
    // --- FIM DO PRÉ-SALVAMENTO ---

    // Navegação (passa isNew para EditarSala saber como voltar)
    if (navigate && aventura?.id && sala?.id) {
      const editUrl = `/aventura/${aventura.id}/sala/${sala.id}/editar?tipo=${sala.tipo}&isNew=${isNew ? 'true' : 'false'}`;
      console.log("[handleEditClick] Navegando para:", editUrl);
      navigate(editUrl);
    } else {
      console.error("Erro de navegação: Faltando dados.", { navigateExists: !!navigate, aventuraId: aventura?.id, salaId: sala?.id, salaTipo: sala?.tipo, isNewProp: isNew });
      alert("Ocorreu um erro ao tentar editar a sala.");
    }
  };

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: sala.id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  if (!sala) {
      console.warn("Tentativa de renderizar SalaArrastavel sem dados da sala.");
      return null;
  }

  return (
    <div ref={setNodeRef} style={style} className="sala-item">
       <span className="sala-numero" {...attributes} {...listeners} aria-label={`Sala ${index + 1}. Arraste.`}>
        {index + 1}
      </span>
      <label className="sala-label-nome">Nome da sala:</label>
      <input aria-label="Nome da sala" type="text" className="sala-input-nome" value={sala.nome || ''}
        onChange={(e) => handleSalaChange(sala.id, "nome", e.target.value)}
      />
      <label className="sala-label-tipo">Tipo de sala:</label>
      <div className="sala-tipo-container">
        <select aria-label="Tipo da sala" className="sala-select-tipo" value={sala.tipo || 'Enigma'}
          onChange={(e) => handleSalaChange(sala.id, "tipo", e.target.value)}
        >
          <option value="Enigma">Enigma</option>
          <option value="Alternativa">Alternativa</option>
          <option value="Monstro">Monstro</option>
        </select>
      </div>
      <div className="sala-acoes">
        <img src={editIcon} alt="Editar" onClick={handleEditClick} role="button" />
        <img src={deleteIcon} alt="Deletar" onClick={() => handleDeleteSala(sala.id)} role="button" />
      </div>
    </div>
  );
};

// --- Componente Principal FormularioAventura ---
const FormularioAventura = ({
  aventura,
  setAventura,
  handleSave,     // Função do pai para salvar (ex: handleConcluir, handleEditar)
  handleDelete,   // Função do pai para deletar/cancelar
  pageTitle,
  submitButtonText,
  navigate,
  isNew = false,    // Flag para saber se é criação ou edição
}) => {

  // ❌ REMOVIDO: useEffect que salvava automaticamente no localStorage ❌

  // --- Funções de Manipulação do Estado (COMPLETAS) ---

  const handleTituloChange = (e) => {
    setAventura(prev => ({ ...prev, titulo: e.target.value }));
  };

  const handleNumSalasChange = (novoNum) => {
    const num = Math.max(1, novoNum); // Garante pelo menos 1 sala
    setAventura(prev => {
        const salasAtuais = prev.salas || [];
        const novasSalas = [];
        for (let i = 0; i < num; i++) {
          if (salasAtuais[i]) {
            novasSalas.push(salasAtuais[i]);
          } else {
            // Cria sala nova com todos os campos padrão definidos
            novasSalas.push({
              id: Date.now() + i,
              nome: `${i + 1}ª Sala`,
              tipo: "Enigma",
              enigma: '', resposta: '', texto: '',
              vidaMonstro: 'Média', opcoes: [], imagem: ''
            });
          }
        }
        const salasFinais = novasSalas.slice(0, num);
        return { ...prev, salas: salasFinais };
    });
  };

  const handleSalaChange = (id, campo, valor) => {
    setAventura(prev => ({
      ...prev,
      salas: (prev.salas || []).map((sala) => // Garante que salas exista
        sala.id === id ? { ...sala, [campo]: valor } : sala
      )
    }));
  };

  const handleDeleteSala = (idParaDeletar) => {
    setAventura(prev => {
        if (!prev.salas || prev.salas.length <= 1) {
          alert("A aventura deve ter pelo menos uma sala.");
          return prev;
        }
        return {
          ...prev,
          salas: prev.salas.filter((sala) => sala.id !== idParaDeletar)
        };
    });
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      setAventura((prev) => {
        const salasAtuais = prev.salas || [];
        const oldIndex = salasAtuais.findIndex((sala) => sala.id === active.id);
        const newIndex = salasAtuais.findIndex((sala) => sala.id === over.id);
        if (oldIndex === -1 || newIndex === -1) {
            console.warn("Erro ao reordenar: ID da sala não encontrado.", { activeId: active.id, overId: over.id });
            return prev;
        }
        return {
          ...prev,
          salas: arrayMove(salasAtuais, oldIndex, newIndex),
        };
      });
    }
  };

  const handleSubPerguntaChange = (perguntaId, subPerguntaId, novoTexto) => {
    setAventura(prev => ({
        ...prev,
        perguntas: (prev.perguntas || []).map((pergunta) => {
          if (pergunta.id === perguntaId) {
            return {
                ...pergunta,
                subPerguntas: (pergunta.subPerguntas || []).map((sub) =>
                  sub.id === subPerguntaId ? { ...sub, texto: novoTexto } : sub
                )
            };
          }
          return pergunta;
        })
    }));
  };

  const adicionarSubPergunta = (perguntaId) => {
     setAventura(prev => ({
        ...prev,
        perguntas: (prev.perguntas || []).map((pergunta) => {
          if (pergunta.id === perguntaId) {
            const novaSub = { id: Date.now(), texto: "Nova sub-pergunta..." };
            const subPerguntasAtuais = pergunta.subPerguntas || [];
            return {
              ...pergunta,
              subPerguntas: [...subPerguntasAtuais, novaSub],
            };
          }
          return pergunta;
        })
    }));
  };

  const deletarSubPergunta = (perguntaId, subPerguntaId) => {
     setAventura(prev => ({
        ...prev,
        perguntas: (prev.perguntas || []).map((pergunta) => {
          if (pergunta.id === perguntaId) {
            if (pergunta.subPerguntas && pergunta.subPerguntas.length > 1) {
              return {
                  ...pergunta,
                  subPerguntas: pergunta.subPerguntas.filter(
                    (sub) => sub.id !== subPerguntaId
                  )
              };
            }
          }
          return pergunta;
        })
    }));
  };

  // --- Verificações de Segurança ---
  if (!aventura || !aventura.salas || !aventura.perguntas) {
    console.warn("FormularioAventura: Dados essenciais da aventura estão faltando ou nulos.", { aventura });
    return
  }

  // --- Renderização ---
  return (
    <div className="nova-aventura-container" role="main">
      <h1 className="titulo-pagina">{pageTitle || "Formulário da Aventura"}</h1>

       {/* --- Cabeçalho --- */}
       <div className="form-cabecalho">
          <input type="text" className="input-titulo-aventura" placeholder="Digite o nome da aventura..."
            value={aventura.titulo || ""} onChange={handleTituloChange}
          />
          <div className="stepper-container">
             <label htmlFor="stepper-input">Quantidade de salas</label>
            <div className="stepper-controls">
              <button onClick={() => handleNumSalasChange(aventura.salas.length - 1)} aria-label="Diminuir salas"> - </button>
              <div className="stepper-numero-container"> <span id="stepper-input">{aventura.salas.length}</span> </div>
              <button onClick={() => handleNumSalasChange(aventura.salas.length + 1)} aria-label="Aumentar salas"> + </button>
            </div>
          </div>
        </div>

      {/* --- Lista de Salas --- */}
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div className="lista-salas-container">
          <SortableContext items={aventura.salas.map(s => s.id)} strategy={verticalListSortingStrategy}>
            {aventura.salas.map((sala, index) => (
              <SalaArrastavel
                key={sala.id}
                id={sala.id}
                sala={sala}
                index={index}
                aventura={aventura} // Passa aventura para pré-salvar/navegar
                isNew={isNew}      // Passa isNew para SalaArrastavel saber se pré-salva
                handleSalaChange={handleSalaChange}
                handleDeleteSala={handleDeleteSala}
                navigate={navigate}
              />
            ))}
          </SortableContext>
        </div>
      </DndContext>

      {/* --- Perguntas de Rolagem --- */}
       <div className="perguntas-rolagem-container">
          <h2 className="subtitulo">Perguntas de Rolagem</h2>
          {aventura.perguntas.map((pergunta, index) => (
            <div key={pergunta.id} className="pergunta-grupo">
              <span className="pergunta-grupo-numero">{index + 1}</span>
              <div className="sub-perguntas-lista">
                {(pergunta.subPerguntas || []).map((sub) => (
                  <div key={sub.id} className="sub-pergunta-item">
                    <input type="text" className="pergunta-input-texto" value={sub.texto || ''}
                      onChange={(e) => handleSubPerguntaChange(pergunta.id, sub.id, e.target.value)}
                      aria-label={`Texto ${index + 1}.${sub.id}`}
                    />
                    <img src={deleteIcon} alt={`Deletar ${index + 1}.${sub.id}`} className="delete-sub-pergunta-icon"
                      onClick={() => deletarSubPergunta(pergunta.id, sub.id)} role="button"
                    />
                  </div>
                ))}
                <button className="add-sub-pergunta-btn" onClick={() => adicionarSubPergunta(pergunta.id)}
                  aria-label={`Add ${index + 1}`} > + </button>
              </div>
            </div>
          ))}
        </div>

      {/* --- Botões Finais --- */}
       <div className="botoes-finais-container">
          <button className="btn-final btn-deletar" onClick={handleDelete}>
            {isNew ? 'Cancelar' : 'Deletar Aventura'}
          </button>
          <button className="btn-final btn-concluir" onClick={handleSave}>
            {submitButtonText || 'Salvar'}
          </button>
        </div>
    </div>
  );
};

export default FormularioAventura;