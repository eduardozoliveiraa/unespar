"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/app/components/Header/page";
import { Check, Clock } from "lucide-react";
import Link from "next/link";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

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

  const router = useRouter();

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
        const res = await fetch(`/api/getAllChamados`, {
          method: "GET",
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

  const handleMotivoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMotivo(e.target.value);
  };

  const truncatedComment = (comment: string) => {
    const limit = 10;
    return comment.length > limit
      ? comment.substring(0, limit) + "..."
      : comment;
  };

  const filteredChamados = chamados.filter((chamado) =>
    chamado.motivo.toLowerCase().includes(selectedMotivo.toLowerCase())
  );

  const chartData = {
    labels: [
      "Internet",
      "Sistema travado",
      "Computador não liga",
      "Computador com barulho estranho",
      "Outro",
    ],
    datasets: [
      {
        label: "Número de Chamados",
        data: [
          chamados.filter(
            (chamado) => chamado.motivo.toLowerCase() === "internet"
          ).length,
          chamados.filter(
            (chamado) => chamado.motivo.toLowerCase() === "sistema travado"
          ).length,
          chamados.filter(
            (chamado) => chamado.motivo.toLowerCase() === "computador não liga"
          ).length,
          chamados.filter(
            (chamado) =>
              chamado.motivo.toLowerCase() === "computador com barulho estranho"
          ).length,
          chamados.filter((chamado) => chamado.motivo.toLowerCase() === "outro")
            .length,
        ],
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            return `${context.dataset.label}: ${context.raw}`;
          },
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  if (loading) {
    return <p>Carregando...</p>;
  }

  return (
    <div className="mx-auto bg-gray-100 rounded-lg">
      <Header />
      <h1 className="text-3xl font-bold text-center mb-6 pt-6 text-gray-800">
        Todos os Chamados
      </h1>
      {error && <p className="text-red-500 text-center">{error}</p>}

      <div className="mb-6 text-center">
        <select
          value={selectedMotivo}
          onChange={handleMotivoChange}
          className="px-4 py-2 border rounded-md bg-slate-500"
        >
          <option value="">Selecione um motivo</option>
          <option value="internet">Internet</option>
          <option value="sistema travado">Sistema travado</option>
          <option value="computador não liga">Computador não liga</option>
          <option value="computador com barulho estranho">
            Computador com barulho estranho
          </option>
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
              <th className="px-4 py-2 border-b-2 border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-700">
                Comentário
              </th>
              <th className="px-4 py-2 border-b-2 border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-700">
                Arquivos
              </th>
              <th className="px-4 py-2 border-b-2 border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-700">
                Username
              </th>
              <th className="px-4 py-2 border-b-2 border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-700">
                Status
              </th>
              <th className="px-4 py-2 border-b-2 border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-700">
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
                  {chamado.files.map((file, index) => (
                    <a
                      key={index}
                      href={`https://bcvpyoxwhctyxwtnqosv.supabase.co/storage/v1/object/public/unespar/${file}`}
                      rel="noopener noreferrer"
                      target="_blank"
                      className="text-blue-600 hover:underline"
                    >
                      {file}
                    </a>
                  ))}
                </td>
                <td className="px-4 py-2 border-b border-gray-200 text-sm text-gray-700">
                  {chamado.username}
                </td>
                <td className="px-4 py-2 border-b border-gray-200 text-sm text-gray-700 flex items-center space-x-5">
                  {chamado.status === "pendente" ? (
                    <button
                      onClick={() => handleStatusChange(chamado.id)}
                      className="flex items-center space-x-2 text-red-600 border border-red-600 rounded-md px-2 py-1 hover:bg-red-600 hover:text-white"
                    >
                      <Clock size={16} />
                      <span>Pendente</span>
                    </button>
                  ) : (
                    <span className="flex items-center space-x-2 text-green-600 border border-green-600 rounded-md px-2 py-1">
                      <Check size={16} />
                      <span>Concluído</span>
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-10">
        <h2 className="text-2xl font-semibold text-gray-800 text-center">
          Estatísticas de Chamados
        </h2>
        <div className="relative h-80 mt-6">
          <Bar data={chartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

export default Chamados;
