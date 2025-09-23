import React from 'react'
import pergaminho from '../assets/pergaminho.png'
import '../components/aventura.css'
import play from '../assets/play.png'
import edit from '../assets/editar.png'
import del from '../assets/excluir.png'

const Aventura = () => {
  return (
    <main className='aventura-container'>
      <div className="fundo-aventura">

        <p>Título</p>
        <div className='icons-container'>
          
          <img src={play} alt="Play Icon" className='play-icon' />
          <img src={edit} alt="Edit Icon" className='edit-icon' />
          <img src={del} alt="Delete Icon" className='delete-icon' />
        </div>
      </div>
    </main>
  )
}

export default Aventura