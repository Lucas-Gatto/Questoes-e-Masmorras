import React from 'react';
import { Outlet } from 'react-router-dom'; // Importante!
import Headerlogado from '../header-logado'; // O header de usuário logado
import Footer from '../footer';

const LayoutLogado = () => {
  return (
    <>
      <Headerlogado />
      <main className='main-content'>
        {/* O Outlet é um placeholder onde a sua página (SuasAventuras) será renderizada */}
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default LayoutLogado;