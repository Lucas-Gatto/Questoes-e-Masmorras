import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Layouts
import LayoutDeslogado from './components/layouts/LayoutDeslogado.jsx';
import LayoutLogado from './components/layouts/LayoutLogado.jsx';

// Páginas
import Home from './pages/home.jsx';
import Login from './pages/login.jsx';
import SuasAventuras from './pages/suas-aventuras.jsx';
import NovaAventura from './pages/nova-aventura.jsx';
import EditarAventura from './pages/editar-aventura.jsx';
import EditarSala from './pages/editar-sala.jsx';
import IniciarAventura from './pages/iniciar-aventura.jsx';
import SalaDeJogo from './pages/sala-de-jogo.jsx';
import EntrarAventura from './pages/entrar-aventura.jsx';
import EscolherClasse from './pages/escolher-classe.jsx';
import SalasAluno from './pages/salas-aluno.jsx';
import LayoutAluno from './components/layouts/LayoutAluno.jsx';

function App() {
  return (
    <div className="app-container">
      <BrowserRouter>
        <Routes>
          {/* --- GRUPO 1: Rotas Públicas (com LayoutDeslogado) --- */}
          <Route element={<LayoutDeslogado />}>
            <Route path='/' element={<Home />} />
            <Route path='/login' element={<Login />} />


          </Route>

          {/* --- GRUPO 2: Rotas de Gerenciamento (com LayoutLogado) --- */}
          <Route element={<LayoutLogado />}>
            <Route path='/suas-aventuras' element={<SuasAventuras />} />
            <Route path='/nova-aventura' element={<NovaAventura />} />
            <Route path='/editar-aventura/:id' element={<EditarAventura />} />
            <Route path="/aventura/:aventuraId/sala/:salaId/editar" element={<EditarSala />} />
          </Route>
          <Route path="/iniciar-aventura/:aventuraId" element={<IniciarAventura />} />
          <Route path="/aventura/:aventuraId/jogar" element={<SalaDeJogo />} />

          <Route element={<LayoutAluno />}>
            <Route path='/entrar-aventura' element={<EntrarAventura />} />
            <Route path='/escolher-classe' element={<EscolherClasse />} />
            <Route path='/salas-aluno' element={<SalasAluno />} />
          </Route>


        </Routes>



      </BrowserRouter>




    </div>
  );
}

export default App;