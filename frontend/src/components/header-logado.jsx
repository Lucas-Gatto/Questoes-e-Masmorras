import React from 'react';
import logo from '../assets/q&mLogo.png';
import './header-logado.css';
import { Link } from 'react-router-dom';

const HeaderLogado = () => {
    return (
        <header className='header-logado'>
            {/*<img src={logo} alt="Logo" className='logo' />*/}
            <Link to="/suas-aventuras">
                <h1>Suas aventuras</h1>
            </Link>
            
            <Link to="">
                <h1>Nova aventura</h1>
            </Link>
            <img src={logo} alt="Logo" className='logo' />
        </header>
    );
};

export default HeaderLogado;

