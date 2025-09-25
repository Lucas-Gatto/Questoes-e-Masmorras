import React from 'react';
import './formulario-aventura.css';
import editIcon from '../assets/editar.png';
import deleteIcon from '../assets/excluir.png';

import { DndContext, closestCenter } from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
const SalaArrastavel = ({ sala, index, handleSalaChange, handleDeleteSala }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: sala.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="sala-item">
      <span className="sala-numero">{index + 1}</span>

      <label className="sala-label-nome">Nome da sala:</label>
      <input 
        type="text" 
        className="sala-input-nome" 
        value={sala.nome}
        onChange={(e) => handleSalaChange(sala.id, 'nome', e.target.value)}
      />

      <label className="sala-label-tipo">Tipo de sala:</label>
      <div className="sala-tipo-container">
        <select 
          className="sala-select-tipo" 
          value={sala.tipo}
          onChange={(e) => handleSalaChange(sala.id, 'tipo', e.target.value)}
        >
          <option value="Enigma">Enigma</option>
          <option value="Alternativa">Alternativa</option>
          <option value="Monstro">Monstro</option>
        </select>
      </div>
      
      <div className="sala-acoes">
        <img src={editIcon} alt="Editar" />
        <img src={deleteIcon} alt="Deletar" onClick={() => handleDeleteSala(sala.id)} />
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
  submitButtonText
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
        novasSalas.push({ id: Date.now() + i, nome: `${i + 1}ª Sala`, tipo: 'Enigma' });
      }
    }
    setAventura({ ...aventura, salas: novasSalas });
  };

  const handleSalaChange = (id, campo, valor) => {
    const novasSalas = aventura.salas.map(sala =>
      sala.id === id ? { ...sala, [campo]: valor } : sala
    );
    setAventura({ ...aventura, salas: novasSalas });
  };

  const handleDeleteSala = (idParaDeletar) => {
    if (aventura.salas.length <= 1) {
      alert("A aventura deve ter pelo menos uma sala.");
      return;
    }
    const novasSalas = aventura.salas.filter(sala => sala.id !== idParaDeletar);
    setAventura({ ...aventura, salas: novasSalas });
  };

  const handlePerguntaChange = (id, novoTexto) => {
    const novasPerguntas = aventura.perguntas.map(pergunta =>
        pergunta.id === id ? { ...pergunta, texto: novoTexto } : pergunta
    );
    setAventura({ ...aventura, perguntas: novasPerguntas });
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setAventura((aventuraAtual) => {
        const oldIndex = aventuraAtual.salas.findIndex((sala) => sala.id === active.id);
        const newIndex = aventuraAtual.salas.findIndex((sala) => sala.id === over.id);
        return {
          ...aventuraAtual,
          salas: arrayMove(aventuraAtual.salas, oldIndex, newIndex),
        };
      });
    }
  };

  return (
    <div className="nova-aventura-container">
      <h2 className="titulo-pagina">{pageTitle}</h2>

      <div className="form-cabecalho">
        <input 
          type="text" 
          className="input-titulo-aventura"
          placeholder="Digite o nome da aventura..."
          value={aventura.titulo || ''}
          onChange={handleTituloChange}
        />
        <div className="stepper-container">
          <label>Quantidade de salas</label>
          <div className="stepper-controls">
            <button onClick={() => handleNumSalasChange(aventura.salas.length - 1)}>-</button>
            <div className="stepper-numero-container">
              <span>{aventura.salas.length}</span>
            </div>
            <button onClick={() => handleNumSalasChange(aventura.salas.length + 1)}>+</button>
          </div>
        </div>
      </div>

      <DndContext
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <div className="lista-salas-container">
          <SortableContext
            items={aventura.salas}
            strategy={verticalListSortingStrategy}
          >
            {aventura.salas.map((sala, index) => (
              <SalaArrastavel 
                key={sala.id} 
                sala={sala} 
                index={index} 
                handleSalaChange={handleSalaChange}
                handleDeleteSala={handleDeleteSala}
              />
            ))}
          </SortableContext>
        </div>
      </DndContext>

      <div className="perguntas-rolagem-container">
        <h3 className="subtitulo">Perguntas de Rolagem</h3>
        {aventura.perguntas.map((pergunta, index) => (
          <div key={pergunta.id} className="pergunta-item">
            <span className="pergunta-numero">{index + 1}</span>
            <input 
              type="text" 
              className="pergunta-input-texto"
              value={pergunta.texto}
              onChange={(e) => handlePerguntaChange(pergunta.id, e.target.value)}
            />
            <div className="pergunta-acoes">
              <img src={editIcon} alt="Editar" />
            </div>
          </div>
        ))}
      </div>

      <div className="botoes-finais-container">
        <button className="btn-final btn-deletar" onClick={handleDelete}>Deletar Aventura</button>
        <button className="btn-final btn-concluir" onClick={handleSave}>{submitButtonText}</button>
      </div>
    </div>
  );
};

export default FormularioAventura;