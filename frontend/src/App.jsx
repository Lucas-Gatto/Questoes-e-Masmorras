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
    <>
      <BrowserRouter>

        <Header />

        <Background />
        <main className='main-content'>
        <Routes>
          <Route path='/' element={<Home />} />
           <Route path='/login' element={<Login />} />
        </Routes>
        </main>
        <Footer />
      </BrowserRouter>
    </>
  )
}

export default App
