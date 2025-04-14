"use client";

import React, { useState, useEffect, FormEvent } from "react";
import Navbar from "../../components/Navbar";

interface Unidad {
  id: number;
  idUnidad: string;
}

interface Personal {
  id: number;
  nombre: string;
  apellido: string;
  cargoId: number;
}

interface Mecanico {
  id: number;
  nombres: string;
  apellidos: string;
  roleId: number;
}

const MaintenanceForm: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [unidad, setUnidad] = useState<string>("");
  const [rutaUnidad, setRutaUnidad] = useState<string>("");
  const [operador, setOperador] = useState<string>("");
  const [mecanico, setMecanico] = useState<string>("");
  const [kilometraje, setKilometraje] = useState<string>("");
  const [tipo, setTipo] = useState<"p" | "c">("p");
  const [prioridad, setPrioridad] = useState<"baja" | "media" | "alta" | "urgente">("baja");
  const [fechaEntrada, setFechaEntrada] = useState<string>("");
  const [diagnostico, setDiagnostico] = useState<string>("");
  const [recomendacion, setRecomendacion] = useState<string>("");
  const [observacionOperador, setObservacionOperador] = useState<string>("");
  const [observacionSupervisor, setObservacionSupervisor] = useState<string>("");

  const [unidades, setUnidades] = useState<Unidad[]>([]);
  const [operadores, setOperadores] = useState<Personal[]>([]);
  const [mecanicos, setMecanicos] = useState<Mecanico[]>([]);

  useEffect(() => {
    const fetchUnidades = async () => {
      try {
        const response = await fetch("/api/auth/unidades");
        const data = await response.json();
        setUnidades(data);
      } catch (error) {
        console.error("Error al obtener unidades:", error);
      }
    };

    const fetchPersonal = async () => {
      try {
        const response = await fetch("/api/auth/personal?action=list");
        const result = await response.json();

        if (result.success) {
          const data: Personal[] = result.data;
          const operadoresFiltrados = data.filter((p) => p.cargoId === 22);
          setOperadores(operadoresFiltrados);
        }
      } catch (error) {
        console.error("Error al obtener personal:", error);
      }
    };

    const fetchMecanicos = async () => {
      try {
        const response = await fetch("/api/auth/register");
        const result = await response.json();

        if (result.users) {
          const mecanicosFiltrados = result.users
            .filter((u: Mecanico) => u.roleId === 2)
            .map((m: Mecanico) => ({
              id: m.id,
              nombres: m.nombres,
              apellidos: m.apellidos,
              roleId: m.roleId,
            }));
          setMecanicos(mecanicosFiltrados);
        }
      } catch (error) {
        console.error("Error al obtener mecánicos:", error);
      }
    };

    fetchUnidades();
    fetchPersonal();
    fetchMecanicos();
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
      prioridad,
      fechaEntrada,
      diagnostico,
      recomendacion,
      observacionOperador,
      observacionSupervisor,
    };

    try {
      const response = await fetch("/api/auth/mantenimiento", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        alert("Mantenimiento ingresado exitosamente");
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
      <div
        className={`flex-1 bg-gray-100 min-h-screen transition-all duration-300 ${menuOpen ? "ml-64" : "ml-0 md:ml-64"}`}
      >
        <div className="container mx-auto p-6">
          <h4 className="text-xl font-semibold mb-6">Mantenimiento de Unidades</h4>

          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-lg shadow-md grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            <select
              value={unidad}
              onChange={(e) => setUnidad(e.target.value)}
              className="p-2 border rounded"
            >
              <option value="">Unidad</option>
              {unidades.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.idUnidad}
                </option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Ruta de la Unidad"
              value={rutaUnidad}
              onChange={(e) => setRutaUnidad(e.target.value)}
              className="p-2 border rounded"
            />

            <select
              value={operador}
              onChange={(e) => setOperador(e.target.value)}
              className="p-2 border rounded"
            >
              <option value="">Operador</option>
              {operadores.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.nombre} {o.apellido}
                </option>
              ))}
            </select>

            <select
              value={mecanico}
              onChange={(e) => setMecanico(e.target.value)}
              className="p-2 border rounded"
            >
              <option value="">Mecánico</option>
              {mecanicos.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.nombres} {m.apellidos}
                </option>
              ))}
            </select>

            <input
              type="number"
              placeholder="Kilometraje"
              value={kilometraje}
              onChange={(e) => setKilometraje(e.target.value)}
              className="p-2 border rounded"
            />

            <input
              type="date"
              value={fechaEntrada}
              onChange={(e) => setFechaEntrada(e.target.value)}
              className="p-2 border rounded"
            />

            <input
              type="text"
              placeholder="Observación Operador"
              value={observacionOperador}
              onChange={(e) => setObservacionOperador(e.target.value)}
              className="p-2 border rounded"
            />

            <input
              type="text"
              placeholder="Observación Supervisor"
              value={observacionSupervisor}
              onChange={(e) => setObservacionSupervisor(e.target.value)}
              className="p-2 border rounded"
            />

            <select
              value={tipo}
              onChange={(e) => setTipo(e.target.value as "p" | "c")}
              className="p-2 border rounded"
            >
              <option value="p">Preventivo</option>
              <option value="c">Correctivo</option>
            </select>

            <select
              value={prioridad}
              onChange={(e) => setPrioridad(e.target.value as "baja" | "media" | "alta" | "urgente")}
              className="p-2 border rounded"
            >
              <option value="baja">Baja</option>
              <option value="media">Media</option>
              <option value="alta">Alta</option>
              <option value="urgente">Urgente</option>
            </select>

            <input
              type="text"
              placeholder="Diagnóstico"
              value={diagnostico}
              onChange={(e) => setDiagnostico(e.target.value)}
              className="p-2 border rounded"
            />

            <input
              type="text"
              placeholder="Recomendación"
              value={recomendacion}
              onChange={(e) => setRecomendacion(e.target.value)}
              className="p-2 border rounded"
            />

            <div className="col-span-full flex justify-center">
              <button
                type="submit"
                className="bg-blue-500 text-white px-3 py-1 text-sm rounded hover:bg-blue-600"
              >
                Guardar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceForm;
