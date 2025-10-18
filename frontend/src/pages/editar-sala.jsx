import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import './editar-sala.css';

const EditarSala = () => {
  const { aventuraId, salaId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [sala, setSala] = useState(null); // Armazena o objeto da sala inteira
  const fileInputRef = useRef(null); // Referência para o input de arquivo
  const [fileName, setFileName] = useState('Upload de Imagem ☁️'); // Nome do arquivo

  useEffect(() => {
    // Pega o tipo da sala da URL (ex: ?tipo=Enigma)
    const queryParams = new URLSearchParams(location.search);
    const tipoFromUrl = queryParams.get('tipo');

    const aventurasSalvas = JSON.parse(localStorage.getItem('minhas_aventuras')) || [];
    const aventuraAtual = aventurasSalvas.find(a => a.id === Number(aventuraId));
    
    if (aventuraAtual) {
      const salaAtual = aventuraAtual.salas.find(s => s.id === Number(salaId));
      if (salaAtual) {
        // Define o estado da sala com valores padrão
        setSala({
          texto: '',
          vidaMonstro: 'Média',
          opcoes: [/* ... */],
          enigma: '',
          resposta: '',
          ...salaAtual,      // Carrega os dados salvos por cima dos padrões
          tipo: tipoFromUrl  // Garante que o tipo da URL seja o definitivo
        });
      } else {
        alert('Sala não encontrada!');
        navigate(`/editar-aventura/${aventuraId}`);
      }
    } else {
      alert('Aventura não encontrada!');
      navigate('/suas-aventuras');
    }
  }, [aventuraId, salaId, navigate, location.search]);

  // Salva o objeto 'sala' inteiro de volta no localStorage
  const handleSalvar = () => {
    const aventurasSalvas = JSON.parse(localStorage.getItem('minhas_aventuras')) || [];
    const aventurasAtualizadas = aventurasSalvas.map(aventura => {
      if (aventura.id === Number(aventuraId)) {
        // Encontra e substitui a sala específica dentro da aventura
        const salasAtualizadas = aventura.salas.map(s => 
          s.id === Number(salaId) ? sala : s
        );
        return { ...aventura, salas: salasAtualizadas };
      }
      return aventura;
    });

    localStorage.setItem('minhas_aventuras', JSON.stringify(aventurasAtualizadas));
    alert('Sala atualizada com sucesso!');
    navigate(`/editar-aventura/${aventuraId}`); // Volta para a edição da aventura
  };

  // Atualiza qualquer campo do objeto 'sala' no estado
  const handleInputChange = (campo, valor) => {
    setSala(salaAtual => ({ ...salaAtual, [campo]: valor }));
  };

  // --- Funções de Upload de Imagem ---

  // Ativado pelo clique no botão 'Upload'
  const handleImageUploadClick = (e) => {
    e.preventDefault();
    fileInputRef.current.click(); // Clica no input escondido
  };

  // Ativado quando um arquivo é selecionado no input
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name); // Mostra o nome do arquivo no botão
      console.log("Arquivo selecionado:", file.name);
      // Futuramente, você pode converter para base64 e salvar em sala.imagem
    }
  };

  // --- Renderização Condicional ---

  // Esta função decide qual "miolo" do formulário deve ser renderizado
  const renderFormBody = () => {
    if (!sala) return <p>Carregando...</p>;

    switch (sala.tipo) {
      // --- Layout para ENIGMA ---
      case 'Enigma':
        return (
          <>
            <div className="form-group">
              <label htmlFor="enigma-sala">Enigma da Sala</label>
              <textarea 
                id="enigma-sala"
                className="textarea-texto-sala"
                value={sala.enigma}
                onChange={(e) => handleInputChange('enigma', e.target.value)}
                rows="3"
                placeholder="Digite o enigma aqui..."
              />
            </div>
            <div className="form-group">
              <label htmlFor="resposta-enigma">Resposta do enigma</label>
              <input 
                id="resposta-enigma"
                type="text"
                className="input-resposta-enigma"
                value={sala.resposta}
                onChange={(e) => handleInputChange('resposta', e.target.value)}
                placeholder="Digite a resposta aqui..."
              />
            </div>
          </>
        );

      // --- Layout para MONSTRO ---
      case 'Monstro':
        return (
          <>
            <div className="form-group">
              <label htmlFor="texto-sala">Texto da sala</label>
              <textarea 
                id="texto-sala"
                className="textarea-texto-sala"
                value={sala.texto || ''}
                onChange={(e) => handleInputChange('texto', e.target.value)}
                rows="5"
              />
            </div>
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
          </>
        );

      // --- Layout para ALTERNATIVA ---
      case 'Alternativa':
        return (
          <>
            <div className="form-group">
              <label htmlFor="texto-sala">Texto da sala</label>
              <textarea 
                id="texto-sala"
                className="textarea-texto-sala"
                value={sala.texto || ''}
                onChange={(e) => handleInputChange('texto', e.target.value)}
                rows="5"
              />
            </div>
            <div className="form-group">
              <label>Opções de resposta (configuração em breve)</label>
              <div className="opcoes-container">
                <button className="btn-opcao red">Opção 1</button>
                <button className="btn-opcao yellow">Opção 2</button>
                <button className="btn-opcao green">Opção 3</button>
                <button className="btn-opcao blue">Opção 4</button>
              </div>
            </div>
          </>
        );
      default:
        return <p>Tipo de sala desconhecido. Por favor, volte e tente novamente.</p>;
    }
  };
  
  // Tela de carregamento enquanto 'sala' é nulo
  if (!sala) {
    return (
      <div style={{ backgroundColor: '#212529', minHeight: '100vh', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        Carregando sala...
      </div>
    );
  }

  // --- O JSX principal (Return) ---
  return (
    <div className="editar-sala-container">
      <h1 className="editar-sala-titulo">Editar {sala.nome}</h1>
      
      {/* Campo "Nome da sala" (comum a todos) */}
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

      {/* Renderiza o "miolo" do formulário (Enigma, Monstro ou Alternativa) */}
      {renderFormBody()}

      {/* Botões "Imagem" e "Editar" (comuns a todos, conforme sua última alteração) */}
      <div className="form-group">
        <label>Imagem</label>
        <div className="botoes-sala-container">
          <button className="btn-sala btn-imagem" onClick={handleImageUploadClick}>
            {fileName}
          </button>
          <button className="btn-sala btn-salvar" onClick={handleSalvar}>
            Editar
          </button>
        </div>
      </div>

      {/* Input de arquivo escondido */}
      <input 
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
        accept="image/png, image/jpeg, image/jpg, image/gif" 
      />
    </div>
  );
};

export default EditarSala;