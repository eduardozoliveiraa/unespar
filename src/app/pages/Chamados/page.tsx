"use client";

import { useEffect, useState } from "react";
import Header from "@/app/components/Header/page";
import { Check, Clock } from "lucide-react";

interface Chamado {
  id: string;
  motivo: string;
  setor: string;
  comment: string;
  files: string[];
  username: string;
  status: string;
}

const Chamados = () => {
  const [chamados, setChamados] = useState<Chamado[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChamados = async () => {
      setLoading(true);
      const storedUsername = localStorage.getItem("username");
      if (!storedUsername) {
        setError("Usuário não encontrado. Por favor, faça login novamente.");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`/api/getChamados`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username: storedUsername }),
        });

        if (!res.ok) {
          throw new Error("Failed to fetch chamados");
        }

        const data = await res.json();
        setChamados(data);
      } catch (err) {
        setError("Error fetching chamados");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchChamados();
  }, []);

  const handleStatusChange = async (id: string) => {
    try {
      const res = await fetch(`/api/updateChamados`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, status: "concluido" }),
      });

      if (!res.ok) {
        throw new Error("Failed to update status");
      }

      setChamados((prevChamados) =>
        prevChamados.map((chamado) =>
          chamado.id === id ? { ...chamado, status: "concluido" } : chamado
        )
      );
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  if (loading) {
    return <p>Carregando...</p>;
  }

  return (
    <div className="mx-auto bg-gray-100 rounded-lg">
      <Header />
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
        Meus Chamados
      </h1>
      {error && <p className="text-red-500 text-center">{error}</p>}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg ">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b-2 border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-700">
                Motivo
              </th>
              <th className="px-4 py-2 border-b-2 border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-700">
                Setor
              </th>
              <th className="px-4 py-2 border-b-2 border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-700">
                Comentário
              </th>
              <th className="px-4 py-2 border-b-2 border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-700">
                Files
              </th>
              <th className="px-4 py-2 border-b-2 border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-700">
                Username
              </th>
              <th className="px-4 py-2 border-b-2 border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-700">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {chamados.map((chamado) => (
              <tr key={chamado.id}>
                <td className="px-4 py-2 border-b border-gray-200 text-sm text-gray-700">
                  {chamado.motivo}
                </td>
                <td className="px-4 py-2 border-b border-gray-200 text-sm text-gray-700">
                  {chamado.setor}
                </td>
                <td className="px-4 py-2 border-b border-gray-200 text-sm text-gray-700">
                  {chamado.comment}
                </td>
                <td className="px-4 py-2 border-b border-gray-200 text-sm text-gray-700">
                  {chamado.files.join(", ")}
                </td>
                <td className="px-4 py-2 border-b border-gray-200 text-sm text-gray-700">
                  {chamado.username}
                </td>
                <td className="px-4 py-2 border-b border-gray-200 text-sm text-gray-700 flex items-center space-x-5">
                  {chamado.status === "pendente" ? (
                    <button
                      onClick={() => handleStatusChange(chamado.id)}
                      className="flex items-center space-x-2 text-red-600 border border-red-600 rounded-md px-2 py-1 hover:bg-red-100 transition"
                    >
                      <Clock />
                      <span>Pendente</span>
                    </button>
                  ) : (
                    <button
                      disabled
                      className="flex items-center space-x-2 text-green-600 border border-green-600 rounded-md px-2 py-1 cursor-not-allowed"
                    >
                      <Check />
                      <span>Concluído</span>
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Chamados;
