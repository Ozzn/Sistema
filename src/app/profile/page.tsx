"use client";

import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [unidades, setUnidades] = useState<any[]>([]); // Para almacenar las unidades de la API

  // Función para obtener los datos de las unidades
  const fetchUnidades = async () => {
    try {
      const response = await fetch('/api/auth/unidades');
      const data = await response.json();
      setUnidades(data);
    } catch (error) {
      console.error("Error al obtener las unidades:", error);
    }
  };

  useEffect(() => {
    fetchUnidades();
  }, []);

  // Agrupar unidades por modelo, transmisión y combustible
  const groupedData = unidades.reduce((acc: any, unidad) => {
    const key = `${unidad.modelo?.nombre}-${unidad.transmision}-${unidad.combustible}`;
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
    acc[key].cantidad += 1;
    
    // Contabilizar según el statusId
    switch (unidad.statusId) {
      case 1:
        acc[key].operativo += 1;
        break;
      case 2:
        acc[key].inoperativo += 1;
        break;
      case 3:
        acc[key].criticas += 1;
        break;
      default:
        break;
    }
    return acc;
  }, {});

  const groupedArray = Object.values(groupedData);

  // Contar las unidades por estado (operativo, inoperativo, critico)
  const statusCounts = unidades.reduce(
    (acc: any, unidad) => {
      acc.total += 1;
      switch (unidad.statusId) {
        case 1: // Operativo
          acc.operativo += 1;
          break;
        case 2: // Inoperativo
          acc.inoperativo += 1;
          break;
        case 3: // Crítico
          acc.critico += 1;
          break;
        default:
          break;
      }
      return acc;
    },
    { total: 0, operativo: 0, inoperativo: 0, critico: 0 }
  );

  // Calcular los porcentajes
  const operativoPercentage = (statusCounts.operativo / statusCounts.total) * 100 || 0;
  const inoperativoPercentage = (statusCounts.inoperativo / statusCounts.total) * 100 || 0;
  const criticoPercentage = (statusCounts.critico / statusCounts.total) * 100 || 0;

  return (
    <div className="flex">
      {/* Menú lateral */}
      <Navbar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      {/* Contenido principal */}
      <div className={`flex-1 bg-gray-100 min-h-screen transition-all duration-300 ${menuOpen ? "ml-64" : "ml-0 md:ml-64"}`}>
        <div className="p-6">
          {/* Tarjetas de estado de unidades */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            {[
              {
                count: statusCounts.operativo,
                text: `${operativoPercentage.toFixed(2)}% UNIDADES OPERATIVAS`,
                bg: "bg-green-500",
              },
              { count: 13, text: "9% UNIDADES MANTENIMIENTO", bg: "bg-yellow-500" }, // Mantenimiento lo dejas fijo
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

          {/* Tabla de modelos agrupados */}
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
  );
}
