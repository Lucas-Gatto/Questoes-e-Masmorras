import React from "react";
import "./sala-monstro-aluno.css";

const SalaMonstro = ({ sala, handleInputChange }) => {
    return (
        <div className="sala-monstro-wrapper">


            <div className="conteudo-central">


                <div className="quadro-transparente">
                    <h1 className="titulo">O calabouço de Nielsen</h1>
                    <h2 className="subtitulo">10ª Sala</h2>
                    <p className="texto-placeholder">
                        Norem ipsum dolor sit amet consectetur Norem ipsum dolor sit amet consectetur. Norem ipsum dolor sit amet consectetur Norem ipsum dolor sit amet consectetur.
                    </p>



                </div>
            </div>



        </div>
    );
};

export default SalaMonstro;
