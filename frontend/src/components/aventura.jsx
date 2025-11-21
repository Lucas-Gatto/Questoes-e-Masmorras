import React from "react";
import "./aventura.css";
import play from "../assets/play.png";
import edit from "../assets/editar.png";
import del from "../assets/excluir.png";

// Recebe média de avaliação para exibir estrelas preenchidas
const Aventura = ({ titulo, onDelete, onEdit, onPlay, rating = 0, ratingCount = 0 }) => {
  const rounded = Math.round(Number(rating) || 0);
  const stars = [1, 2, 3, 4, 5];
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
      {/* Avaliação: preenche estrelas conforme média arredondada */}
      <div className="rating-stars" aria-label={`Avaliação: ${rounded} de 5`}>
        {stars.map((n) => (
          <span key={n} className="star" title={`${n} estrela${n>1?'s':''}`}>
            {n <= rounded ? '★' : '☆'}
          </span>
        ))}
      </div>
    </div>
  );
};

export default Aventura;
