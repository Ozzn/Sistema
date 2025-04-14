'use client';
import { useEffect, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Search, ClipboardList } from "lucide-react";

export default function DespachoPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [mantenimientos, setMantenimientos] = useState<any[]>([]);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    const fetchMantenimientos = async () => {
      try {
        const res = await axios.get("/api/auth/mantenimiento");
        setMantenimientos(res.data);
      } catch (error) {
        console.error("Error al obtener mantenimientos:", error);
      }
    };

    fetchMantenimientos();
  }, []);

  if (!session) return <div className="flex justify-center items-center h-screen">Cargando sesión...</div>;

  const usuarioId = session?.user?.id;

  const mantenimientosAsignados = mantenimientos.filter(
    (mantenimiento) => mantenimiento?.mecanico?.id === usuarioId
  );

  const mantenimientosFiltrados = mantenimientosAsignados.filter((mantenimiento) => {
    const cod = mantenimiento.id.toString().toLowerCase();
    const unidad = mantenimiento.unidad.idUnidad.toLowerCase();
    return cod.includes(busqueda.toLowerCase()) || unidad.includes(busqueda.toLowerCase());
  });

  const noIniciados = mantenimientosFiltrados.filter((m) => !m.fechaInicio);
  const enProceso = mantenimientosFiltrados.filter((m) => m.fechaInicio && !m.fechaFinalizacion);
  const finalizados = mantenimientosFiltrados.filter((m) => m.fechaFinalizacion);

  const handleIniciarClick = (id: number) => {
    router.push(`/mantenimiento/${id}`);
  };

  const renderMantenimientos = (lista: any[], estado: "No Iniciados" | "En Proceso" | "Finalizados") => {
    const bordeColor = {
      "No Iniciados": "border-blue-500",
      "En Proceso": "border-yellow-500",
      "Finalizados": "border-green-500",
    };

    return lista.map((mantenimiento, index) => (
      <div key={mantenimiento.id} className="flex relative gap-4">
        <div className="flex flex-col items-center z-10 relative w-16">
          <div className="absolute -top-5 text-xs bg-red-600 text-white font-semibold px-2 py-1 rounded-full shadow">
            {new Date(mantenimiento.fechaEntrada).toLocaleDateString()}
          </div>
          <div className="mt-16 bg-blue-600 text-white rounded-full p-2 shadow">
            <ClipboardList size={20} />
          </div>
          {index < lista.length - 1 && (
            <div className="w-px flex-1 bg-gray-300 mt-2"></div>
          )}
        </div>

        <div className={`relative bg-white shadow-md rounded-xl p-6 w-full border-2 ${bordeColor[estado]}`}>
          <div className="flex justify-between mb-2 text-sm text-gray-600">
            <span className="font-semibold text-blue-700">
              COD: <span className="text-red-600">{mantenimiento.id}</span>
            </span>
            <span className="font-semibold text-blue-700">
              UNIDAD: <span className="text-red-600">{mantenimiento.unidad.idUnidad}</span>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-gray-800 text-sm mt-4">
            <p><span className="font-bold">MODELO:</span> {mantenimiento.unidad.modelo.nombre}</p>
            <p><span className="font-bold">MARCA:</span> {mantenimiento.unidad.marca.nombre}</p>
            <p><span className="font-bold">TIPO:</span> {mantenimiento.tipo}</p>
            <p><span className="font-bold">COMBUSTIBLE:</span> {mantenimiento.unidad.combustible}</p>
            <p><span className="font-bold">KILOMETRAJE:</span> {mantenimiento.kilometraje.toLocaleString()} km</p>
            <p><span className="font-bold">PRIORIDAD:</span> {mantenimiento.prioridad}</p>
            <p><span className="font-bold">OPERADOR:</span> {mantenimiento.operador?.nombre}</p>
            <p className="md:col-span-2">
              <span className="font-bold">DIAGNÓSTICO:</span> {mantenimiento.diagnostico}
            </p>
          </div>

          <div className="flex justify-end mt-6">
            <button
              onClick={() => handleIniciarClick(mantenimiento.id)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow"
            >
              Ver Detalles
            </button>
          </div>
        </div>
      </div>
    ));
  };

  return (
    <div className="pl-64 p-6 min-h-screen bg-gray-100">
      <div className="flex flex-col items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Mis mantenimientos asignados</h1>
        <div className="relative w-full max-w-md">
          <input
            type="text"
            placeholder="Buscar por código o unidad..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
        </div>
      </div>

      {mantenimientosFiltrados.length === 0 ? (
        <div className="text-center text-gray-600 mt-10">No se encontraron mantenimientos.</div>
      ) : (
        <div className="space-y-16">
          {noIniciados.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-blue-600 mb-4">No Iniciados</h2>
              <div className="space-y-12">
                {renderMantenimientos(noIniciados, "No Iniciados")}
              </div>
            </div>
          )}

          {enProceso.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-yellow-600 mb-4">En Proceso</h2>
              <div className="space-y-12">
                {renderMantenimientos(enProceso, "En Proceso")}
              </div>
            </div>
          )}

          {finalizados.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-green-600 mb-4">Finalizados</h2>
              <div className="space-y-12">
                {renderMantenimientos(finalizados, "Finalizados")}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
