import { createContext, useState } from 'react';
import API_URL from '../config';

export const AvatarContext = createContext();

export const AvatarProvider = ({ children }) => {
  const [avatar, setAvatar] = useState('/avatars/Warrior.png');

  const carregarAvatar = async () => {
    try {
      const res = await fetch(`${API_URL}/user/avatar`, { credentials: 'include' });
      const data = await res.json();
      setAvatar(data.avatar || '/avatars/Warrior.png');
    } catch {
      setAvatar('/avatars/Warrior.png');
    }
  };

  const atualizarAvatar = async (novoAvatar) => {
    try {
      await fetch(`${API_URL}/user/avatar`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ avatar: novoAvatar }),
      });
      setAvatar(novoAvatar);
    } catch (err) {
      console.error(err);
    }
  };

  const resetAvatar = () => setAvatar('/avatars/Warrior.png');

  return (
    <AvatarContext.Provider value={{ avatar, setAvatar, carregarAvatar, atualizarAvatar, resetAvatar }}>
      {children}
    </AvatarContext.Provider>
  );
};
