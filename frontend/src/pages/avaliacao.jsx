import React, { useState } from 'react';
import './avaliacao.css';

const Avaliacao = () => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comentario, setComentario] = useState('');
  const [enviado, setEnviado] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0) {
      alert('Por favor, selecione uma nota antes de enviar.');
      return;
    }
    setEnviado(true);
    // Aqui você pode enviar os dados para o backend futuramente
    console.log({ rating, comentario });
  };

  return (
    <div className="avaliacao-container">
      <h2 className="titulo-avaliacao">Como você avalia esta Aventura?</h2>

      {/* Estrelas */}
      <div className="estrelas">
        {[1, 2, 3, 4, 5].map((estrela) => (
          <span
            key={estrela}
            className={`estrela ${
              estrela <= (hover || rating) ? 'ativa' : 'inativa'
            }`}
            onClick={() => setRating(estrela)}
            onMouseEnter={() => setHover(estrela)}
            onMouseLeave={() => setHover(0)}
          >
            ★
          </span>
        ))}
      </div>

      {/* Mensagem */}
      {rating > 0 && (
        <p className="mensagem-avaliacao">
          Você deu {rating} estrela{rating > 1 && 's'}!
        </p>
      )}

      {/* Campo de comentário */}
      <form onSubmit={handleSubmit} className="form-avaliacao">
        <textarea
          className="campo-comentario"
          placeholder="Conte-nos o motivo da sua nota..."
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
          required
        ></textarea>

        <button type="submit" className="botao-enviar">
          Enviar Avaliação
        </button>
      </form>

      {/* Mensagem de confirmação */}
      {enviado && (
        <p className="mensagem-sucesso">Avaliação enviada com sucesso!</p>
      )}
    </div>
  );
};

export default Avaliacao;
