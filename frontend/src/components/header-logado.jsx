import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/q&mLogo.png';
import './header-logado.css';
import { AvatarContext } from '../contexts/AvatarContext';
import API_URL from '../config';

const HeaderLogado = () => {
  const { avatar, resetAvatar } = useContext(AvatarContext);
    const navigate = useNavigate();

  const logout = async () => {
    try {
      await fetch(`${API_URL}/user/logout`, {
        method: 'POST',
        credentials: 'include'
      });

      resetAvatar();       // limpa avatar do Context
      navigate('/');  // redireciona para login
    } catch (err) {
      console.error('Erro ao deslogar', err);
    }
  };

  return (
    <header className="header-logado-container">
      <div className="header-left">
        <Link to="/perfil">
          <div className="avatar-placeholder">
            <img src={avatar} alt="Avatar do usuário" className="avatar-mini" />
          </div>
        </Link>
        <nav className="header-nav">
          <Link to="/suas-aventuras">Suas aventuras</Link>
          <Link to="/nova-aventura">Nova aventura</Link>
        </nav>
      </div>
      <div className="header-right">
        <img
          src={logo}
          alt="Logo Q&M"
          className='logo'
          style={{ cursor: 'pointer' }}
          onClick={logout} // aqui chamamos logout direto
        />
      </div>
    </header>
  );
};

export default HeaderLogado;