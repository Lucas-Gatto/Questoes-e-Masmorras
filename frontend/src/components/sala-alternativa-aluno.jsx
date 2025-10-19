import React from "react";
import "./sala-alternativa-aluno.css";

const SalaAlternativa = () => {
  return (
    <div className="sala-wrapper">

      <div className="conteudo-central">


        <div className="quadro-transparente">
                  <h1 className="titulo">O calabouço de Nielsen</h1>
        <h2 className="subtitulo">3ª Sala</h2>
          <p className="texto-placeholder">
            Lorem ipsum dolor sit amet consectetur. Lorem ipsum dolor sit amet consectetur?
          </p>

          <div className="opcoes-container">
            <button className="btn-opcao red">Opção 1</button>
            <button className="btn-opcao yellow">Opção 2</button>
            <button className="btn-opcao green">Opção 3</button>
            <button className="btn-opcao blue">Opção 4</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalaAlternativa;
