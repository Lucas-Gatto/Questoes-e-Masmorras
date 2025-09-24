import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Importe os DOIS Layouts
import LayoutDeslogado from './components/layouts/LayoutDeslogado';
import LayoutLogado from './components/layouts/LayoutLogado';

// Importe as Páginas
import Home from './pages/home';
import Login from './pages/login';
import SuasAventuras from './pages/suas-aventuras';

function App() {
  return (
    <div className="app-container">
      <BrowserRouter>
        <Routes>
          {/* GRUPO DE ROTAS PÚBLICAS (Layout com Header normal) */}
          <Route element={<LayoutDeslogado />}>
            <Route path='/' element={<Home />} />
            <Route path='/login' element={<Login />} />
          </Route>

          {/* GRUPO DE ROTAS PRIVADAS (Layout com Header logado) */}
          <Route element={<LayoutLogado />}>
            <Route path='/suas-aventuras' element={<SuasAventuras />} />
            {/* Adicione outras páginas logadas aqui, como '/nova-aventura' */}
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;