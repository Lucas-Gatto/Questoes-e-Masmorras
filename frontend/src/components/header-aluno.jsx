import React from 'react';
import logo from '../assets/q&mLogo.png'; 
import './header-aluno.css'; 

const HeaderAluno = () => {
  return (
    <header className="header-aluno-container">
      <div className="header-right">
          <img src={logo} alt="Logo Q&M" className='logo' />
      </div>
    </header>
  );
};

export default HeaderAluno;