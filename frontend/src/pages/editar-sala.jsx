import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import './editar-sala.css';

const EditarSala = () => {
  const { aventuraId, salaId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [sala, setSala] = useState(null);
  const fileInputRef = useRef(null);
  const [fileName, setFileName] = useState('Upload de Imagem ☁️');
  // const [isNewAventura, setIsNewAventura] = useState(false); // Mantido caso precise

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const tipoFromUrl = queryParams.get('tipo');
    // const isNewParam = queryParams.get('isNew');
    // setIsNewAventura(isNewParam === 'true');

    try {
      const aventurasSalvas = JSON.parse(localStorage.getItem('minhas_aventuras')) || [];
      const aventuraAtual = aventurasSalvas.find(a => a.id === Number(aventuraId));

      if (aventuraAtual) {
        const salaAtual = aventuraAtual.salas.find(s => s.id === Number(salaId));
        if (salaAtual) {
          setSala({
            texto: '', vidaMonstro: 'Média', enigma: '', resposta: '', opcoes: [],
            ...salaAtual,
            tipo: tipoFromUrl
          });
          if (salaAtual.imagem) {
            setFileName("Imagem salva");
          }
        } else {
          alert('Sala não encontrada!');
          navigate(`/editar-aventura/${aventuraId}`);
        }
      } else {
        alert('Aventura não encontrada!');
        navigate('/suas-aventuras');
      }
    } catch (error) {
      console.error("Erro ao carregar dados da sala:", error);
      navigate('/suas-aventuras');
    }
  }, [aventuraId, salaId, navigate, location.search]);

  // Salva o objeto 'sala' inteiro no localStorage
  const handleSalvar = () => {
    if (!sala) return;
    try {
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
      navigate(-1); // Volta para a página anterior
    } catch (error) {
       console.error("Erro ao salvar a sala:", error);
       alert("Ocorreu um erro ao salvar a sala.");
    }
  };

  // Atualiza o estado da sala
  const handleInputChange = (campo, valor) => {
    setSala(salaAtual => ({ ...salaAtual, [campo]: valor }));
  };

  // Funções de Upload de Imagem (sem alterações)
  const handleImageUploadClick = (e) => {
    e.preventDefault();
    if (fileInputRef.current) {
        fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleInputChange('imagem', reader.result); // Salva como Base64
        setFileName(file.name);
      };
      reader.onerror = (error) => {
          console.error("Erro ao ler o arquivo:", error);
          alert("Erro ao carregar a imagem.");
      };
      reader.readAsDataURL(file);
    }
  };

  // --- 👇 FUNÇÃO RENDERFORM COM O JSX DOS FORMULÁRIOS DENTRO 👇 ---
  const renderFormBody = () => {
    if (!sala) return <p>Carregando...</p>;

    console.log("[renderFormBody] Verificando sala.tipo:", sala.tipo); // Mantenha para depurar

    switch (sala.tipo) {
      case 'Enigma':
        console.log("[renderFormBody] Renderizando formulário Enigma.");
        return (
          <>
            <div className="form-group">
              <label htmlFor="enigma-sala">Enigma da Sala</label>
              <textarea
                id="enigma-sala"
                className="textarea-texto-sala"
                value={sala.enigma || ''}
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
                value={sala.resposta || ''}
                onChange={(e) => handleInputChange('resposta', e.target.value)}
                placeholder="Digite a resposta aqui..."
              />
            </div>
          </>
        );
      case 'Monstro':
        console.log("[renderFormBody] Renderizando formulário Monstro.");
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
      case 'Alternativa':
        console.log("[renderFormBody] Renderizando formulário Alternativa.");
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
                {/* Aqui ainda podemos melhorar para permitir edição das opções */}
                <button className="btn-opcao red">Opção 1</button>
                <button className="btn-opcao yellow">Opção 2</button>
                <button className="btn-opcao green">Opção 3</button>
                <button className="btn-opcao blue">Opção 4</button>
              </div>
            </div>
          </>
        );
      default:
        console.log(`[renderFormBody] NENHUM MATCH. Tipo "${sala.tipo}".`);
        return <p>Tipo de sala desconhecido: {sala.tipo}.</p>;
    }
  };
  // --- FIM DA FUNÇÃO RENDERFORM ---


  if (!sala) {
    return (
      <div style={{ backgroundColor: '#212529', minHeight: '100vh', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        Carregando sala... (Verifique o console F12 se travar aqui)
      </div>
    );
  }

  // --- JSX Principal ---
  return (
    <div className="editar-sala-container">
      <h1 className="editar-sala-titulo">Editar {sala.nome || 'Sala'}</h1>

      <div className="form-group">
        <label htmlFor="nome-sala">Nome da sala</label>
        <input
          id="nome-sala"
          type="text"
          className="input-nome-sala"
          value={sala.nome || ''}
          onChange={(e) => handleInputChange('nome', e.target.value)}
        />
      </div>

      {/* Renderiza o corpo do formulário específico do tipo de sala */}
      {renderFormBody()}

      {/* Botões comuns: Imagem e Salvar */}
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