import React, { useEffect, useState } from 'react';
import './avaliacao.css';
import API_URL from '../config';
import { toast } from '../contexts/toastService.js';

const Avaliacao = () => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [enviado, setEnviado] = useState(false);
  const [codigo, setCodigo] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const c = params.get('codigo') || localStorage.getItem('sessao_codigo') || '';
    setCodigo(c);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      toast.show('Por favor, selecione uma nota antes de enviar.', { type: 'warning' });
      return;
    }
    if (!codigo) {
      toast.show('Código da sessão não encontrado.', { type: 'error' });
      return;
    }
    try {
      const res = await fetch(`${API_URL}/sessoes/by-code/${codigo}/avaliacao`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estrelas: rating }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.show(data?.message || 'Erro ao enviar avaliação.', { type: 'error' });
        return;
      }
      setEnviado(true);
      toast.show('Avaliação enviada! Obrigado por participar.', { type: 'success' });
    } catch (err) {
      toast.show('Falha ao enviar avaliação.', { type: 'error' });
    }
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

      {/* Envio apenas com estrelas */}
      <form onSubmit={handleSubmit} className="form-avaliacao">
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
