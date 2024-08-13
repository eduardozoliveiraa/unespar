'use client';

import { useEffect, useState } from 'react';
import Header from '@/app/components/Header/page';

interface Chamado {
  id: string;
  motivo: string;
  setor: string;
  comment: string;
  files: string[];
  username: string;
}

const Chamados = () => {
  const [chamados, setChamados] = useState<Chamado[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChamados = async () => {
      const storedUsername = localStorage.getItem('username');
      if (!storedUsername) {
        setError('Usuário não encontrado. Por favor, faça login novamente.');
        return;
      }

      try {
        const res = await fetch(`/api/getChamados?username=${storedUsername}`, {
          method: 'GET',
        });

        if (!res.ok) {
          throw new Error('Failed to fetch chamados');
        }

        const data = await res.json();
        setChamados(data);
      } catch (err) {
        setError('Error fetching chamados');
        console.error(err);
      }
    };

    fetchChamados();
  }, []);

  return (
    <div className="mx-auto bg-gray-100 rounded-lg">
      <Header />
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Meus Chamados</h1>
      {error && <p className="text-red-500 text-center">{error}</p>}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg ">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b-2 border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-700">Motivo</th>
              <th className="px-4 py-2 border-b-2 border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-700">Setor</th>
              <th className="px-4 py-2 border-b-2 border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-700">Comentário</th>
              <th className="px-4 py-2 border-b-2 border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-700">Files</th>
              <th className="px-4 py-2 border-b-2 border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-700">Username</th>
            </tr>
          </thead>
          <tbody>
            {chamados.map((chamado) => (
              <tr key={chamado.id}>
                <td className="px-4 py-2 border-b border-gray-200 text-sm text-gray-700">{chamado.motivo}</td>
                <td className="px-4 py-2 border-b border-gray-200 text-sm text-gray-700">{chamado.setor}</td>
                <td className="px-4 py-2 border-b border-gray-200 text-sm text-gray-700">{chamado.comment}</td>
                <td className="px-4 py-2 border-b border-gray-200 text-sm text-gray-700">{chamado.files.join(', ')}</td>
                <td className="px-4 py-2 border-b border-gray-200 text-sm text-gray-700">{chamado.username}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Chamados;
