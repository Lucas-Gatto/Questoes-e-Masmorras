import React, { useState } from 'react';
import API_URL from "../config";
import HeaderAventura from '../components/HeaderAventura.jsx';
import Footer from '../components/footer.jsx';
import './avaliacao.css';

const AvaliacaoSite = () => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comentario, setComentario] = useState('');
  const [enviado, setEnviado] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      alert('Por favor, selecione uma nota antes de enviar.');
      return;
    }
    try {
      const res = await fetch(`${API_URL}/feedback/site`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ rating, comentario }),
      });
      const payload = await res.json().catch(() => ({}));
      if (!res.ok) {
        const msg = payload?.message || 'Falha ao enviar avaliação do site.';
        alert(msg);
        return;
      }
      setEnviado(true);
    } catch (err) {
      console.error('Erro ao enviar avaliação do site:', err);
      alert('Erro de rede ao enviar avaliação.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <HeaderAventura />
      <main style={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <div className="avaliacao-container">
          <h2 className="titulo-avaliacao">Como você avalia o site Questões & Masmorras?</h2>

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
              Você deu {rating} estrela{rating > 1 && 's'} para o site!
            </p>
          )}

          {/* Campo de comentário */}
          <form onSubmit={handleSubmit} className="form-avaliacao">
            <textarea
              className="campo-comentario"
              placeholder="Conte-nos sua experiência geral com o site: o que funcionou bem, o que podemos melhorar?"
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              required
            ></textarea>

            <button type="submit" className="botao-enviar">
              Enviar Avaliação do Site
            </button>
          </form>

          {/* Mensagem de confirmação */}
          {enviado && (
            <p className="mensagem-sucesso">Obrigado! Seu feedback sobre o site foi enviado.</p>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AvaliacaoSite;