// Em: src/pages/editar-sala.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom'; // 1. Importe useLocation
import './editar-sala.css';

const EditarSala = () => {
  const { aventuraId, salaId } = useParams();
  const navigate = useNavigate();
  const location = useLocation(); // 2. Obtenha a localização atual

  const [sala, setSala] = useState(null);

  useEffect(() => {
    // 3. Leia o parâmetro 'tipo' da URL
    const queryParams = new URLSearchParams(location.search);
    const tipoFromUrl = queryParams.get('tipo');

    const aventurasSalvas = JSON.parse(localStorage.getItem('minhas_aventuras')) || [];
    const aventuraAtual = aventurasSalvas.find(a => a.id === Number(aventuraId));
    
    if (aventuraAtual) {
      const salaAtual = aventuraAtual.salas.find(s => s.id === Number(salaId));
      if (salaAtual) {
        // Monta o objeto da sala para edição
        const salaParaEditar = {
          // Valores padrão
          texto: '',
          vidaMonstro: 'Média',
          opcoes: [
            { texto: 'Opção 1', cor: 'red' },
            { texto: 'Opção 2', cor: 'yellow' },
            { texto: 'Opção 3', cor: 'green' },
            { texto: 'Opção 4', cor: 'blue' },
          ],
          // Dados salvos no localStorage
          ...salaAtual,
          // 4. SOBRESCREVE o tipo com o valor da URL, garantindo que seja o correto!
          tipo: tipoFromUrl 
        };
        setSala(salaParaEditar);
      } else {
        alert('Sala não encontrada!');
        navigate(`/editar-aventura/${aventuraId}`);
      }
    } else {
      alert('Aventura não encontrada!');
      navigate('/suas-aventuras');
    }
  // Adicionamos 'location.search' como dependência para o useEffect rodar se a URL mudar
  }, [aventuraId, salaId, navigate, location.search]);

  // A função handleSalvar continua igual, pois ela salva o objeto 'sala' inteiro,
  // que já terá o tipo correto.
  const handleSalvar = () => {
    const aventurasSalvas = JSON.parse(localStorage.getItem('minhas_aventuras')) || [];
    const aventurasAtualizadas = aventurasSalvas.map(aventura => {
      if (aventura.id === Number(aventuraId)) {
        const salasAtualizadas = aventura.salas.map(s => 
          s.id === Number(salaId) ? sala : s
        );
        return { ...aventura, salas: salasAtualizadas };
      }
      return aventura;
    });
    localStorage.setItem('minhas_aventuras', JSON.stringify(aventurasAtualizadas));
    alert('Sala atualizada com sucesso!');
    navigate(`/editar-aventura/${aventuraId}`);
  };

  const handleInputChange = (campo, valor) => {
    setSala(salaAtual => ({ ...salaAtual, [campo]: valor }));
  };
  
  // As funções 'renderConteudoDaSala' e 'renderBotoesDeAcao' continuam as mesmas
  const renderConteudoDaSala = () => {

    switch (sala.tipo) {
      case 'Monstro':
        return (
          <div className="form-group">
            <label htmlFor="vida-monstro">Vida do monstro</label>
            <select
              id="vida-monstro"
              className="select-vida-monstro"
              value={sala.vidaMonstro}
              onChange={(e) => handleInputChange('vidaMonstro', e.target.value)}
            >
              <option value="Baixa">Baixa</option>
              <option value="Média">Média</option>
              <option value="Alta">Alta</option>
              <option value="Chefe">Chefe</option>
            </select>
          </div>
        );
      case 'Alternativa':
        return (
          <div className="form-group">
            <label>Opções de resposta</label>
            <div className="opcoes-container">
              <button className="btn-opcao red">Opção 1</button>
              <button className="btn-opcao yellow">Opção 2</button>
              <button className="btn-opcao green">Opção 3</button>
              <button className="btn-opcao blue">Opção 4</button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const renderBotoesDeAcao = () => {
    // ... (código sem alterações)
    if (sala.tipo === 'Alternativa') {
      return null;
    }
    return (
      <div className="form-group">
        <label>Imagem</label>
        <div className="botoes-sala-container">
          <button className="btn-sala btn-imagem">☁️</button>
          <button className="btn-sala btn-salvar" onClick={handleSalvar}>
            Editar
          </button>
        </div>
      </div>
    );
  };
  
  if (!sala) {
    return <div>Carregando sala...</div>;
  }

  return (
    <div className="editar-sala-container">
      <h1 className="editar-sala-titulo">Editar {sala.nome}</h1>
      
      <div className="form-group">
        <label htmlFor="nome-sala">Nome da sala</label>
        <input 
          id="nome-sala"
          type="text" 
          className="input-nome-sala"
          value={sala.nome}
          onChange={(e) => handleInputChange('nome', e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="texto-sala">Texto da sala</label>
        <textarea 
          id="texto-sala"
          className="textarea-texto-sala"
          value={sala.texto}
          onChange={(e) => handleInputChange('texto', e.target.value)}
          rows="5"
        />
      </div>

      {renderConteudoDaSala()}
      {renderBotoesDeAcao()}
    </div>
  );
};

export default EditarSala;