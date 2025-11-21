import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./entrar-aventura.css";
import API_URL from "../config";
import { toast } from "../contexts/toastService.js";

const EntrarAventura = () => {
  const navigate = useNavigate();
  const show = (msg, opts) => toast.show(msg, opts);
  const [tituloSessao, setTituloSessao] = useState("");
  const [codigo, setCodigo] = useState("");
  const [nome, setNome] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const c = params.get("codigo") || "";
    setCodigo(c);
    if (c) {
      fetch(`${API_URL}/sessoes/by-code/${c}`)
        .then((r) => r.json())
        .then((data) => {
          if (data?.aventuraSnapshot?.titulo)
            setTituloSessao(data.aventuraSnapshot.titulo);
        })
        .catch(() => {});
    }
  }, []);

  return (
    <div className="aventuras-page-container" role="main">
      {tituloSessao && (
        <h1 className="titulo-aventura">{tituloSessao}</h1>
      )}

      <label className="nomePersonagem" htmlFor="nome-personagem-input">
        Nome do Personagem
      </label>
      <input
        id="nome-personagem-input"
        type="text"
        placeholder="Digite o nome do seu personagem..."
        aria-label="Nome do personagem"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
      />

      <div className="btn-entrar-aventura-container">
        <button
          className="btn-entrar-aventura"
          onClick={async () => {
            if (!nome || !codigo) {
              show("Informe seu nome e use o link com código.", { type: 'warning' });
              return;
            }
            try {
              const res = await fetch(
                `${API_URL}/sessoes/by-code/${codigo}/alunos`,
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ nome }),
                }
              );
              const data = await res.json();
              if (!res.ok) {
                show(data?.message || "Falha ao entrar na sessão", { type: 'error' });
                return;
              }
              localStorage.setItem("sessao_codigo", codigo);
              localStorage.setItem("aluno_nome", nome);
              try { sessionStorage.setItem("aluno_nome", nome); } catch (_) {}
              navigate(
                `/escolher-classe?codigo=${codigo}&nome=${encodeURIComponent(
                  nome
                )}`
              );
            } catch (err) {
              show("Erro ao entrar na sessão.", { type: 'error' });
            }
          }}
        >
          Entrar na Aventura
        </button>
      </div>
    </div>
  );
};

export default EntrarAventura;