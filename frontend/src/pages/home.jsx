import React from 'react';
import './home.css';
import pergaminho from '../assets/pergaminho.png';


const Home = () => {
    return (
        <main className="home-container">
            <div className="img-pergaminho" style={{ backgroundImage: `url(${pergaminho})` }}>
                <h2 className="scroll-title">O que é Q&M?</h2>
                     <p className="scroll-text">
                   Era uma vez, em um reino muito distante, heróis destemidos que se uniram em grupos para cumprir uma missão grandiosa: transformar conhecimento em poder e sabedoria em sua arma mais forte.
                    Assim nasceu Questões e Masmorras, um sistema forjado para transformar o aprendizado em uma aventura épica. Aqui, educadores tornam-se mestres de jornadas fantásticas, criando mundos repletos de desafios, enigmas e segredos. Os alunos assumem o papel de heróis corajosos que se unem em equipes para explorar masmorras, desvendar mistérios e conquistar vitórias através da união e da sabedoria.
                    Role os dados, enfrente os desafios e conquiste a Masmorra do Saber aguarda por você!
                     </p>
                     </div>
                     <button className="signup-button">Cadastre-se</button>
        </main>
        
    )
}

export default Home;