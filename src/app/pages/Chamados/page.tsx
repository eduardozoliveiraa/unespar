"use client";

import { useEffect, useState } from "react";
import Header from "@/app/components/Header/page";
import { Check, Clock } from "lucide-react";
import Link from "next/link";

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
  const [selectedMotivo, setSelectedMotivo] = useState<string>("");

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

  const handleMotivoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMotivo(e.target.value);
  };

  const truncatedComment = (comment: string) => {
    const limit = 6;
    return comment.length > limit ? `${comment.substring(0, limit)}...` : comment;
  };

  const filteredChamados = chamados.filter(
    (chamado) =>
      selectedMotivo === "" || chamado.motivo.toLowerCase() === selectedMotivo.toLowerCase()
  );

  if (loading) {
    return <p>Carregando...</p>;
  }

  return (
    <div className="mx-auto bg-gray-100 rounded-lg">
      <Header />
      <h1 className="text-3xl font-bold text-center mb-6 pt-6 text-gray-800">
        Meus Chamados
      </h1>
      {error && <p className="text-red-500 text-center">{error}</p>}

      <div className="mb-4 text-center">
        <label htmlFor="motivo" className="mr-2 font-medium text-zinc-700">
          Filtrar por Motivo:
        </label>
        <select
          id="motivo"
          value={selectedMotivo}
          onChange={handleMotivoChange}
          className="border rounded-md p-2 text-zinc-700"
        >
          <option value="">Todos</option>
          <option value="internet">Internet</option>
          <option value="sistema">Sistema</option>
          <option value="computador não liga">Computador não Liga</option>
          <option value="computador com barulho estranho">Computador com Barulho Estranho</option>
          <option value="outro">Outro</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b-2 border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-700">
                Motivo
              </th>
              <th className="px-4 py-2 border-b-2 border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-700">
                Setor
              </th>
              <th className="px-4 py-2 border-b border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-700">
                Comentário
              </th>
              <th className="px-4 py-2 border-b border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-700">
                Arquivos
              </th>
              <th className="px-4 py-2 border-b border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-700">
                Status
              </th>
              <th className="px-4 py-2 border-b border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-700">
                Ações
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredChamados.map((chamado) => (
              <tr key={chamado.id}>
                <td className="px-4 py-2 border-b border-gray-200 text-sm text-gray-700">
                  {chamado.motivo}
                </td>
                <td className="px-4 py-2 border-b border-gray-200 text-sm text-gray-700">
                  {chamado.setor}
                </td>
                <td className="px-4 py-2 border-b border-gray-200 text-sm text-gray-700">
                  {truncatedComment(chamado.comment)}
                </td>
                <td className="px-4 py-2 border-b border-gray-200 text-sm text-gray-700">
                  {chamado.files.join(", ")}
                </td>
                <td className="px-4 py-2 border-b border-gray-200 text-sm text-gray-700 flex items-center space-x-5">
                  {chamado.status === "pendente" ? (
                    <div className="flex items-center space-x-2 text-red-600 border border-red-600 rounded-md px-2 py-1 hover:bg-red-100 transition">
                      <Clock />
                      <span>Pendente</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2 text-green-600 border border-green-600 hover:bg-green-100 rounded-md px-2 py-1">
                      <Check />
                      <span>Concluído</span>
                    </div>
                  )}
                </td>
                <td className="px-4 py-2 border-b border-gray-200 text-sm text-gray-700">
                  <Link href={`/pages/detalhesChamado/${chamado.id}`}>
                    <button className="text-blue-600 hover:text-blue-800">
                      Ver detalhes
                    </button>
                  </Link>
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
