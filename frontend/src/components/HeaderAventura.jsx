import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './header-aventura.css';
import qmLogo from '../assets/q&mLogo.png';  // Reutilizando o logo
import { AvatarContext } from '../contexts/AvatarContext';

const HeaderAventura = () => {
  const navigate = useNavigate();
  const { avatar } = useContext(AvatarContext);

  return (
    <header className="header-aventura-container">
      <div className="header-aventura-left">
        {/* Avatar do usuário (igual ao comportamento das outras telas) */}
        <div className="avatar-placeholder">
            <img src={avatar} alt="Avatar do usuário" className="avatar-mini" />
          </div>
        
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