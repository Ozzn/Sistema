//INICIO DE SESION 
export default function Home() {  // Componenete prinicipal de la app 
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">  
        Bienvenido a BUSYARACUY
      </h1>
      <p className="text-lg text-gray-600 mb-6"> 
        Por favor, inicia sesión 
      </p> 
      <div className="space-x-4">
        <a
          href="/login"
          className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition" //boton de inicio sesion
        >
          Iniciar sesión
        </a>
        
      </div>
    </main>
  );
}
