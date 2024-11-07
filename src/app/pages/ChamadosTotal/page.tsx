"use client";

import { useEffect, useState } from "react";
import Header from "@/app/components/Header/page";

interface Chamado {
  id: string;
  motivo: string;
  setor: string;
  comment: string;
  status: string;
  username: string;
}

const TodosChamados = () => {
  const [chamados, setChamados] = useState<Chamado[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }

    const fetchChamados = async () => {
      try {
        const res = await fetch(`/api/getAllChamados`);
        if (!res.ok) {
          throw new Error("Failed to fetch chamados");
        }

        const data: Chamado[] = await res.json();
        setChamados(data);
      } catch (err) {
        setError("Erro ao buscar chamados");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchChamados();
  }, []);

  if (loading) {
    return <p>Carregando...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <>
      <Header />
      <div className="max-w-5xl mx-auto p-8 bg-gray-50 shadow-lg rounded-lg mt-12">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Lista de Chamados
        </h1>
        {chamados.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {chamados.map((chamado) => (
              <div
                key={chamado.id}
                className="bg-white p-6 rounded-md shadow-md hover:shadow-lg transition-shadow border border-gray-200"
              >
                <div className="flex justify-between mb-4">
                  <div className="text-lg font-semibold text-gray-800">
                    Chamado #{chamado.id}
                  </div>
                  <span
                    className={`px-2 py-1 rounded-md text-sm ${
                      chamado.status === "concluido"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {chamado.status}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="text-gray-700">
                    <span className="font-medium">Usuário:</span> {chamado.username}
                  </div>
                  <div className="text-gray-700">
                    <span className="font-medium">Setor:</span> {chamado.setor}
                  </div>
                  <div className="text-gray-700">
                    <span className="font-medium">Motivo:</span> {chamado.motivo}
                  </div>
                  <div className="text-gray-700">
                    <span className="font-medium">Comentário:</span> {chamado.comment}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 mt-8">Nenhum chamado encontrado.</p>
        )}
      </div>
    </>
  );
};

export default TodosChamados;
