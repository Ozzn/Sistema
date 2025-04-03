"use client";

import React, { useState, useEffect, FormEvent } from "react";
import Navbar from "../components/Navbar";

interface Unidad {
  id: number;
  nombre: string;
}

interface Operador {
  id: number;
  nombre: string;
}

interface Mecanico {
  id: number;
  nombre: string;
}

interface Mantenimiento {
  id: number;
  fechaEntrada: string;
  mecanico: string;
  kilometraje: string;
  tipo: string;
  diagnostico: string;
  recomendacion: string;
  observacionOperador?: string;
  observacionSupervisor?: string;
  fechaSalida?: string;
}

const MaintenanceForm: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [unidad, setUnidad] = useState<string>("");
  const [rutaUnidad, setRutaUnidad] = useState<string>("");
  const [operador, setOperador] = useState<string>("");
  const [mecanico, setMecanico] = useState<string>("");
  const [kilometraje, setKilometraje] = useState<string>("");
  const [tipo, setTipo] = useState<"p" | "c">("p");
  const [fechaEntrada, setFechaEntrada] = useState<string>("");
  const [diagnostico, setDiagnostico] = useState<string>("");
  const [recomendacion, setRecomendacion] = useState<string>("");
  const [observacionOperador, setObservacionOperador] = useState<string>("");
  const [observacionSupervisor, setObservacionSupervisor] = useState<string>("");
  const [mantenimientos, setMantenimientos] = useState<Mantenimiento[]>([]);
  const [unidades, setUnidades] = useState<Unidad[]>([]);
  const [operadores, setOperadores] = useState<Operador[]>([]);
  const [mecanicos, setMecanicos] = useState<Mecanico[]>([]);

  useEffect(() => {
    const fetchData = async (endpoint: string, setter: (data: any) => void) => {
      try {
        const response = await fetch(`/api/${endpoint}`);
        const data = await response.json();
        setter(data);
      } catch (error) {
        console.error(`Error al obtener ${endpoint}:`, error);
      }
    };

    fetchData("unidades", setUnidades);
    fetchData("operadores", setOperadores);
    fetchData("mecanicos", setMecanicos);
    fetchData("mantenimientos", setMantenimientos);
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const data = {
      unidad,
      rutaUnidad,
      operador,
      mecanico,
      kilometraje,
      tipo,
      fechaEntrada,
      diagnostico,
      recomendacion,
      observacionOperador,
      observacionSupervisor,
    };

    try {
      const response = await fetch("/api/mantenimiento", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        alert("Mantenimiento ingresado exitosamente");
        const updatedMantenimientos = await response.json();
        setMantenimientos(updatedMantenimientos);
      } else {
        alert("Error al ingresar mantenimiento");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error en la solicitud");
    }
  };

  return (
    <div className="flex">
      <Navbar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      <div className={`flex-1 bg-gray-100 min-h-screen transition-all duration-300 ${menuOpen ? "ml-64" : "ml-0 md:ml-64"}`}>
        <div className="container mx-auto p-6">
          <h4 className="text-lg font-semibold mb-4">Mantenimiento de Unidades</h4>

          {/* FORMULARIO */}
          <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow-md space-y-4">
            {/* Fila 1 */}
            <div className="flex flex-wrap gap-4">
              <select value={unidad} onChange={(e) => setUnidad(e.target.value)} className="p-2 border rounded w-1/4 min-w-[180px]">
                <option value="">Unidad</option>
                {unidades.map((u) => (
                  <option key={u.id} value={u.id}>{u.nombre}</option>
                ))}
              </select>

              <input
                type="text"
                placeholder="Ruta de la Unidad"
                value={rutaUnidad}
                onChange={(e) => setRutaUnidad(e.target.value)}
                className="p-2 border rounded w-1/4 min-w-[180px]"
              />

              <select value={operador} onChange={(e) => setOperador(e.target.value)} className="p-2 border rounded w-1/4 min-w-[180px]">
                <option value="">Operador</option>
                {operadores.map((o) => (
                  <option key={o.id} value={o.id}>{o.nombre}</option>
                ))}
              </select>

              <select value={mecanico} onChange={(e) => setMecanico(e.target.value)} className="p-2 border rounded w-1/4 min-w-[180px]">
                <option value="">Mecánico</option>
                {mecanicos.map((m) => (
                  <option key={m.id} value={m.id}>{m.nombre}</option>
                ))}
              </select>
            </div>

            {/* Fila 2 */}
            <div className="flex flex-wrap gap-4">
              <input
                type="text"
                placeholder="Kilometraje"
                value={kilometraje}
                onChange={(e) => setKilometraje(e.target.value)}
                className="p-2 border rounded w-1/4 min-w-[180px]"
              />

              <input
                type="date"
                value={fechaEntrada}
                onChange={(e) => setFechaEntrada(e.target.value)}
                className="p-2 border rounded w-1/4 min-w-[180px]"
              />

              <input
                type="text"
                placeholder="Observación Operador"
                value={observacionOperador}
                onChange={(e) => setObservacionOperador(e.target.value)}
                className="p-2 border rounded w-1/4 min-w-[180px]"
              />

              <input
                type="text"
                placeholder="Observación Supervisor"
                value={observacionSupervisor}
                onChange={(e) => setObservacionSupervisor(e.target.value)}
                className="p-2 border rounded w-1/4 min-w-[180px]"
              />
            </div>

            {/* Fila 3 */}
            <div className="flex flex-wrap gap-4">
              <input
                type="text"
                placeholder="Diagnóstico"
                value={diagnostico}
                onChange={(e) => setDiagnostico(e.target.value)}
                className="p-2 border rounded w-1/3 min-w-[180px]"
              />

              <input
                type="text"
                placeholder="Recomendación"
                value={recomendacion}
                onChange={(e) => setRecomendacion(e.target.value)}
                className="p-2 border rounded w-1/3 min-w-[180px]"
              />

              <div className="flex items-center gap-4 w-1/3">
                <label className="flex items-center">
                  <input type="radio" name="tipo" value="p" checked={tipo === "p"} onChange={() => setTipo("p")} className="mr-2" />
                  Preventivo
                </label>
                <label className="flex items-center">
                  <input type="radio" name="tipo" value="c" checked={tipo === "c"} onChange={() => setTipo("c")} className="mr-2" />
                  Correctivo
                </label>
              </div>
            </div>

            <button type="submit" className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              Ingresar Mantenimiento
            </button>
          </form>

          {/* TABLA */}
          <div className="mt-6">
            <h5 className="text-lg font-semibold mb-2">Mantenimientos Registrados</h5>
            <table className="w-full border-collapse border border-gray-300 text-sm">
              <thead className="bg-gray-800 text-white">
                <tr>
                  <th className="border p-2">ID</th>
                  <th className="border p-2">Entrada</th>
                  <th className="border p-2">Mecánico</th>
                  <th className="border p-2">KM</th>
                  <th className="border p-2">Tipo</th>
                  <th className="border p-2">Diagnóstico</th>
                  <th className="border p-2">Recomendación</th>
                  <th className="border p-2">Salida</th>
                </tr>
              </thead>
              <tbody>
                {mantenimientos.map((m) => (
                  <tr key={m.id} className="text-center">
                    <td className="border p-2">{m.id}</td>
                    <td className="border p-2">{m.fechaEntrada}</td>
                    <td className="border p-2">{m.mecanico}</td>
                    <td className="border p-2">{m.kilometraje}</td>
                    <td className="border p-2">{m.tipo === "p" ? "Preventivo" : "Correctivo"}</td>
                    <td className="border p-2">{m.diagnostico}</td>
                    <td className="border p-2">{m.recomendacion}</td>
                    <td className="border p-2">{m.fechaSalida || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </div>
  );
};

export default MaintenanceForm;
