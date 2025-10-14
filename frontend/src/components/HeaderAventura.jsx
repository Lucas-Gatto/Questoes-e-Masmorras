import React from 'react';
import { useNavigate } from 'react-router-dom';
import './header-aventura.css';
import qmLogo from '../assets/q&mLogo.png';  // Reutilizando o logo

const HeaderAventura = () => {
  const navigate = useNavigate();

  return (
    <header className="header-aventura-container">
      <div className="header-aventura-left">
        <div className="avatar-placeholder"></div>
        
        <button 
          className="encerrar-aventura-btn" 
          onClick={() => navigate('/suas-aventuras')}
        >
          Encerrar aventura <span className="arrow-icon">↩</span>
        </button>
      </div>
      <div className="header-aventura-right">
        <img src={qmLogo} alt="Logo Q&M" className="header-qm-logo" />
      </div>
    </header>
  );
};

export default HeaderAventura;