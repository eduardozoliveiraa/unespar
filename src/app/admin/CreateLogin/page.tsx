/* eslint-disable @next/next/no-img-element */
export default function CreateLogin() {
    return (
      <>
        <div className="flex items-center bg-slate-600 text-white text-lg p-4 shadow-md">
          <img className="w-20 h-auto" src="/logo.png" alt="Logo" />
          <div className="flex-grow text-center text-2xl md:text-3xl lg:text-4xl font-semibold">
            Central de Chamados
          </div>
          <div className="w-20"></div>
        </div>
  
        <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
              Login
            </h2>
  
            <div className="mb-4">
              <label htmlFor="firstName" className="block text-gray-700 font-medium mb-2">
                Nome do Usuário
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                className="w-full p-3 border border-gray-300 rounded-lg"
                placeholder="Digite o nome do usuário"
              />
            </div>
  
            <div className="mb-6">
              <label htmlFor="lastName" className="block text-gray-700 font-medium mb-2">
                Sobrenome do Usuário
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                className="w-full p-3 border border-gray-300 rounded-lg"
                placeholder="Digite o sobrenome do usuário"
              />
            </div>
  
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Entrar
            </button>
          </div>
        </div>
      </>
    );
  }
  