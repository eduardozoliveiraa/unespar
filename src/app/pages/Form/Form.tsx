'use client';

import Header from '@/app/components/Header/page';
import { useState, useEffect } from 'react';

export default function CreateLogin() {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      window.location.href = '/pages/Pagprincipal';
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, password }),  
      });

      if (!response.ok) {
        throw new Error(`Erro HTTP! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.redirect) {
        localStorage.setItem('username', name);  
        localStorage.setItem('userRole', data.role);
        window.location.href = data.redirect;
      } else if (data.message) {
        setMessage(data.message);
      } else {
        setMessage('Erro inesperado: Nenhuma mensagem recebida');
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      setMessage('Erro ao tentar fazer login. Tente novamente.');
    }
  };

  return (
    <>
      <Header />

      <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md mt-14 mb-auto">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
            Login
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
                Nome de Usuário
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg text-black"
                placeholder="Digite seu login"
              />
            </div>

            <div className="mb-6">
              <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
                Senha
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg text-black"
                placeholder="Digite sua senha"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Entrar
            </button>
          </form>

          {message && (
            <div className={`mt-4 text-center text-lg font-medium ${message.includes('sucesso') ? 'text-green-600' : 'text-red-600'}`}>
              {message}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
