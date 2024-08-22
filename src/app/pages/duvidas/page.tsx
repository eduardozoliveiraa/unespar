"use client";

import React, { useState } from "react";
import Header from "@/app/components/Header/page";
import { ArrowDown } from "lucide-react";

const Duvidas = () => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const duvidasList = [
    {
      titulo: "Sem Internet ou Internet lenta",
      solucao:
        "Verifique se todos os cabos estão conectados corretamente. Reinicie o roteador e o modem. Se o problema persistir, entre em contato com o suporte técnico.",
    },
    {
      titulo: "Sistema Travado",
      solucao:
        "Pressione Ctrl + Alt + Del e tente finalizar o processo que não está respondendo. Se isso não funcionar, reinicie o computador.",
    },
    {
      titulo: "Computador não liga",
      solucao:
        "Verifique se o cabo de energia está conectado. Tente usar outra tomada ou cabo de energia. Se o problema persistir, o problema pode estar na fonte de alimentação.",
    },
    {
      titulo: "Computador com barulho estranho",
      solucao:
        "Verifique se há algo preso nas ventoinhas do computador. Barulhos estranhos podem indicar problemas no hardware, como no disco rígido ou nas ventoinhas.",
    },
    {
      titulo: "Outros",
      solucao:
        "Para outras dúvidas, consulte o manual do usuário ou entre em contato com o suporte técnico.",
    },
  ];

  const handleToggle = (index: number) => {
    setSelectedIndex(selectedIndex === index ? null : index);
  };

  return (
    <>
    <div>
      <Header />
      <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-md mt-10">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
          Dúvidas Frequentes
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {duvidasList.map((duvida, index) => (
            <div
              key={index}
              className="p-4 border border-gray-300 rounded-md hover:bg-gray-100 transition cursor-pointer"
              onClick={() => handleToggle(index)}
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-medium text-gray-700">{duvida.titulo}</h2>
                <ArrowDown className={`text-black transition-transform ${selectedIndex === index ? 'rotate-180' : ''}`} />
              </div>
              {selectedIndex === index && (
                <p className="mt-4 text-gray-600">{duvida.solucao}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
    </>
  );
};

export default Duvidas;
