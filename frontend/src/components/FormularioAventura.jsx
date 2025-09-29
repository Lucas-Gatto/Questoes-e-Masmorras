// Em: src/components/FormularioAventura.jsx

import React from "react";
import "./formulario-aventura.css";
import editIcon from "../assets/editar.png";
import deleteIcon from "../assets/excluir.png";
import { useNavigate } from "react-router-dom";

import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const SalaArrastavel = ({
  sala,
  index,
  handleSalaChange,
  handleDeleteSala,
  aventuraId,
  navigate,
}) => {
  const handleEditClick = () => {
    if (aventuraId && sala.id) {
      navigate(`/aventura/${aventuraId}/sala/${sala.id}/editar`);
    } else {
      console.error("IDs faltando, não é possível navegar.");
    }
  };
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: sala.id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div ref={setNodeRef} style={style} className="sala-item">
      <span
        className="sala-numero"
        {...attributes}
        {...listeners}
        aria-label={`Sala ${index + 1}. Arraste para reordenar.`}
      >
        {index + 1}
      </span>
      <label className="sala-label-nome">Nome da sala:</label>
      <input
        aria-label="Search"
        type="text"
        className="sala-input-nome"
        value={sala.nome}
        onChange={(e) => handleSalaChange(sala.id, "nome", e.target.value)}
      />
      <label className="sala-label-tipo">Tipo de sala:</label>
      <div className="sala-tipo-container">
        <select
          aria-label="State"
          className="sala-select-tipo"
          value={sala.tipo}
          onChange={(e) => handleSalaChange(sala.id, "tipo", e.target.value)}
        >
          <option value="Enigma">Enigma</option>
          <option value="Alternativa">Alternativa</option>
          <option value="Monstro">Monstro</option>
        </select>
      </div>
      <div className="sala-acoes">
        <img src={editIcon} alt="Editar" onClick={handleEditClick} />
        <img
          src={deleteIcon}
          alt="Deletar"
          onClick={() => handleDeleteSala(sala.id)}
        />
      </div>
    </div>
  );
};

const FormularioAventura = ({
  aventura,
  setAventura,
  handleSave,
  handleDelete,
  pageTitle,
  submitButtonText,
  navigate,
}) => {
  const handleTituloChange = (e) => {
    setAventura({ ...aventura, titulo: e.target.value });
  };
  const handleNumSalasChange = (novoNum) => {
    const num = Math.max(1, novoNum);
    const salasAtuais = aventura.salas || [];
    const novasSalas = [];
    for (let i = 0; i < num; i++) {
      if (salasAtuais[i]) {
        novasSalas.push(salasAtuais[i]);
      } else {
        novasSalas.push({
          id: Date.now() + i,
          nome: `${i + 1}ª Sala`,
          tipo: "Enigma",
        });
      }
    }
    setAventura({ ...aventura, salas: novasSalas });
  };
  const handleSalaChange = (id, campo, valor) => {
    const novasSalas = aventura.salas.map((sala) =>
      sala.id === id ? { ...sala, [campo]: valor } : sala
    );
    setAventura({ ...aventura, salas: novasSalas });
  };
  const handleDeleteSala = (idParaDeletar) => {
    if (aventura.salas.length <= 1) {
      alert("A aventura deve ter pelo menos uma sala.");
      return;
    }
    const novasSalas = aventura.salas.filter(
      (sala) => sala.id !== idParaDeletar
    );
    setAventura({ ...aventura, salas: novasSalas });
  };
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setAventura((aventuraAtual) => {
        const oldIndex = aventuraAtual.salas.findIndex(
          (sala) => sala.id === active.id
        );
        const newIndex = aventuraAtual.salas.findIndex(
          (sala) => sala.id === over.id
        );
        return {
          ...aventuraAtual,
          salas: arrayMove(aventuraAtual.salas, oldIndex, newIndex),
        };
      });
    }
  };

  // ✨ NOVAS FUNÇÕES PARA MANIPULAR AS SUB-PERGUNTAS ✨
  const handleSubPerguntaChange = (perguntaId, subPerguntaId, novoTexto) => {
    const novasPerguntas = aventura.perguntas.map((pergunta) => {
      if (pergunta.id === perguntaId) {
        const novasSubPerguntas = pergunta.subPerguntas.map((sub) =>
          sub.id === subPerguntaId ? { ...sub, texto: novoTexto } : sub
        );
        return { ...pergunta, subPerguntas: novasSubPerguntas };
      }
      return pergunta;
    });
    setAventura({ ...aventura, perguntas: novasPerguntas });
  };

  const adicionarSubPergunta = (perguntaId) => {
    const novasPerguntas = aventura.perguntas.map((pergunta) => {
      if (pergunta.id === perguntaId) {
        const novaSub = { id: Date.now(), texto: "Lorem ipsum..." };
        return {
          ...pergunta,
          subPerguntas: [...pergunta.subPerguntas, novaSub],
        };
      }
      return pergunta;
    });
    setAventura({ ...aventura, perguntas: novasPerguntas });
  };

  const deletarSubPergunta = (perguntaId, subPerguntaId) => {
    const novasPerguntas = aventura.perguntas.map((pergunta) => {
      if (pergunta.id === perguntaId) {
        if (pergunta.subPerguntas.length > 1) {
          // Só deleta se houver mais de uma
          const novasSubPerguntas = pergunta.subPerguntas.filter(
            (sub) => sub.id !== subPerguntaId
          );
          return { ...pergunta, subPerguntas: novasSubPerguntas };
        }
      }
      return pergunta;
    });
    setAventura({ ...aventura, perguntas: novasPerguntas });
  };

  return (
    <div className="nova-aventura-container" role="main">
      <h1 className="titulo-pagina">{pageTitle}</h1>
      <div className="form-cabecalho">
        <input
          type="text"
          className="input-titulo-aventura"
          placeholder="Digite o nome da aventura..."
          value={aventura.titulo || ""}
          onChange={handleTituloChange}
        />
        <div className="stepper-container">
          <label>Quantidade de salas</label>
          <div className="stepper-controls">
            <button
              onClick={() => handleNumSalasChange(aventura.salas.length - 1)}
            >
              -
            </button>
            <div className="stepper-numero-container">
              <span>{aventura.salas.length}</span>
            </div>
            <button
              onClick={() => handleNumSalasChange(aventura.salas.length + 1)}
            >
              +
            </button>
          </div>
        </div>
      </div>
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div className="lista-salas-container">
          <SortableContext
            items={aventura.salas || []}
            strategy={verticalListSortingStrategy}
          >
            {aventura.salas &&
              aventura.salas.map((sala, index) => (
                <SalaArrastavel
                  key={sala.id}
                  sala={sala}
                  index={index}
                  aventuraId={aventura.id}
                  handleSalaChange={handleSalaChange}
                  handleDeleteSala={handleDeleteSala}
                  navigate={navigate}
                />
              ))}
          </SortableContext>
        </div>
      </DndContext>

      <div className="perguntas-rolagem-container">
        <h2 className="subtitulo">Perguntas de Rolagem</h2>
        {aventura.perguntas &&
          aventura.perguntas.map((pergunta, index) => (
            <div
              key={pergunta.id}
              className="pergunta-grupo"
              aria-label="Search"
            >
              <span className="pergunta-grupo-numero">{index + 1}</span>
              <div className="sub-perguntas-lista">
                {pergunta.subPerguntas.map((sub) => (
                  <div key={sub.id} className="sub-pergunta-item">
                    <input
                      type="text"
                      className="pergunta-input-texto"
                      aria-label="Search"
                      value={sub.texto}
                      onChange={(e) =>
                        handleSubPerguntaChange(
                          pergunta.id,
                          sub.id,
                          e.target.value
                        )
                      }
                    />
                    <img
                      src={deleteIcon}
                      alt="Deletar linha"
                      className="delete-sub-pergunta-icon"
                      onClick={() => deletarSubPergunta(pergunta.id, sub.id)}
                    />
                  </div>
                ))}
                <button
                  className="add-sub-pergunta-btn"
                  onClick={() => adicionarSubPergunta(pergunta.id)}
                >
                  +
                </button>
              </div>
            </div>
          ))}
      </div>

      <div className="botoes-finais-container">
        <button className="btn-final btn-deletar" onClick={handleDelete}>
          Deletar Aventura
        </button>
        <button className="btn-final btn-concluir" onClick={handleSave}>
          {submitButtonText}
        </button>
      </div>
    </div>
  );
};

export default FormularioAventura;
