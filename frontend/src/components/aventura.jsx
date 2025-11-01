import React from "react";
import "./aventura.css";
import play from "../assets/play.png";
import edit from "../assets/editar.png";
import del from "../assets/excluir.png";

// VERIFIQUE AQUI: 'onPlay' precisa estar listado nas chaves {}.
const Aventura = ({ titulo, onDelete, onEdit, onPlay }) => {
  return (
    <div className="fundo-aventura">
      <h2 className="subtitulo_aventura">{titulo}</h2>
      <div className="icons-container">
        <img
          src={edit}
          alt="Edit Icon"
          className="edit-icon"
          onClick={onEdit}
        />
        <div className="play-icon-background">
          {/* E precisa ser usado no onClick aqui */}
          <img
            src={play}
            alt="Play Icon"
            className="play-icon"
            onClick={onPlay}
          />
        </div>
        <img
          src={del}
          alt="Delete Icon"
          className="delete-icon"
          onClick={onDelete}
        />
      </div>
    </div>
  );
};

export default Aventura;
