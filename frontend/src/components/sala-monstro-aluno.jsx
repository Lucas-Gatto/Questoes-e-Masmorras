import React from "react";
import "./sala-monstro-aluno.css";

const SalaMonstro = ({ sala, aventuraTitulo }) => {
    // Se não há dados da sala, mostra carregamento
    if (!sala) {
        return (
            <div className="sala-monstro-wrapper">
                <div className="conteudo-central">
                    <div className="quadro-transparente">
                        <p>Carregando sala...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="sala-monstro-wrapper">
            <div className="conteudo-central">
                <div className="quadro-transparente">
                    <h1 className="titulo">{aventuraTitulo || "Aventura"}</h1>
                    <h2 className="subtitulo">{sala.nome || "Sala"}</h2>
                    <p className="texto-placeholder">
                        {sala.texto || "Descrição da sala não disponível"}
                    </p>
                    {/* Renderiza imagem se disponível */}
                    {sala.imagem && (
                        <div className="imagem-monstro">
                            <img src={sala.imagem} alt={`Imagem da sala ${sala.nome}`} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SalaMonstro;
