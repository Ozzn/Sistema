"use client";
import AuthGuard from "../components/AuthGuard";
import Link from "next/link";
import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { FaPlusCircle } from "react-icons/fa";
import Navbar from "../components/Navbar";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { FileDown, FileText } from "lucide-react";


interface Unidad {
  id: number;
  idUnidad: string;
  marca: {
    nombre: string;
  };
  modelo: {
    nombre: string;
  };
  transmision: string;
  vim: string;
  fecha: string;
  capacidad: string;
  combustible: string;
  status: {
    id: number;
    nombre: string;
  };
}

interface Marca {
  id: number;
  nombre: string;
}

interface Modelo {
  id: number;
  nombre: string;
}

function Unidades() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    idUnidad: "",
    marcaId: "",
    modeloId: "",
    vim: "",
    fecha: "",
    capacidad: "",
    combustible: "",
    transmision: "",
    statusId: "1",
  });

  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [modelos, setModelos] = useState<Modelo[]>([]);
  const [unidades, setUnidades] = useState<Unidad[]>([]);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [marcaModalOpen, setMarcaModalOpen] = useState(false);
  const [modeloModalOpen, setModeloModalOpen] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<Unidad | null>(null);
  const [newMarca, setNewMarca] = useState("");
  const [newModelo, setNewModelo] = useState("");

  const fetchData = async (endpoint: string, setter: (data: any) => void) => {
    try {
      const response = await fetch(`/api/auth/${endpoint}`);
      const data = await response.json();
      setter(data);
    } catch (error) {
      console.error(`Error al obtener ${endpoint}:`, error);
    }
  };

  useEffect(() => {
    fetchData("marcas", setMarcas);
    fetchData("modelos", setModelos);
    fetchData("unidades", (data) => {
      setUnidades(data);
    });
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!formData.marcaId) {
      alert("Selecciona una marca");
      return;
    }

    try {
      const response = await fetch("/api/auth/unidades", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, statusId: "1" }),
      });

      if (response.ok) {
        alert("Unidad registrada exitosamente");
        setFormData({
          idUnidad: "",
          marcaId: "",
          modeloId: "",
          vim: "",
          fecha: "",
          capacidad: "",
          combustible: "",
          transmision: "",
          statusId: "1",
        });
        fetchData("unidades", (data) => {
          setUnidades(data);
        });
      } else {
        const result = await response.json();
        alert(result.message || "Error al registrar la unidad");
      }
    } catch (error) {
      console.error("Error al registrar la unidad:", error);
      alert("Hubo un error al enviar los datos");
    }
  };

  const handleAddMarca = async () => {
    if (!newMarca.trim()) {
      alert("Ingresa un nombre válido para la marca");
      return;
    }

    try {
      const response = await fetch("/api/auth/marcas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre: newMarca }),
      });

      if (response.ok) {
        alert("Marca agregada exitosamente");
        setNewMarca("");
        setMarcaModalOpen(false);
        fetchData("marcas", setMarcas);
      } else {
        alert("Error al agregar marca");
      }
    } catch (error) {
      console.error("Error al agregar marca:", error);
      alert("Error al agregar marca");
    }
  };

  const handleAddModelo = async () => {
    if (!newModelo.trim()) {
      alert("Ingresa un nombre válido para el modelo");
      return;
    }

    try {
      const response = await fetch("/api/auth/modelos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre: newModelo }),
      });

      if (response.ok) {
        alert("Modelo agregado exitosamente");
        setNewModelo("");
        setModeloModalOpen(false);
        fetchData("modelos", setModelos);
      } else {
        alert("Error al agregar modelo");
      }
    } catch (error) {
      console.error("Error al agregar modelo:", error);
      alert("Error al agregar modelo");
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    if (selectedUnit) {
      let statusId = 1; // Default 'operativo'
      switch (newStatus.toLowerCase()) {
        case "inoperativo":
          statusId = 2;
          break;
        case "crítico":
          statusId = 3;
          break;
        // No incluimos el caso para mantenimiento (4) ya que se maneja desde otra vista
        default:
          statusId = 1;
      }

      try {
        const response = await fetch('/api/auth/unidades', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: selectedUnit.id,
            statusId: statusId,
          }),
        });

        if (response.ok) {
          alert("Estado actualizado con éxito");
          setStatusModalOpen(false);
          fetchData("unidades", (data) => { setUnidades(data); });
        } else {
          alert("Error al actualizar el estado");
        }
      } catch (error) {
        console.error("Error al cambiar el estado:", error);
        alert("Error al cambiar el estado");
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase?.()) {
      case "operativo":
        return "bg-green-500";
      case "inoperativo":
        return "bg-blue-500";
      case "crítico":
        return "bg-red-500";
      case "mantenimiento":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusName = (statusId: number) => {
    switch (statusId) {
      case 1:
        return "Operativo";
      case 2:
        return "Inoperativo";
      case 3:
        return "Crítico";
      case 4:
        return "Mantenimiento";
      default:
        return "Desconocido";
    }
  };

  const exportToExcel = () => {
    if (!unidades.length) return alert("No hay datos para exportar");

    const datos = unidades.map(u => ({
      ID: u.idUnidad,
      Marca: u.marca?.nombre || "N/A",
      Modelo: u.modelo?.nombre || "N/A",
      Transmisión: u.transmision,
      VIM: u.vim,
      Año: u.fecha,
      Estado: getStatusName(u.status?.id || 0)
    }));

    const worksheet = XLSX.utils.json_to_sheet(datos);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Unidades");
    XLSX.writeFile(workbook, "unidades.xlsx");
  };

  const exportToPDF = () => {
    if (!unidades.length) return alert("No hay datos para exportar");

    const doc = new jsPDF();
    const headers = [["ID", "Marca", "Modelo", "Transmisión", "VIM", "Año", "Estado"]];
    const rows = unidades.map(u => [
      u.idUnidad,
      u.marca?.nombre || "N/A",
      u.modelo?.nombre || "N/A",
      u.transmision,
      u.vim,
      u.fecha,
      getStatusName(u.status?.id || 0)
    ]);

    autoTable(doc, {
      head: headers,
      body: rows,
    });

    doc.save("unidades.pdf");
  };

  return (
    <AuthGuard>
      <div className="flex">
        <Navbar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

        <div className={`flex-1 bg-gray-100 min-h-screen transition-all duration-300 ${menuOpen ? "ml-64" : "ml-0 md:ml-64"}`}>
          <div className="mt-4 flex gap-4">
            <button
              onClick={exportToExcel}
              className="flex items-center bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded"
            >
              <FileDown className="mr-2 h-4 w-4" />
              Exportar Excel
            </button>

            <button
              onClick={exportToPDF}
              className="flex items-center bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded"
            >
              <FileText className="mr-2 h-4 w-4" />
              Exportar PDF
            </button>
          </div>

          <div className="container mx-auto p-6">
            <h4 className="text-lg font-semibold mb-4">AGREGAR NUEVA UNIDAD</h4>

            <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow-md">
              <div className="grid grid-cols-4 gap-2">
                <input type="text" name="idUnidad" placeholder="Id Unidad" className="p-2 border rounded-md text-center" value={formData.idUnidad} onChange={handleChange} />
                <div className="flex items-center">
                  <select name="marcaId" className="p-2 border rounded-md text-center" value={formData.marcaId} onChange={handleChange}>
                    <option value="">MARCA</option>
                    {marcas.map((marca) => (
                      <option key={marca.id} value={marca.id}>{marca.nombre}</option>
                    ))}
                  </select>
                  <FaPlusCircle
                    className="ml-2 text-blue-500 cursor-pointer"
                    size={20}
                    onClick={() => setMarcaModalOpen(true)}
                  />
                </div>
                <div className="flex items-center">
                  <select name="modeloId" className="p-2 border rounded-md text-center" value={formData.modeloId} onChange={handleChange}>
                    <option value="">MODELO</option>
                    {modelos.map((modelo) => (
                      <option key={modelo.id} value={modelo.id}>{modelo.nombre}</option>
                    ))}
                  </select>
                  <FaPlusCircle
                    className="ml-2 text-blue-500 cursor-pointer"
                    size={20}
                    onClick={() => setModeloModalOpen(true)}
                  />
                </div>
                <input type="text" name="vim" placeholder="VIM" className="p-2 border rounded-md text-center" value={formData.vim} onChange={handleChange} />
                <input type="text" name="fecha" placeholder="AÑO" className="p-2 border rounded-md text-center" value={formData.fecha} onChange={handleChange} />
                <input type="text" name="capacidad" placeholder="CAPACIDAD" className="p-2 border rounded-md text-center" value={formData.capacidad} onChange={handleChange} />
                <select name="combustible" className="p-2 border rounded-md text-center" value={formData.combustible} onChange={handleChange}>
                  <option value="">COMBUSTIBLE</option>
                  <option value="Gasolina">Gasolina</option>
                  <option value="Diesel">Diesel</option>
                </select>
                <select name="transmision" className="p-2 border rounded-md text-center" value={formData.transmision} onChange={handleChange}>
                  <option value="">TRANSMISIÓN</option>
                  <option value="Automática">Automática</option>
                  <option value="Manual">Manual</option>
                </select>
              </div>
              <button type="submit" className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition">+Agregar</button>
            </form>

            <div className="mt-6">
              <h4 className="text-lg font-semibold mb-2">LISTA DE UNIDADES</h4>
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-800 text-white">
                    {["ID", "Marca", "Modelo", "Transmisión", "VIM", "Año", "Status"].map((header, index) => (
                      <th key={index} className="p-2 text-center">{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {unidades.length > 0 ? (
                    unidades.map((unidad) => {
                      const statusName = getStatusName(unidad.status?.id || 0);
                      return (
                        <tr key={unidad.id} className="border-t hover:bg-gray-100">
                          <td className="p-2 text-center text-blue-600 underline">
                            <Link href={`/unidades/${unidad.id}`}>
                              {unidad.idUnidad}
                            </Link>
                          </td>
                          <td className="p-2 text-center">{unidad.marca?.nombre}</td>
                          <td className="p-2 text-center">{unidad.modelo?.nombre}</td>
                          <td className="p-2 text-center">{unidad.transmision}</td>
                          <td className="p-2 text-center">{unidad.vim}</td>
                          <td className="p-2 text-center">{unidad.fecha}</td>
                          <td className="p-2 text-center">
                            <button
                              className={`px-4 py-2 text-white rounded-md ${getStatusColor(statusName)}`}
                              onClick={() => {
                                if (unidad.status?.id !== 4) {
                                  setSelectedUnit(unidad);
                                  setStatusModalOpen(true);
                                }
                              }}
                            >
                              {statusName}
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={7} className="p-2 text-center">No hay unidades registradas.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {statusModalOpen && selectedUnit && (
              <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
                <div className="bg-white p-6 rounded-lg w-96">
                  <h3 className="text-xl font-semibold mb-4">Cambiar Estado de la Unidad</h3>
                  <p><strong>Unidad:</strong> {selectedUnit.idUnidad}</p>
                  <p><strong>Modelo:</strong> {selectedUnit.modelo?.nombre}</p>
                  <div className="mt-4">
                    <button
                      className="px-4 py-2 bg-green-500 text-white rounded-md mr-2"
                      onClick={() => handleStatusChange("operativo")}
                    >
                      Operativo
                    </button>
                    <button
                      className="px-4 py-2 bg-blue-500 text-white rounded-md mr-2"
                      onClick={() => handleStatusChange("inoperativo")}
                    >
                      Inoperativo
                    </button>
                    <button
                      className="px-4 py-2 bg-red-500 text-white rounded-md"
                      onClick={() => handleStatusChange("crítico")}
                    >
                      Crítico
                    </button>
                  </div>
                  <button
                    className="mt-4 px-4 py-2 bg-gray-300 text-black rounded-md"
                    onClick={() => setStatusModalOpen(false)}
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            )}

            {marcaModalOpen && (
              <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
                <div className="bg-white p-6 rounded-lg w-96">
                  <h3 className="text-xl font-semibold mb-4">Agregar Nueva Marca</h3>
                  <input
                    type="text"
                    className="p-2 border rounded-md w-full mb-4"
                    placeholder="Nombre de la marca"
                    value={newMarca}
                    onChange={(e) => setNewMarca(e.target.value)}
                  />
                  <div className="flex justify-end space-x-2">
                    <button
                      className="px-4 py-2 bg-gray-300 text-black rounded-md"
                      onClick={() => {
                        setNewMarca("");
                        setMarcaModalOpen(false);
                      }}
                    >
                      Cancelar
                    </button>
                    <button
                      className="px-4 py-2 bg-blue-500 text-white rounded-md"
                      onClick={handleAddMarca}
                    >
                      Agregar
                    </button>
                  </div>
                </div>
              </div>
            )}

            {modeloModalOpen && (
              <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
                <div className="bg-white p-6 rounded-lg w-96">
                  <h3 className="text-xl font-semibold mb-4">Agregar Nuevo Modelo</h3>
                  <input
                    type="text"
                    className="p-2 border rounded-md w-full mb-4"
                    placeholder="Nombre del modelo"
                    value={newModelo}
                    onChange={(e) => setNewModelo(e.target.value)}
                  />
                  <div className="flex justify-end space-x-2">
                    <button
                      className="px-4 py-2 bg-gray-300 text-black rounded-md"
                      onClick={() => {
                        setNewModelo("");
                        setModeloModalOpen(false);
                      }}
                    >
                      Cancelar
                    </button>
                    <button
                      className="px-4 py-2 bg-blue-500 text-white rounded-md"
                      onClick={handleAddModelo}
                    >
                      Agregar
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}

export default Unidades;