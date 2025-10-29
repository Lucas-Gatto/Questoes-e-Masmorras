import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import "./editar-sala.css";

const EditarSala = () => {
  const { aventuraId, salaId } = useParams();
  const navigate = useNavigate();
  const location = useLocation(); // Usado para ler o estado passado

  const [sala, setSala] = useState(null); // Armazena o objeto da sala inteira
  const fileInputRef = useRef(null); // Referência para o input de arquivo
  const [fileName, setFileName] = useState("Upload de Imagem ☁️"); // Nome do arquivo
  // const [isNewAventura, setIsNewAventura] = useState(false); // Mantido caso precise no futuro

  // --- useEffect para Carregar Dados da Sala ---
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const tipoFromUrl = queryParams.get("tipo");
    // const isNewParam = queryParams.get('isNew'); // Pode ler se precisar
    // setIsNewAventura(isNewParam === 'true');

    // 1. Tenta pegar os dados passados via navegação
    const passedSalaData = location.state?.salaData;
    console.log(
      "[EditarSala useEffect] Sala data passada via location.state:",
      passedSalaData
    );

    // 2. Verifica se os dados passados correspondem ao ID da URL
    if (passedSalaData && passedSalaData.id === Number(salaId)) {
      // Usa os dados passados (mais recentes)
      console.log("[EditarSala useEffect] Usando sala data do location.state");
      setSala({
        // Garante valores padrão caso não venham no state
        texto: "",
        vidaMonstro: "Média",
        enigma: "",
        resposta: "",
        opcoes: [],
        ...passedSalaData, // Dados passados
        tipo: tipoFromUrl, // Garante que o tipo da URL (o mais recente) prevaleça
      });
      if (passedSalaData.imagem) setFileName("Imagem salva");
    } else {
      // 3. FALLBACK: Carrega do localStorage
      console.log(
        "[EditarSala useEffect] Não encontrou state válido, carregando do localStorage..."
      );
      try {
        const aventurasSalvas =
          JSON.parse(localStorage.getItem("minhas_aventuras")) || [];
        const aventuraAtual = aventurasSalvas.find(
          (a) => a.id === Number(aventuraId)
        );
        if (aventuraAtual) {
          const salaAtual = (aventuraAtual.salas || []).find(
            (s) => s.id === Number(salaId)
          ); // Garante que salas exista
          if (salaAtual) {
            setSala({
              texto: "",
              vidaMonstro: "Média",
              enigma: "",
              resposta: "",
              opcoes: [],
              ...salaAtual,
              tipo: tipoFromUrl, // Garante tipo da URL
            });
            if (salaAtual.imagem) setFileName("Imagem salva");
            console.log(
              "[EditarSala useEffect] Sala carregada do localStorage."
            );
          } else {
            console.warn(
              `[EditarSala useEffect] Sala ID ${salaId} não encontrada no localStorage.`
            );
            alert("Sala não encontrada!");
            // Decide para onde voltar baseado no isNew (se necessário usar)
            // isNewParam === 'true' ? navigate(-1) : navigate(`/editar-aventura/${aventuraId}`);
            navigate(`/editar-aventura/${aventuraId}`); // Assume que volta para edição
          }
        } else {
          console.warn(
            `[EditarSala useEffect] Aventura ID ${aventuraId} não encontrada no localStorage.`
          );
          alert("Aventura não encontrada!");
          navigate("/suas-aventuras");
        }
      } catch (error) {
        console.error("Erro ao carregar dados da sala do localStorage:", error);
        navigate("/suas-aventuras");
      }
    }
    // Adiciona 'location' como dependência para reler o state se ele mudar
  }, [aventuraId, salaId, navigate, location]);
  // --- FIM DO useEffect ---

  // --- Funções de Manipulação ---

  // Salva o objeto 'sala' inteiro no localStorage
  const handleSalvar = () => {
    if (!sala) {
      console.error("Tentativa de salvar com 'sala' nula.");
      alert("Erro: Dados da sala não carregados.");
      return;
    }
    try {
      const aventurasSalvas =
        JSON.parse(localStorage.getItem("minhas_aventuras")) || [];
      const aventurasAtualizadas = aventurasSalvas.map((aventura) => {
        if (aventura.id === Number(aventuraId)) {
          // Garante que aventura.salas exista antes de mapear
          const salasOrig = Array.isArray(aventura.salas) ? aventura.salas : [];
          const existeSala = salasOrig.some((s) => s.id === Number(salaId));
          const salasAtualizadas = existeSala
            ? salasOrig.map((s) => (s.id === Number(salaId) ? sala : s))
            : [...salasOrig, sala]; // Se não existir, adiciona a nova sala
          return { ...aventura, salas: salasAtualizadas };
        }
        return aventura; // Retorna as outras aventuras sem modificação
      });

      console.log(
        "Salvando sala. Aventura completa atualizada:",
        aventurasAtualizadas
      ); // Log antes de salvar
      localStorage.setItem(
        "minhas_aventuras",
        JSON.stringify(aventurasAtualizadas)
      );
      alert("Sala atualizada com sucesso!");
      navigate(-1); // Volta para a página anterior (Nova ou Editar Aventura)
    } catch (error) {
      console.error("Erro ao salvar a sala:", error);
      alert("Ocorreu um erro ao salvar a sala.");
    }
  };

  // Atualiza qualquer campo do objeto 'sala' no estado
  const handleInputChange = (campo, valor) => {
    setSala((salaAtual) => ({ ...salaAtual, [campo]: valor }));
  };

  // Ativado pelo clique no botão 'Upload'
  const handleImageUploadClick = (e) => {
    e.preventDefault();
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Dispara o clique no input escondido
    }
  };

  // Ativado quando um arquivo é selecionado no input
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Callback executado após a leitura do arquivo
        handleInputChange("imagem", reader.result); // Salva a imagem como Base64 no estado
        setFileName(file.name); // Atualiza o nome no botão
      };
      reader.onerror = (error) => {
        // Adiciona tratamento de erro
        console.error("Erro ao ler o arquivo:", error);
        alert("Erro ao carregar a imagem.");
      };
      reader.readAsDataURL(file); // Inicia a leitura/conversão para Base64
    }
  };

  // --- Renderização Condicional do Corpo do Formulário ---
  const renderFormBody = () => {
    // Não renderiza nada se a sala ainda não foi carregada
    if (!sala) return <p>Carregando...</p>;

    console.log("[renderFormBody] Verificando sala.tipo:", sala.tipo); // Mantenha para depurar

    switch (sala.tipo) {
      // --- Layout para ENIGMA ---
      case "Enigma":
        console.log("[renderFormBody] Renderizando formulário Enigma.");
        return (
          <>
            <div className="form-group">
              <label htmlFor="enigma-sala">Enigma da Sala</label>
              <textarea
                id="enigma-sala"
                className="textarea-texto-sala"
                value={sala.enigma || ""} // Usa '' como fallback
                onChange={(e) => handleInputChange("enigma", e.target.value)}
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
                value={sala.resposta || ""} // Usa '' como fallback
                onChange={(e) => handleInputChange("resposta", e.target.value)}
                placeholder="Digite a resposta aqui..."
              />
            </div>
          </>
        );
      // --- Layout para MONSTRO ---
      case "Monstro":
        console.log("[renderFormBody] Renderizando formulário Monstro.");
        return (
          <>
            <div className="form-group">
              <label htmlFor="texto-sala">Texto da sala</label>
              <textarea
                id="texto-sala"
                className="textarea-texto-sala"
                value={sala.texto || ""} // Usa '' como fallback
                onChange={(e) => handleInputChange("texto", e.target.value)}
                rows="5"
              />
            </div>
            <div className="form-group">
              <label htmlFor="vida-monstro">Vida do monstro</label>
              <select
                id="vida-monstro"
                className="select-vida-monstro"
                value={sala.vidaMonstro} // O valor padrão já está no estado
                onChange={(e) =>
                  handleInputChange("vidaMonstro", e.target.value)
                }
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
      case "Alternativa":
        console.log("[renderFormBody] Renderizando formulário Alternativa.");
        return (
          <>
            <div className="form-group">
              <label htmlFor="texto-sala">Texto da sala</label>
              <textarea
                id="texto-sala"
                className="textarea-texto-sala"
                value={sala.texto || ""} // Usa '' como fallback
                onChange={(e) => handleInputChange("texto", e.target.value)}
                rows="5"
              />
            </div>
            <div className="form-group">
              <label>Opções de resposta (configuração em breve)</label>
              <div className="opcoes-container">
                {/* No futuro, mapear sala.opcoes aqui e torná-los inputs */}
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

  // --- Tela de carregamento ---
  if (!sala) {
    return (
      <div
        style={{
          backgroundColor: "#212529",
          minHeight: "100vh",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        Carregando sala... (Verifique o console F12 se travar aqui)
      </div>
    );
  }

  // --- JSX Principal ---
  return (
    <div role="main" className="editar-sala-container">
      <h1 className="editar-sala-titulo">Editar {sala.nome || "Sala"}</h1>{" "}
      {/* Usa fallback */}
      {/* Campo comum: Nome da Sala */}
      <div className="form-group">
        <label htmlFor="nome-sala">Nome da sala</label>
        <input
          id="nome-sala"
          type="text"
          className="input-nome-sala"
          value={sala.nome || ""} // Usa fallback
          onChange={(e) => handleInputChange("nome", e.target.value)}
        />
      </div>
      {/* Renderiza o corpo do formulário específico do tipo de sala */}
      {renderFormBody()}
      {/* Botões comuns: Imagem e Salvar */}
      <div className="form-group">
        <label htmlFor={`upload-${sala.id}`} className="visually-hidden">
          Imagem
        </label>
        <div className="botoes-sala-container">
          <button
            className="btn-sala btn-imagem"
            onClick={handleImageUploadClick}
          >
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
        id={`upload-${sala.id}`}
        onChange={handleFileChange}
        style={{ display: "none" }} // Mantém escondido
        accept="image/png, image/jpeg, image/jpg, image/gif" // Aceita formatos comuns
      />
    </div>
  );
};

export default EditarSala;
