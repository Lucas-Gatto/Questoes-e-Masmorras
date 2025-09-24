import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/q&mLogo.png'; 
import './header-logado.css'; 

const HeaderLogado = () => {
  return (
    <header className="header-logado-container">
      <div className="header-left">
        <div className="avatar-placeholder"></div>
        <nav className="header-nav">
          <Link to="/suas-aventuras">Suas aventuras</Link>
          <Link to="/nova-aventura">Nova aventura</Link>
        </nav>
      </div>
      <div className="header-right">
        <Link to="/">
          <img src={logo} alt="Logo Q&M" className='logo' />
        </Link>
      </div>
    </header>
  );
};

export default HeaderLogado;