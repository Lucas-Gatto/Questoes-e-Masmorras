import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../header';
import Footer from '../footer';

const LayoutDeslogado = () => {
  return (
    <>
      <Header />
      <main className='main-content'>
        <Outlet /> {/* Aqui entrarão as páginas Home e Login */}
      </main>
      <Footer />
    </>
  );
};

export default LayoutDeslogado;