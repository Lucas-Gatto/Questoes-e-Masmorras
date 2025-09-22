import React from 'react';
import './home.css';
import pergaminho from '../assets/pergaminho.png';


const Home = () => {
    return (
        <main className="home-container">
            <div className="scroll-container" style={{ backgroundImage: `url(${pergaminho})` }}>
                <h2 className="scroll-title">O que é Q&M?</h2>
                     <p className="scroll-text">
                    Norem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero Ut commodo efficitur neque. 
                    Ut diam quam, semper iaculis condimentum vestibulum eu nisl. Norem ipsum dolor sit amet, 
                    consectetur adipiscing elit. 
                     </p>
                     </div>
                     <button className="signup-button">Cadastre-se</button>
        </main>
        
    )
}

export default Home;