"use client"; // Indica que este componente se ejecuta del lado del cliente (Next.js con app directory)

import { useState, useEffect } from "react";
import Navbar from "../components/Navbar"; // Importa el componente de navegación
import AuthGuard from "../components/AuthGuard"; // Importa el AuthGuard

export default function Home() {
  // Estado para manejar la apertura del menú lateral
  const [menuOpen, setMenuOpen] = useState(false);

  // Estado para almacenar las unidades traídas desde la API
  const [unidades, setUnidades] = useState<any[]>([]);

  // Función asincrónica para obtener los datos de las unidades desde el backend
  const fetchUnidades = async () => {
    try {
      const response = await fetch('/api/auth/unidades'); // Llama al endpoint
      const data = await response.json(); // Parsea la respuesta a JSON
      setUnidades(data); // Guarda los datos en el estado
    } catch (error) {
      console.error("Error al obtener las unidades:", error); // Captura errores
    }
  };

  // useEffect para ejecutar fetchUnidades al cargar el componente por primera vez
  useEffect(() => {
    fetchUnidades();
  }, []);

  // Agrupamiento de unidades por modelo, transmisión y combustible
  const groupedData = unidades.reduce((acc: any, unidad) => {
    // Clave única por combinación
    const key = `${unidad.modelo?.nombre}-${unidad.transmision}-${unidad.combustible}`;
    
    // Si no existe esa combinación en el acumulador, inicializar
    if (!acc[key]) {
      acc[key] = {
        modelo: unidad.modelo?.nombre,
        transmision: unidad.transmision,
        combustible: unidad.combustible,
        cantidad: 0,
        operativo: 0,
        inoperativo: 0,
        criticas: 0,
      };
    }

    // Incrementar cantidad total
    acc[key].cantidad += 1;

    // Contar según el estado de la unidad
    switch (unidad.statusId) {
      case 1: // Operativo
        acc[key].operativo += 1;
        break;
      case 2: // Inoperativo
        acc[key].inoperativo += 1;
        break;
      case 3: // Crítico
        acc[key].criticas += 1;
        break;
      default:
        break;
    }

    return acc;
  }, {});

  // Convertir el objeto agrupado a arreglo para renderizar en tabla
  const groupedArray = Object.values(groupedData);

  // Conteo general de estados de unidades
  const statusCounts = unidades.reduce(
    (acc: any, unidad) => {
      acc.total += 1; // Total general
      switch (unidad.statusId) {
        case 1:
          acc.operativo += 1;
          break;
        case 2:
          acc.inoperativo += 1;
          break;
        case 3:
          acc.critico += 1;
          break;
        default:
          break;
      }
      return acc;
    },
    { total: 0, operativo: 0, inoperativo: 0, critico: 0 }
  );

  // Cálculo de porcentajes con manejo de división por cero
  const operativoPercentage = (statusCounts.operativo / statusCounts.total) * 100 || 0;
  const inoperativoPercentage = (statusCounts.inoperativo / statusCounts.total) * 100 || 0;
  const criticoPercentage = (statusCounts.critico / statusCounts.total) * 100 || 0;

  // Renderizado del componente principal
  return (
    <AuthGuard>
      <div className="flex">
        {/* Menú lateral con Navbar */}
        <Navbar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

        {/* Contenido principal que se desplaza dependiendo si el menú está abierto */}
        <div className={`flex-1 bg-gray-100 min-h-screen transition-all duration-300 ${menuOpen ? "ml-64" : "ml-0 md:ml-64"}`}>
          <div className="p-6">
            
            {/* Tarjetas resumen de estados */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              {[
                {
                  count: statusCounts.operativo,
                  text: `${operativoPercentage.toFixed(2)}% UNIDADES OPERATIVAS`,
                  bg: "bg-green-500",
                },
                {
                  count: 13, // Valor fijo para mantenimiento
                  text: "9% UNIDADES MANTENIMIENTO",
                  bg: "bg-yellow-500"
                },
                {
                  count: statusCounts.inoperativo,
                  text: `${inoperativoPercentage.toFixed(2)}% UNIDADES INOPERATIVAS`,
                  bg: "bg-gray-600",
                },
                {
                  count: statusCounts.critico,
                  text: `${criticoPercentage.toFixed(2)}% UNIDADES CRÍTICAS`,
                  bg: "bg-red-600",
                },
              ].map((item, index) => (
                <div key={index} className={`${item.bg} p-4 rounded-md text-white`}>
                  <h3 className="text-2xl font-bold">{item.count}</h3>
                  <p className="text-sm">{item.text}</p>
                </div>
              ))}
            </div>

            {/* Tabla con agrupación por modelo */}
            <div className="mt-8 overflow-x-auto">
              <h2 className="text-lg font-semibold mb-4">MODELOS</h2>
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-800 text-white">
                    {["MODELO", "TRANSMISIÓN", "COMBUSTIBLE", "CANTIDAD", "OPERATIVO", "INOPERATIVO", "CRÍTICAS"].map((header, index) => (
                      <th key={index} className="px-4 py-2 border border-gray-400">{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {groupedArray.length > 0 ? (
                    groupedArray.map((row: any, index: number) => (
                      <tr key={index} className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}>
                        <td className="px-4 py-2 border border-gray-300">{row.modelo}</td>
                        <td className="px-4 py-2 border border-gray-300">{row.transmision}</td>
                        <td className="px-4 py-2 border border-gray-300">{row.combustible}</td>
                        <td className="px-4 py-2 border border-gray-300">{row.cantidad}</td>
                        <td className="px-4 py-2 border border-gray-300">{row.operativo}</td>
                        <td className="px-4 py-2 border border-gray-300">{row.inoperativo}</td>
                        <td className="px-4 py-2 border border-gray-300">{row.criticas}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="p-2 text-center">No hay datos disponibles.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
