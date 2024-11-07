'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function MudarSenha() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setMessage('As senhas não coincidem');
      return;
    }

    const username = localStorage.getItem('username');

    if (!username) {
      setMessage('Usuário não autenticado');
      return;
    }

    try {
      const response = await fetch('/api/mudarSenha', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, newPassword }),  
      });

      if (!response.ok) {
        throw new Error(`Erro HTTP! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.message) {
        setMessage(data.message);
      }

      if (data.redirect) {
        router.push(data.redirect); 
      }
    } catch (error) {
      console.error('Erro ao alterar senha:', error);
      setMessage('Erro ao tentar alterar senha. Tente novamente.');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md mt-14 mb-auto">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
          Alterar Senha
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="newPassword" className="block text-gray-700 font-medium mb-2">
              Nova Senha
            </label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg text-black"
              placeholder="Digite sua nova senha"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="confirmPassword" className="block text-gray-700 font-medium mb-2">
              Confirmar Senha
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg text-black"
              placeholder="Confirme sua nova senha"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Alterar Senha
          </button>
        </form>

        {message && (
          <div className={`mt-4 text-center text-lg font-medium ${message.includes('sucesso') ? 'text-green-600' : 'text-red-600'}`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
