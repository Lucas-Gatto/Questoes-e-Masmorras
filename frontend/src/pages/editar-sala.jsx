import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import "./editar-sala.css";
import API_URL from "../config";

const EditarSala = () => {
  const { aventuraId, salaId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const backendId = location.state?.backendId || null;

  // Estado LOCAL para a sala sendo editada
  const [editingSala, setEditingSala] = useState(null);
  const fileInputRef = useRef(null);
  const [fileName, setFileName] = useState("Upload de Imagem ☁️");

  // Carrega dados iniciais da sala (state ou localStorage)
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const tipoFromUrl = queryParams.get("tipo");

    const passedSalaData = location.state?.salaData;
    let salaInicial = null;

    if (passedSalaData && passedSalaData.id === Number(salaId)) {
      salaInicial = passedSalaData;
    } else {
      try {
        const aventurasSalvas =
          JSON.parse(localStorage.getItem("minhas_aventuras")) || [];
        const aventuraAtual = aventurasSalvas.find(
          (a) => a.id === Number(aventuraId)
        );
        if (aventuraAtual) {
          const salaDoStorage = (aventuraAtual.salas || []).find(
            (s) => s.id === Number(salaId)
          );
          if (salaDoStorage) salaInicial = salaDoStorage;
        }
      } catch (error) {
        console.error(
          "Erro no fallback ao carregar do localStorage:",
          error
        );
      }
    }

    if (salaInicial) {
      const opcoesPadrao = [
        { id: 1, texto: "" },
        { id: 2, texto: "" },
        { id: 3, texto: "" },
        { id: 4, texto: "" },
      ];
      const opcoesFinais = opcoesPadrao.map((opcaoDefault) => {
        const opcaoExistente = Array.isArray(salaInicial.opcoes)
          ? salaInicial.opcoes.find((o) => o.id === opcaoDefault.id)
          : null;
        return {
          ...opcaoDefault,
          texto: opcaoExistente ? opcaoExistente.texto || "" : "",
        };
      });

      setEditingSala({
        texto: "",
        vidaMonstro: "Média",
        enigma: "",
        resposta: "",
        imagem: "",
        ...salaInicial,
        tipo:
          ["Enigma", "Alternativa", "Monstro"].includes(tipoFromUrl)
            ? tipoFromUrl
            : salaInicial.tipo,
        opcoes: opcoesFinais,
        opcaoCorretaId: salaInicial.opcaoCorretaId ?? null,
      });
      if (salaInicial.imagem) setFileName("Imagem salva");
    } else {
      alert("Erro: Não foi possível carregar os dados desta sala.");
      navigate(-1);
    }
  }, [aventuraId, salaId, navigate, location]);

  // Salva sala no backend (se possível) ou localStorage
  const handleSalvar = () => {
    if (!editingSala) {
      alert("Erro: Dados da sala não carregados.");
      return;
    }
    try {
      if (backendId) {
        (async () => {
          try {
            const resGet = await fetch(`${API_URL}/aventuras/${backendId}`, { credentials: "include" });
            if (resGet.status === 401) {
              alert("Sua sessão expirou. Faça login novamente.");
              navigate("/");
              return;
            }
            if (!resGet.ok) {
              alert("Aventura não encontrada para atualizar sala.");
              return;
            }
            const aventuraDoc = await resGet.json();
            const salasExistentes = Array.isArray(aventuraDoc.salas)
              ? aventuraDoc.salas
              : [];
            const salasAtualizadas = salasExistentes.map((s) =>
              Number(s.id) === Number(salaId) ? editingSala : s
            );
            const payload = {
              titulo: aventuraDoc.titulo,
              salas: salasAtualizadas,
              perguntas: aventuraDoc.perguntas || [],
            };
            const resPut = await fetch(`${API_URL}/aventuras/${backendId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(payload),
              });
            if (resPut.status === 401) {
              alert("Sua sessão expirou. Faça login novamente.");
              navigate("/");
              return;
            }
            if (!resPut.ok) {
              const txt = await resPut.text().catch(() => "");
              console.warn(
                "[EditarSala] Falha ao salvar sala no backend. Status:",
                resPut.status,
                txt
              );
              alert("Erro ao salvar a sala.");
              return;
            }
            alert("Sala atualizada com sucesso!");
            navigate(-1);
          } catch (e) {
            console.error("[EditarSala] Erro ao atualizar sala no backend:", e);
            alert("Erro ao salvar a sala.");
          }
        })();
        return;
      }

      const aventurasSalvas =
        JSON.parse(localStorage.getItem("minhas_aventuras")) || [];
      const aventurasAtualizadas = aventurasSalvas.map((aventura) => {
        if (Number(aventura.id) === Number(aventuraId)) {
          const salasAtualizadas = (aventura.salas || []).map((s) =>
            Number(s.id) === Number(salaId) ? editingSala : s
          );
          return { ...aventura, salas: salasAtualizadas };
        }
        return aventura;
      });
      localStorage.setItem(
        "minhas_aventuras",
        JSON.stringify(aventurasAtualizadas)
      );
      alert("Sala atualizada com sucesso!");
      navigate(-1);
    } catch (error) {
      console.error("Erro ao salvar sala:", error);
      alert("Erro ao salvar a sala.");
    }
  };

  const handleInputChange = (campo, valor) => {
    setEditingSala((salaAtual) => ({ ...salaAtual, [campo]: valor }));
  };

  const handleOpcaoChange = (opcaoId, novoTexto) => {
    setEditingSala((salaAtual) => ({
      ...salaAtual,
      opcoes: salaAtual.opcoes.map((o) =>
        o.id === opcaoId ? { ...o, texto: novoTexto } : o
      ),
    }));
  };

  const handleOpcaoCorretaSelect = (opcaoId) => {
    setEditingSala((salaAtual) => ({
      ...salaAtual,
      opcaoCorretaId: opcaoId,
    }));
  };

  const handleImageUploadClick = (e) => {
    e.preventDefault();
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const imagemDataUrl = reader.result;
      setEditingSala((salaAtual) => ({ ...salaAtual, imagem: imagemDataUrl }));
      setFileName(file.name);
    };
    reader.readAsDataURL(file);
  };

  const renderFormBody = () => {
    if (!editingSala) return <p>Carregando formulário...</p>;
    switch (editingSala.tipo) {
      case "Enigma":
        return (
          <>
            <div className="form-group">
              <label htmlFor="enigma-sala">Enigma da Sala</label>
              <textarea
                id="enigma-sala"
                className="textarea-texto-sala"
                value={editingSala.enigma || ""}
                rows="3"
                placeholder="Digite o enigma aqui..."
                onChange={(e) => handleInputChange("enigma", e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="resposta-enigma">Resposta do enigma</label>
              <input
                id="resposta-enigma"
                type="text"
                className="input-resposta-enigma"
                value={editingSala.resposta || ""}
                placeholder="Digite a resposta aqui..."
                onChange={(e) => handleInputChange("resposta", e.target.value)}
              />
            </div>
          </>
        );
      case "Monstro":
        return (
          <>
            <div className="form-group">
              <label htmlFor="texto-sala">Texto da sala</label>
              <textarea
                id="texto-sala"
                className="textarea-texto-sala"
                value={editingSala.texto || ""}
                rows="5"
                placeholder="Digite a descrição do monstro/ambiente..."
                onChange={(e) => handleInputChange("texto", e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="vida-monstro">Vida do monstro</label>
              <select
                id="vida-monstro"
                className="select-vida-monstro"
                value={editingSala.vidaMonstro || "Média"}
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
      case "Alternativa":
        return (
          <>
            <div className="form-group">
              <label htmlFor="texto-sala">Texto da sala</label>
              <textarea
                id="texto-sala"
                className="textarea-texto-sala"
                value={editingSala.texto || ""}
                rows="5"
                placeholder="Digite a descrição da situação/pergunta..."
                onChange={(e) => handleInputChange("texto", e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Opções de resposta</label>
              <div className="opcoes-container-editavel">
                {editingSala.opcoes.map((opcao) => (
                  <div
                    key={opcao.id}
                    className={`opcao-item ${
                      ["red", "yellow", "green", "blue"][
                        (opcao.id - 1) % 4
                      ]
                    }`}
                  >
                    <label className="opcao-label" htmlFor={`opcao-${opcao.id}`}>
                      Opção {opcao.id}
                    </label>
                    <input
                      id={`opcao-${opcao.id}`}
                      type="text"
                      className="input-opcao-texto"
                      value={opcao.texto}
                      placeholder={`Texto da opção ${opcao.id}`}
                      onChange={(e) =>
                        handleOpcaoChange(opcao.id, e.target.value)
                      }
                    />
                    <div className="opcao-correta-container">
                      <label className="opcao-correta-label">
                        <input
                          type="radio"
                          name="opcao-correta"
                          checked={editingSala.opcaoCorretaId === opcao.id}
                          onChange={() => handleOpcaoCorretaSelect(opcao.id)}
                        />
                        Alternativa correta
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        );
      default:
        return (
          <p style={{ color: "red", fontWeight: "bold" }}>
            Erro: Tipo de sala inválido.
          </p>
        );
    }
  };

  if (!editingSala) {
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

  return (
    <div className="editar-sala-container">
      <h1 className="editar-sala-titulo">Editar {editingSala.nome || "Sala"}</h1>

      <div className="form-group">
        <label htmlFor="nome-sala">Nome da sala</label>
        <input
          id="nome-sala"
          type="text"
          className="input-nome-sala"
          value={editingSala.nome || ""}
          onChange={(e) => handleInputChange("nome", e.target.value)}
        />
      </div>

      {renderFormBody()}

      <div className="form-group">
        <label htmlFor={`upload-${editingSala.id}`} className="visually-hidden">
          Imagem
        </label>
        <div className="botoes-sala-container">
          <button className="btn-sala btn-imagem" onClick={handleImageUploadClick}>
            {fileName}
          </button>
          <button className="btn-sala btn-salvar" onClick={handleSalvar}>
            Salvar
          </button>
        </div>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        id={`upload-${editingSala.id}`}
        onChange={handleFileChange}
        style={{ display: "none" }}
        accept="image/png, image/jpeg, image/jpg, image/gif"
      />
    </div>
  );
};

export default EditarSala;