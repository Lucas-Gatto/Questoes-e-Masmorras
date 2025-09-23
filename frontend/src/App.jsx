import { useState } from 'react'
import './App.css'
import Header from './components/header'
import Background from './components/background'
import Footer from './components/footer'
import { BrowserRouter, Route, Routes, Link } from 'react-router-dom';
import Home from './pages/home'
import Login from './pages/login'


function App() {

  return (
     <div className="app-container"> 
      <BrowserRouter>

        <Header />

       
        <main className='main-content'>
        <Routes>
          <Route path='/' element={<Home />} />
            <Route path='/login' element={<Login />} />
        </Routes>
        </main>
        <Footer />
      </BrowserRouter>
    </div>
  )
}

export default App
