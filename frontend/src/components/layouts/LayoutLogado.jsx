import React from 'react';
import { Outlet } from 'react-router-dom'; 
import Headerlogado from '../header-logado'; 
import Footer from '../footer';

const LayoutLogado = () => {
  return (
    <>
      <Headerlogado />
      <main className='main-content'>
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default LayoutLogado;