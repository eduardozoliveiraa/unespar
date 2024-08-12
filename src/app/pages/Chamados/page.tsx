// src/app/components/Chamados/page.tsx

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
      try {
        const res = await fetch('/api/getChamados', {
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
    <div>
      <Header />
      <h1>Chamados</h1>
      {error && <p>{error}</p>}
      <ul>
        {chamados.map((chamado) => (
          <li key={chamado.id}>
            <h2>{chamado.motivo}</h2>
            <p><strong>Setor:</strong> {chamado.setor}</p>
            <p><strong>Comentário:</strong> {chamado.comment}</p>
            <p><strong>Files:</strong> {chamado.files.join(', ')}</p>
            <p><strong>Username:</strong> {chamado.username}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Chamados;
