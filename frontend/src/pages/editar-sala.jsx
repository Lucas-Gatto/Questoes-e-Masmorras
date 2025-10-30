import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import './editar-sala.css';

const EditarSala = () => {
  const { aventuraId, salaId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Estado LOCAL apenas para a sala sendo editada NESTA tela
  const [editingSala, setEditingSala] = useState(null);
  const fileInputRef = useRef(null); // Referência para o input de arquivo escondido
  const [fileName, setFileName] = useState('Upload de Imagem ☁️'); // Nome do arquivo no botão

  // --- useEffect para Carregar Dados da Sala ---
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const tipoFromUrl = queryParams.get('tipo');
    // const isNewParam = queryParams.get('isNew'); // Pode ler se precisar

    // 1. Tenta pegar os dados passados via navegação (location.state)
    const passedSalaData = location.state?.salaData;
    console.log("[EditarSala useEffect] Sala data passada via location.state:", passedSalaData);

    let salaInicial = null; // Armazenará os dados carregados
    let origemDados = 'Nenhum'; // Para log

    // 2. Verifica se os dados passados correspondem ao ID da URL
    if (passedSalaData && passedSalaData.id === Number(salaId)) {
      console.log("[EditarSala useEffect] Usando sala data do location.state");
      salaInicial = passedSalaData;
      origemDados = 'State';
    } else {
      // 3. FALLBACK: Carrega do localStorage
      console.log("[EditarSala useEffect] Não encontrou state válido ou ID não bateu, carregando do localStorage...");
      try {
        const aventurasSalvas = JSON.parse(localStorage.getItem('minhas_aventuras')) || [];
        const aventuraAtual = aventurasSalvas.find(a => a.id === Number(aventuraId));
        if (aventuraAtual) {
          const salaDoStorage = (aventuraAtual.salas || []).find(s => s.id === Number(salaId)); // Garante que salas exista
          if (salaDoStorage) {
            salaInicial = salaDoStorage;
            origemDados = 'LocalStorage';
            console.log("[EditarSala useEffect] Sala carregada do localStorage.");
          }
        }
      } catch (error) {
        console.error("Erro no fallback ao carregar do localStorage:", error);
        // Não define salaInicial, cairá no erro abaixo
      }
    }

    // 4. Processa a sala carregada (ou falha)
    if (salaInicial) {
      // Garante que 'opcoes' exista e tenha 4 itens com IDs e texto
      const opcoesPadrao = [
        { id: 1, texto: '' }, { id: 2, texto: '' }, { id: 3, texto: '' }, { id: 4, texto: '' },
      ];
      // Mescla opções salvas com o padrão para garantir 4 opções com IDs corretos
      const opcoesFinais = opcoesPadrao.map((opcaoDefault) => {
        const opcaoExistente = Array.isArray(salaInicial.opcoes)
          ? salaInicial.opcoes.find(o => o.id === opcaoDefault.id)
          : null;
        return {
          ...opcaoDefault, // Garante id: 1, 2, 3, 4
          texto: opcaoExistente ? (opcaoExistente.texto || '') : '', // Pega texto existente ou vazio
        };
      });

      // Define o estado LOCAL 'editingSala'
      setEditingSala({
        // Define padrões para todos os campos para evitar undefined
        texto: '', vidaMonstro: 'Média', enigma: '', resposta: '', imagem: '',
        ...salaInicial,     // Carrega dados da origem (state ou storage)
        // Mantém o tipo existente se a URL não informar um válido
        tipo: (['Enigma','Alternativa','Monstro'].includes(tipoFromUrl) ? tipoFromUrl : salaInicial.tipo),
        opcoes: opcoesFinais, // Usa as opções garantidas
        opcaoCorretaId: salaInicial.opcaoCorretaId ?? null, // inicializa correta
      });

      // Atualiza nome do botão de imagem se já houver uma
      if (salaInicial.imagem) {
        setFileName("Imagem salva");
      }
      console.log(`[EditarSala useEffect] Estado 'editingSala' definido. Origem: ${origemDados}`);
    } else {
      // Se não conseguiu carregar de nenhuma fonte
      console.error(`[EditarSala useEffect] Falha ao carregar dados para Sala ID ${salaId} da Aventura ID ${aventuraId}`);
      alert('Erro: Não foi possível carregar os dados desta sala.');
      navigate(-1); // Volta se não conseguir carregar
    }

  }, [aventuraId, salaId, navigate, location]); // location garante releitura do state


  // --- Funções de Manipulação ---

  // Salva o objeto 'editingSala' de volta no localStorage
  const handleSalvar = () => {
    if (!editingSala) {
      console.error("Tentativa de salvar com 'editingSala' nula.");
      alert("Erro: Dados da sala não carregados.");
      return;
    }
    try {
      // 1. Lê a lista ATUAL do localStorage
      const aventurasSalvas = JSON.parse(localStorage.getItem('minhas_aventuras')) || [];
      console.log("handleSalvar: Lendo do storage ANTES de salvar:", aventurasSalvas); // Log

      // 2. Mapeia para encontrar e atualizar
      let aventuraEncontrada = false;
      let salaEncontradaParaUpdate = false; // Flag para verificar

      const aventurasAtualizadas = aventurasSalvas.map(aventura => {
        if (aventura.id === Number(aventuraId)) {
          aventuraEncontrada = true;
          const salasExistentes = aventura.salas || [];
          // Mapeia as salas para substituir a correta
          const salasAtualizadas = salasExistentes.map(s => {
            if (s.id === Number(salaId)) {
              salaEncontradaParaUpdate = true;
              return editingSala; // Substitui pela sala do estado local
            }
            return s;
          });
          // Retorna a aventura com a lista de salas atualizada
          return { ...aventura, salas: salasAtualizadas };
        }
        return aventura; // Retorna as outras aventuras sem modificação
      });

      // Tratamento de erros caso algo não seja encontrado
      if (!aventuraEncontrada) {
        console.error(`handleSalvar: Aventura ID ${aventuraId} não foi encontrada no localStorage. Nada será salvo.`);
        alert("Erro crítico: A aventura principal não foi encontrada no armazenamento.");
        navigate('/suas-aventuras'); // Redireciona por segurança
        return;
      }
      if (!salaEncontradaParaUpdate) {
        // Isso não deveria acontecer se o carregamento inicial funcionou, mas é uma segurança
        console.warn(`handleSalvar: Sala ID ${salaId} não encontrada na Aventura ID ${aventuraId} durante o map. Verifique a lógica.`);
        alert("Atenção: A sala que você editou não foi encontrada na aventura salva. Suas alterações podem não ter sido aplicadas.");
      }

      // 3. Salva a lista COMPLETA E ATUALIZADA de volta
      console.log("handleSalvar: Salvando de volta no storage:", aventurasAtualizadas);
      localStorage.setItem('minhas_aventuras', JSON.stringify(aventurasAtualizadas));

      // 4. Sincroniza com backend: PUT se houver backendId, senão tenta criar via POST
      try {
        const aventuraAtualizada = aventurasAtualizadas.find(a => a.id === Number(aventuraId));
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
              console.warn('[EditarSala] Falha ao sincronizar alterações no backend. Status:', res.status, txt);
            }
          }).catch(err => console.warn('[EditarSala] Erro de rede ao sincronizar no backend:', err));
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
              console.warn('[EditarSala] Falha ao criar aventura no backend. Status:', res.status, txt);
              return;
            }
            const data = await res.json();
            try {
              const aventurasSalvas2 = JSON.parse(localStorage.getItem('minhas_aventuras')) || [];
              const idx2 = aventurasSalvas2.findIndex(a => a.id === Number(aventuraId));
              if (idx2 > -1) {
                aventurasSalvas2[idx2] = { ...aventurasSalvas2[idx2], backendId: data._id };
                localStorage.setItem('minhas_aventuras', JSON.stringify(aventurasSalvas2));
                console.log('[EditarSala] backendId criado e sincronizado:', data._id);
              }
            } catch (e) {
              console.warn('[EditarSala] Falha ao atualizar backendId no localStorage:', e);
            }
          }).catch(err => console.warn('[EditarSala] Erro de rede ao criar aventura no backend:', err));
        }
      } catch (e) {
        console.warn('[EditarSala] Erro ao preparar sincronização com backend:', e);
      }
      alert('Sala atualizada com sucesso!');
      navigate(-1); // Volta para a página anterior (Nova ou Editar Aventura)

    } catch (error) {
      console.error("Erro ao salvar a sala no localStorage:", error);
      alert("Ocorreu um erro ao salvar a sala.");
    }
  };

  // Atualiza qualquer campo do objeto 'editingSala' no estado local
  const handleInputChange = (campo, valor) => {
    setEditingSala(salaAtual => {
      if (!salaAtual) return null; // Segurança
      return { ...salaAtual, [campo]: valor };
    });
  };

  // Atualiza o texto de uma opção específica no estado local 'editingSala'
  const handleOpcaoChange = (opcaoId, novoTexto) => {
    setEditingSala(salaAtual => {
      if (!salaAtual || !Array.isArray(salaAtual.opcoes)) {
          console.error("handleOpcaoChange: Estado da sala ou opções inválido.");
          return salaAtual;
      }
      const novasOpcoes = salaAtual.opcoes.map(opcao =>
          opcao.id === opcaoId ? { ...opcao, texto: novoTexto } : opcao
      );
      return { ...salaAtual, opcoes: novasOpcoes };
    });
  };

  // Marca qual opção é a correta na sala Alternativa
  const handleOpcaoCorretaSelect = (opcaoId) => {
    setEditingSala(salaAtual => ({
      ...salaAtual,
      opcaoCorretaId: opcaoId,
    }));
  };

  // Ativado pelo clique no botão 'Upload de Imagem'
  const handleImageUploadClick = (e) => {
    e.preventDefault();
    if (fileInputRef.current) {
      fileInputRef.current.value = null; // Reseta para permitir selecionar o mesmo arquivo
      fileInputRef.current.click(); // Dispara o clique no input escondido
    }
  };

  // Ativado quando um arquivo é selecionado no input de arquivo
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Callback executado após a leitura do arquivo
        handleInputChange('imagem', reader.result); // Salva a imagem como Base64 no estado
        setFileName(file.name); // Atualiza o nome no botão
      };
      reader.onerror = (error) => { // Adiciona tratamento de erro
        console.error("Erro ao ler o arquivo:", error);
        alert("Erro ao carregar a imagem.");
        setFileName('Upload de Imagem ☁️'); // Reseta o nome do botão
      };
      reader.readAsDataURL(file); // Inicia a leitura/conversão para Base64
    } else {
       setFileName('Upload de Imagem ☁️'); // Reseta se nenhum arquivo for selecionado
    }
  };

  // --- Renderização Condicional do Corpo do Formulário ---
  const renderFormBody = () => {
    // Não renderiza nada se a sala ainda não foi carregada
    if (!editingSala) return <p>Carregando formulário...</p>; // Mensagem mais clara

    console.log("[renderFormBody] Renderizando para sala.tipo:", editingSala.tipo);

    switch (editingSala.tipo) {
      // --- Layout para ENIGMA ---
      case 'Enigma':
        return (
          <>
            <div className="form-group">
              <label htmlFor="enigma-sala">Enigma da Sala</label>
              <textarea
                id="enigma-sala"
                className="textarea-texto-sala"
                value={editingSala.enigma || ''} // Usa '' como fallback
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
                value={editingSala.resposta || ''} // Usa '' como fallback
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
                value={editingSala.texto || ''} // Usa '' como fallback
                onChange={(e) => handleInputChange('texto', e.target.value)}
                rows="5"
                placeholder="Digite a descrição do monstro/ambiente..."
              />
            </div>
            <div className="form-group">
              <label htmlFor="vida-monstro">Vida do monstro</label>
              <select
                id="vida-monstro"
                className="select-vida-monstro"
                value={editingSala.vidaMonstro || 'Média'} // Usa 'Média' como fallback
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
                value={editingSala.texto || ''} // Usa '' como fallback
                onChange={(e) => handleInputChange('texto', e.target.value)}
                rows="5"
                placeholder="Digite a descrição da situação/pergunta..."
              />
            </div>
            <div className="form-group">
              <label>Opções de resposta</label>
              <div className="opcoes-container-editavel">
                {/* Mapeia o array 'opcoes' para criar os inputs */}
                {(editingSala.opcoes || []).map((opcao, index) => { // Garante que opcoes exista
                  const cores = ['red', 'yellow', 'green', 'blue'];
                  const corClasse = cores[index % cores.length];
                  // Usa o ID da opção (1 a 4) garantido pelo useEffect
                  const idOpcao = opcao.id;
                  return (
                    <div key={idOpcao} className={`opcao-item ${corClasse}`}>
                      <label htmlFor={`opcao-texto-${idOpcao}`} className="opcao-label">Opção {idOpcao}:</label>
                      <input
                        type="text"
                        id={`opcao-texto-${idOpcao}`}
                        className="input-opcao-texto"
                        value={opcao.texto || ''} // Mostra o texto atual
                        onChange={(e) => handleOpcaoChange(idOpcao, e.target.value)} // Atualiza o estado
                        placeholder={`Digite o texto da opção ${idOpcao}...`}
                      />
                      <label className="opcao-correta-label">
                        <input
                          type="radio"
                          name="opcao-correta"
                          className="opcao-correta-radio"
                          checked={editingSala.opcaoCorretaId === idOpcao}
                          onChange={() => handleOpcaoCorretaSelect(idOpcao)}
                        />
                        Correta
                      </label>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        );
      default:
        console.error(`[renderFormBody] Tipo de sala inválido ou não reconhecido: "${editingSala.tipo}".`);
        return <p style={{ color: 'red', fontWeight: 'bold' }}>Erro: Tipo de sala inválido.</p>;
    }
  };

  // --- Tela de carregamento ---
  if (!editingSala) {
    return (
      <div style={{ backgroundColor: '#212529', minHeight: '100vh', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        Carregando sala... (Verifique o console F12 se travar aqui)
      </div>
    );
  }

  // --- JSX Principal ---
  return (
    <div className="editar-sala-container">
      <h1 className="editar-sala-titulo">Editar {editingSala.nome || 'Sala'}</h1> {/* Usa fallback */}

      {/* Campo comum: Nome da Sala */}
      <div className="form-group">
        <label htmlFor="nome-sala">Nome da sala</label>
        <input
          id="nome-sala"
          type="text"
          className="input-nome-sala"
          value={editingSala.nome || ''} // Usa fallback
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
        style={{ display: 'none' }} // Mantém escondido
        accept="image/png, image/jpeg, image/jpg, image/gif" // Aceita formatos comuns
      />
    </div>
  );
};

export default EditarSala;