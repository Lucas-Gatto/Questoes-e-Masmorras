import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LayoutDeslogado from './components/layouts/LayoutDeslogado';
import LayoutLogado from './components/layouts/LayoutLogado';
import Home from './pages/home';
import Login from './pages/login';
import SuasAventuras from './pages/suas-aventuras';
import NovaAventura from './pages/nova-aventura';
import EditarAventura from './pages/editar-aventura';

function App() {
  return (
    <div className="app-container">
      <BrowserRouter>
        <Routes>
          <Route element={<LayoutDeslogado />}>
            <Route path='/' element={<Home />} />
            <Route path='/login' element={<Login />} />
          </Route>
          <Route element={<LayoutLogado />}>
            <Route path='/suas-aventuras' element={<SuasAventuras />} />
            <Route path='/nova-aventura' element={<NovaAventura />} />
            <Route path='/editar-aventura/:id' element={<EditarAventura />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;