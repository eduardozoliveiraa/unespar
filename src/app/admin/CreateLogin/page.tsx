"use client";
import { useState } from 'react';
import Header from '@/app/components/Header/page';

export default function CreateLogin() {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [role, setRole] = useState('user'); 
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          surname,
          role,
        }),
      });

      if (!response.ok) {
        throw new Error(`Erro HTTP! status: ${response.status}`);
      }

      const data = await response.json();
      setMessage(data.message);

      if (data.redirect) {
        window.location.href = data.redirect;
      }
    } catch (error) {
      console.error('Erro ao fazer o cadastro:', error);
      setMessage('Erro ao tentar fazer o cadastro. Tente novamente.');
    }
  };

  return (
    <>
      <Header />

      <div className="flex justify-center  min-h-screen bg-gray-100 p-6">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
            Cadastro
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
                Nome do Usuário
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg text-black"
                placeholder="Digite o nome do usuário"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="surname" className="block text-gray-700 font-medium mb-2">
                Sobrenome do Usuário
              </label>
              <input
                type="text"
                id="surname"
                name="surname"
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg text-black"
                placeholder="Digite o sobrenome do usuário"
              />
            </div>

            <div className="mb-6">
              <label htmlFor="role" className="block text-gray-700 font-medium mb-2">
                Cargo
              </label>
              <select
                id="role"
                name="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg text-black"
              >
                <option value="user">Usuário</option>
                <option value="ADMIN">Administrador</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Cadastrar
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
