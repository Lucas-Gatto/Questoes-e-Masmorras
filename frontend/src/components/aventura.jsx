import React from 'react';
import pergaminho from '../assets/pergaminho.png';
import './aventura.css';
import play from '../assets/play.png';
import edit from '../assets/editar.png';
import del from '../assets/excluir.png';

const Aventura = ({ titulo, onDelete, onEdit }) => {
  return (
    <div className="fundo-aventura">
      <p>{titulo}</p>
      <div className='icons-container'>
        <div className='play-icon-background'>
          <img src={play} alt="Play Icon" className='play-icon' />
        </div>
        <img src={edit} alt="Edit Icon" className='edit-icon' onClick={onEdit} />
        <img src={del} alt="Delete Icon" className='delete-icon' onClick={onDelete} />
      </div>
    </div>
  )
}

export default Aventura;