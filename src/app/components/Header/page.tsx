/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from "react";

const Header = () => {
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    setUsername(storedUsername);
  }, []);

  return (
    <div>
      <div className="flex items-center bg-slate-600 text-white text-lg p-4">
        <img className="w-20 h-auto" src="/logo.png" alt="Logo" />
        <div className="flex-grow text-center text-2xl md:text-3xl lg:text-4xl font-semibold">
          Central de Chamados
        </div>
        <div className="">
          {username && (
            <div className="border border-white text-lg px-4 py-1 rounded-full">
              {username}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
