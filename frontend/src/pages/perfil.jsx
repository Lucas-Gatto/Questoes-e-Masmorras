import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../pages/perfil.css';

//Importar os avatares
import Warrior from '../assets/avatars/Warrior.png';
import Wizard from '../assets/avatars/Wizard.png';
import Rogue from '../assets/avatars/Rogue.png';
import Cleric from '../assets/avatars/Cleric.png';

const PerfilUsuario = () => {
  const navigate = useNavigate();

  const [fotoAtual, setFotoAtual] = useState(Warrior);
  const [modalAberto, setModalAberto] = useState(false);

  const avatares = [Warrior, Wizard, Rogue, Cleric];

  const abrirModal = () => setModalAberto(true);
  const fecharModal = () => setModalAberto(false);
  const selecionarAvatar = (avatar) => {
    setFotoAtual(avatar); // atualiza a foto
    fecharModal();
  };

  const irParaTrocarSenha = () => navigate('/trocar-senha');

  return (
    <div className="perfil-usuario-main">
      <div className="perfil-usuario-painel">

        {/* Foto */}
        <img
          src={fotoAtual}
          alt="Foto de perfil"
          className="perfil-foto"
        />

        {/* Botão alterar foto */}
        <button className="btn-alterar-foto" onClick={abrirModal}>
          Alterar foto
        </button>

        <div className="perfil-seguranca-area">
          <h2>Segurança</h2>

          <button className="btn-trocar-senha" onClick={irParaTrocarSenha}>
            Alterar senha
          </button>
        </div>

      </div>

      {/* Modal */}
      {modalAberto && (
        <div className="modal-overlay" onClick={fecharModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Escolha seu avatar</h3>

            <div className="avatar-grid">
              {avatares.map((avatar, index) => (
                <img
                  key={index}
                  src={avatar}
                  alt="avatar opção"
                  className="avatar-opcao"
                  onClick={() => selecionarAvatar(avatar)}
                />
              ))}
            </div>

            <button className="btn-fechar-modal" onClick={fecharModal}>
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PerfilUsuario;