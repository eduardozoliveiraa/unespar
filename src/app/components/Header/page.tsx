/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useEffect, useState } from "react";
import { ArrowDown } from "lucide-react";
import Link from "next/link";

const Header = () => {
  const [username, setUsername] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    const storedUserId = localStorage.getItem("userId");
    setUsername(storedUsername);
    setUserId(storedUserId);
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div>
      <div className="flex items-center bg-slate-600 text-white text-lg p-4">
        <img className="w-20 h-auto" src="/logo.png" alt="Logo" />
        <div className="flex-grow text-center text-2xl md:text-3xl lg:text-4xl font-semibold">
          Central de Chamados
        </div>
        <div className="relative">
          {username && (
            <div className="flex items-center border border-white text-lg px-4 py-1 rounded-full">
              <span>{username}</span>
              <button onClick={toggleMenu} className="ml-2 flex items-center">
                <ArrowDown
                  className={`w-5 h-5 transition-transform border rounded-full ${
                    menuOpen ? "transform rotate-180" : ""
                  }`}
                />
              </button>
            </div>
          )}
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-md shadow-lg z-10">
              <ul className="py-2">
                <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer">
                  <Link href={"/pages/Pagprincipal"}>Novo chamado</Link>
                </li>
                <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer">
                  <Link href={`/pages/Chamados?userId=${userId}`}>
                    Meus Chamados
                  </Link>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
