"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Header from "@/app/components/Header/page";

interface Chamado {
  id: string;
  motivo: string;
  setor: string;
  comment: string;
  status: string;
  username: string;
}

const DetalhesChamado = () => {
  const { id } = useParams();
  const router = useRouter();
  const [chamado, setChamado] = useState<Chamado | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
    const fetchChamado = async () => {
      try {
        const res = await fetch(`/api/chamado/${id}`);
        if (!res.ok) {
          throw new Error("Failed to fetch chamado details");
        }

        const data: Chamado = await res.json();
        setChamado(data);
      } catch (err) {
        setError("Error fetching chamado details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchChamado();
  }, [id]);

  if (loading) {
    return <p>Carregando...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  const handleBack = () => {
    router.push("/pages/ChamadosAdm");
  };

  return (
    <>
      <Header />
      <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-md mt-10">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">
          Detalhes do Chamado
        </h1>
        {chamado && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <span className="font-medium text-gray-600">Usuário:</span>
              <span className="text-lg text-gray-900">{username}</span>
            </div>
            <div className="flex flex-col">
              <span className="font-medium text-gray-600">Motivo:</span>
              <span className="text-lg text-gray-900">{chamado.motivo}</span>
            </div>
            <div className="flex flex-col">
              <span className="font-medium text-gray-600">Setor:</span>
              <span className="text-lg text-gray-900">{chamado.setor}</span>
            </div>
            <div className="flex flex-col">
              <span className="font-medium text-gray-600">Comentário:</span>
              <span className="text-lg text-gray-900">{chamado.comment}</span>
            </div>
            <div className="flex flex-col">
              <span className="font-medium text-gray-600">Status:</span>
              <span className="text-lg text-gray-900">{chamado.status}</span>
            </div>
          </div>
        )}
        <div className="mt-6 flex justify-end space-x-4">
          <button
            onClick={handleBack}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition"
          >
            Voltar
          </button>
        </div>
      </div>
    </>
  );
};

export default DetalhesChamado;
