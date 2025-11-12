import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../pages/perfil.css';
import { AvatarContext } from '../contexts/AvatarContext';
import API_URL from '../config';

// Avatares disponíveis
const avatares = [
  '/avatars/qemmago.png',
  '/avatars/qembardo.png',
  '/avatars/qemguerreiro.png'
];

const PerfilUsuario = () => {
  const navigate = useNavigate();
  const { avatar, setAvatar } = useContext(AvatarContext);
  const [modalAberto, setModalAberto] = useState(false);

  const abrirModal = () => setModalAberto(true);
  const fecharModal = () => setModalAberto(false);

  const selecionarAvatar = async (novoAvatar) => {
    setAvatar(novoAvatar); // atualiza Context imediatamente

    try {
      await fetch(`${API_URL}/user/avatar`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ avatar: novoAvatar }),
      });
    } catch (err) {
      console.error('Erro ao atualizar avatar', err);
    }

    fecharModal();
  };

  useEffect(() => {
  const carregarAvatar = async () => {
    try {
      const res = await fetch(`${API_URL}/user/avatar`, {
        credentials: 'include'
      });
      const data = await res.json();
      setAvatar(data.avatar); // atualiza o Context com o avatar real do backend
    } catch (err) {
      console.error('Erro ao carregar avatar', err);
    }
  };

  carregarAvatar();
}, [setAvatar]);

  const irParaTrocarSenha = () => navigate('/trocar-senha');

  return (
    <div className="perfil-usuario-main">
      <div className="perfil-usuario-painel">
        <img src={avatar} alt="Foto de perfil" className="perfil-foto" />
        <button className="btn-alterar-foto" onClick={abrirModal}>Alterar foto</button>

        <div className="perfil-seguranca-area">
          <h2>Segurança</h2>
          <button className="btn-trocar-senha" onClick={irParaTrocarSenha}>Alterar senha</button>
        </div>
      </div>

      {modalAberto && (
        <div className="modal-overlay" onClick={fecharModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Escolha seu avatar</h3>
            <div className="avatar-grid">
              {avatares.map((a, i) => (
                <img key={i} src={a} alt="avatar opção" className="avatar-opcao" onClick={() => selecionarAvatar(a)} />
              ))}
            </div>
            <button className="btn-fechar-modal" onClick={fecharModal}>Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PerfilUsuario;