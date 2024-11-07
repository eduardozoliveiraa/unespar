"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import Header from "@/app/components/Header/page";
import Link from "next/link";

const supabaseUrl = "https://bcvpyoxwhctyxwtnqosv.supabase.co"; 
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJjdnB5b3h3aGN0eXh3dG5xb3N2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjM5OTcxMjgsImV4cCI6MjAzOTU3MzEyOH0.p4SuRVAjR9rKtcGGLo41hDJ7Ed7IYqXSCuvUEXzVYLA";
const supabase = createClient(supabaseUrl, supabaseKey);

const Chamados = () => {
  const [selectedMotivo, setSelectedMotivo] = useState<string | null>(null);
  const [selectedSetor, setSelectedSetor] = useState<string | null>(null);
  const [comment, setComment] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  const handleMotivoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMotivo(e.target.value);
  };

  const handleSetorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSetor(e.target.value);
  };

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
    }
  };

  const removeFile = (fileName: string) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file.name !== fileName));
  };

  const handleButtonClick = async () => {
    if (!selectedMotivo || !selectedSetor) {
      setIsPopupVisible(true);
      return;
    }

    const storedUsername = localStorage.getItem("username");

    if (storedUsername) {
      try {
        const uploadedFiles = [];
        for (const file of files) {
          const { data, error } = await supabase.storage
            .from("unespar") 
            .upload(`uploads/${file.name}`, file);

          if (error) {
            console.error("Erro ao enviar arquivo:", error.message);
            alert("Erro ao enviar arquivo.");
            return;
          } else {
            uploadedFiles.push(data.path);
          }
        }

        const response = await fetch("/api/chamados", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            motivo: selectedMotivo,
            setor: selectedSetor,
            comment,
            files: uploadedFiles, 
            username: storedUsername,
          }),
        });

        if (response.ok) {
          alert("Chamado criado com sucesso!");
          setSelectedMotivo(null);
          setSelectedSetor(null);
          setComment("");
          setFiles([]);
        } else {
          alert("Falha ao criar o chamado.");
        }
      } catch (error) {
        console.error("Error:", error);
        alert("Erro ao criar o chamado.");
      }
    }
  };

  const closePopup = () => {
    setIsPopupVisible(false);
  };

  return (
    <div>
      <Header />

      <div className="bg-gray-900 p-10 min-h-screen flex flex-col items-center justify-center">
        <div className="w-full max-w-3xl bg-white p-8 rounded-lg shadow-lg space-y-6">
          <div>
            <div className="flex  justify-end text-blue-500">
              <Link href={"/pages/duvidas"}>Dúvidas frequentes</Link>
            </div>
            <label
              htmlFor="motivo"
              className="block text-lg font-bold mb-2 text-gray-800"
            >
              Selecione um motivo:
            </label>
            <select
              id="motivo"
              value={selectedMotivo || ""}
              onChange={handleMotivoChange}
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-800"
            >
              <option value="" disabled>
                Escolha um motivo
              </option>
              {[
                "Sem Internet ou Internet lenta",
                "Sistema Travado",
                "Computador não liga",
                "Computador com barulho estranho",
                "Outros",
              ].map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="setor"
              className="block text-lg font-bold mb-2 text-gray-800"
            >
              Selecione um setor:
            </label>
            <select
              id="setor"
              value={selectedSetor || ""}
              onChange={handleSetorChange}
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-800"
            >
              <option value="" disabled>
                Escolha um setor
              </option>
              {[
                "RH",
                "Secretaria",
                "Lab matemática",
                "Lab Química",
                "Lab Geografia",
                "Audio visuais",
                "Gabinete",
                "Diretor",
                "Biblioteca",
                "Direitos Humanos",
                "Laphis",
                "Life",
                "Colegiado Direito",
                "Colegiado de Pedagogia",
                "DAF",
                "Prograd",
                "Agitec",
                "Patrimonio",
                "Cotação",
                "Niet",
              ].map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="comment"
              className="block text-lg font-bold mb-2 text-gray-800"
            >
              Comentário:
            </label>
            <textarea
              id="comment"
              value={comment}
              onChange={handleCommentChange}
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-800"
              rows={4}
              placeholder="Digite seu comentário aqui"
            />
          </div>

          <div>
            <label
              htmlFor="files"
              className="block text-lg font-bold mb-2 text-gray-800"
            >
              Anexar arquivos:
            </label>
            <input
              id="files"
              type="file"
              multiple
              onChange={handleFileChange}
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50"
            />
            {files.length > 0 && (
              <div className="mt-4">
                <h3 className="text-lg font-bold text-gray-800">
                  Arquivos Selecionados:
                </h3>
                <ul className="list-disc list-inside text-gray-800 mt-2">
                  {files.map((file) => (
                    <li
                      key={file.name}
                      className="flex items-center justify-between"
                    >
                      <span className="truncate">{file.name}</span>
                      <button
                        onClick={() => removeFile(file.name)}
                        className="text-red-600 hover:text-red-800"
                      >
                        X
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        <div className="relative mt-8">
          <button
            className={`px-6 py-3 text-white font-bold rounded-lg transition-colors duration-300 ${
              selectedMotivo && selectedSetor
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-500"
            }`}
            onClick={handleButtonClick}
          >
            Concluir
          </button>
        </div>
      </div>

      {isPopupVisible && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full text-center">
            <h2 className="text-lg font-bold mb-4 text-red-700">Atenção</h2>
            <p className="mb-4 text-black">
              Você precisa selecionar um motivo e um setor antes de avançar.
            </p>
            <button
              onClick={closePopup}
              className="px-4 py-2 bg-red-700 text-white rounded-lg font-bold hover:bg-red-600 transition duration-300"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chamados;
