import React from 'react';
import logo from '../assets/q&mLogo.png';
import './header.css';
import { Link } from 'react-router-dom';

const Header = () => {
    return (
        <div>
            <header>
                <Link to="/">
                    <h1>Home</h1>
                </Link>
                <img src={logo} alt="Logo" className='logo' />
                <Link to="/login">
                    <h1>Login</h1>
                </Link>
            </header>
        </div>
    );
};

export default Header;

