"use client";
import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { FileDown, FileText, Trash2 } from "lucide-react";

const ArticuloPage: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("nuevo");

  const [nombreArticulo, setNombreArticulo] = useState("");
  const [estado, setEstado] = useState("");
  const [unidad, setUnidad] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [proveedorId, setProveedorId] = useState("");
  const [ubicacion, setUbicacion] = useState("");

  const [articulos, setArticulos] = useState<any[]>([]);
  const [proveedores, setProveedores] = useState<any[]>([]);

  const [selectedArticuloId, setSelectedArticuloId] = useState<string>("");
  const [selectedArticulo, setSelectedArticulo] = useState<any | null>(null);
  const [cantidadAgregar, setCantidadAgregar] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resArticulos = await fetch("/api/auth/articulos");
        const dataArticulos = await resArticulos.json();
        setArticulos(dataArticulos.articulos || []);

        const resProveedores = await fetch("/api/auth/proveedores");
        const dataProveedores = await resProveedores.json();
        setProveedores(dataProveedores || []);
      } catch (error) {
        console.error("Error al cargar datos:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const articulo = articulos.find((a) => String(a.id) === selectedArticuloId);
    setSelectedArticulo(articulo || null);
  }, [selectedArticuloId, articulos]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newArticulo = {
      nombre: nombreArticulo,
      estado,
      unidad,
      cantidad: parseInt(cantidad),
      ubicacion,
      proveedorId,
    };

    const response = await fetch("/api/auth/articulos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newArticulo),
    });

    const result = await response.json();

    if (response.ok) {
      setArticulos((prev) => [...prev, result.nuevoArticulo]);
      alert("Artículo agregado");

      // Reset fields
      setNombreArticulo("");
      setEstado("");
      setUnidad("");
      setCantidad("");
      setProveedorId("");
      setUbicacion("");
    } else {
      alert(result.error || "Error al agregar artículo");
    }
  };

  const exportToExcel = () => {
    if (!articulos.length) return alert("No hay datos para exportar");

    const datos = articulos.map((a) => ({
      ID: a.id,
      Artículo: a.nombre,
      Estado: a.estado,
      Unidad: a.unidad,
      Cantidad: a.cantidad,
      Proveedor: a.proveedor?.empresa || "",
      Ubicación: a.ubicacion,
    }));

    const worksheet = XLSX.utils.json_to_sheet(datos);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Artículos");
    XLSX.writeFile(workbook, "articulos.xlsx");
  };

  const exportToPDF = () => {
    if (!articulos.length) return alert("No hay datos para exportar");

    const doc = new jsPDF();
    const headers = [
      ["ID", "Artículo", "Estado", "Unidad", "Cantidad", "Proveedor", "Ubicación"],
    ];
    const rows = articulos.map((a) => [
      a.id,
      a.nombre,
      a.estado,
      a.unidad,
      a.cantidad,
      a.proveedor?.empresa || "",
      a.ubicacion,
    ]);

    autoTable(doc, {
      head: headers,
      body: rows,
    });

    doc.save("articulos.pdf");
  };

  const handleActualizarCantidad = async () => {
    if (!selectedArticuloId || !selectedArticulo) {
      alert("Por favor, selecciona un artículo válido.");
      return;
    }

    if (cantidadAgregar <= 0) {
      alert("Por favor ingresa una cantidad válida.");
      return;
    }

    try {
      const response = await fetch(`/api/auth/articulos?id=${selectedArticuloId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cantidad: cantidadAgregar,
        }),
      });

      if (response.ok) {
        const updatedArticulo = await response.json();

        setArticulos((prev) =>
          prev.map((a) => (a.id === updatedArticulo.id ? updatedArticulo : a))
        );

        setSelectedArticulo(updatedArticulo);
        alert("Cantidad actualizada");
        setCantidadAgregar(0);
      } else {
        const errorData = await response.json();
        alert(errorData.error || "Error al actualizar cantidad");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error al conectar con el servidor");
    }
  };

  const handleEliminarArticulo = async (id: string) => {
    const confirm = window.confirm("¿Estás seguro que deseas eliminar este artículo?");
    if (!confirm) return;

    try {
      const response = await fetch(`/api/auth/articulos?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setArticulos((prev) => prev.filter((a) => a.id !== id));
        alert("Artículo eliminado correctamente");
      } else {
        const errorData = await response.json();
        alert(errorData.error || "Error al eliminar artículo");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error al conectar con el servidor");
    }
  };

  return (
    <div className="flex">
      <Navbar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <div
        className={`flex-1 bg-gray-100 min-h-screen p-6 transition-all duration-300 ${
          menuOpen ? "ml-64" : "ml-0 md:ml-64"
        }`}
      >
        <div className="flex border-b">
          <button
            className={`px-4 py-2 text-sm font-semibold ${
              activeTab === "nuevo" ? "bg-blue-600 text-white" : "bg-white text-black border"
            }`}
            onClick={() => setActiveTab("nuevo")}
          >
            NUEVO ARTICULO
          </button>
          <button
            className={`px-4 py-2 text-sm font-semibold ${
              activeTab === "existente" ? "bg-blue-600 text-white" : "bg-white text-black border"
            }`}
            onClick={() => setActiveTab("existente")}
          >
            ARTICULO EXISTENTE
          </button>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md mt-4">
          {activeTab === "nuevo" ? (
            <>
              <h4 className="text-lg font-semibold mb-4">Agregar Artículo</h4>
              <form
                onSubmit={handleSubmit}
                className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-4"
              >
                <input
                  type="text"
                  className="p-2 border rounded text-sm w-56"
                  placeholder="Nombre Artículo"
                  value={nombreArticulo}
                  onChange={(e) => setNombreArticulo(e.target.value)}
                  required
                />
                <select
                  className="p-2 border rounded text-sm w-56"
                  value={estado}
                  onChange={(e) => setEstado(e.target.value)}
                  required
                >
                  <option value="">Estado</option>
                  <option value="ACTIVOS">ACTIVOS</option>
                  <option value="CONSUMIBLES">CONSUMIBLES</option>
                  <option value="DESCONTINUADO">DESCONTINUADO</option>
                </select>
                <select
                  className="p-2 border rounded text-sm w-56"
                  value={unidad}
                  onChange={(e) => setUnidad(e.target.value)}
                  required
                >
                  <option value="">Unidad</option>
                  <option value="Litro">Litro</option>
                  <option value="Kilo">Kilo</option>
                  <option value="Metro">Metro</option>
                </select>
                <input
                  type="number"
                  className="p-2 border rounded text-sm w-56"
                  placeholder="Cantidad"
                  value={cantidad}
                  onChange={(e) => setCantidad(e.target.value)}
                  required
                />
                <select
                  className="p-2 border rounded text-sm w-56"
                  value={proveedorId}
                  onChange={(e) => setProveedorId(e.target.value)}
                  required
                >
                  <option value="">Seleccionar Proveedor</option>
                  {proveedores.map((proveedor) => (
                    <option key={proveedor.id} value={proveedor.id}>
                      {proveedor.empresa}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  className="p-2 border rounded text-sm w-56"
                  placeholder="Ubicación"
                  value={ubicacion}
                  onChange={(e) => setUbicacion(e.target.value)}
                  required
                />
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-3 py-1 rounded text-xs w-24 hover:bg-blue-600"
                >
                  + Agregar
                </button>
              </form>
            </>
          ) : (
            <>
              <h4 className="text-lg font-semibold mb-4">Artículo Existente</h4>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-4">
                <select
                  className="p-2 border rounded text-sm w-56"
                  onChange={(e) => setSelectedArticuloId(e.target.value)}
                  value={selectedArticuloId}
                >
                  <option value="">Seleccionar Artículo</option>
                  {articulos.map((articulo) => (
                    <option key={articulo.id} value={String(articulo.id)}>
                      {articulo.nombre}
                    </option>
                  ))}
                </select>

                <input
                  type="number"
                  className="p-2 border rounded text-sm w-56 bg-gray-100"
                  placeholder="Cantidad actual"
                  value={selectedArticulo?.cantidad || ""}
                  readOnly
                />

                <input
                  type="number"
                  className="p-2 border rounded text-sm w-56"
                  placeholder="Cantidad a agregar"
                  value={cantidadAgregar || ""}
                  onChange={(e) => setCantidadAgregar(parseInt(e.target.value))}
                  min="0"
                />

                <button
                  className="bg-blue-500 text-white px-3 py-1 rounded text-xs w-24 hover:bg-blue-600 disabled:bg-gray-400"
                  onClick={handleActualizarCantidad}
                  disabled={!selectedArticulo || cantidadAgregar <= 0}
                >
                  Actualizar
                </button>

                <input
                  type="text"
                  className="p-2 border rounded text-sm w-56 bg-gray-100"
                  placeholder="Proveedor"
                  value={
                    selectedArticulo
                      ? proveedores.find((p) => p.id === selectedArticulo.proveedorId)?.empresa || ""
                      : ""
                  }
                  readOnly
                />

                <input
                  type="text"
                  className="p-2 border rounded text-sm w-56 bg-gray-100"
                  placeholder="Ubicación"
                  value={selectedArticulo?.ubicacion || ""}
                  readOnly
                />
              </div>
            </>
          )}
        </div>

        <div className="flex mt-4 gap-4">
          <button
            onClick={exportToExcel}
            className="bg-green-500 text-white px-4 py-2 rounded flex items-center gap-2"
          >
            <FileDown className="w-4 h-4" /> Exportar a Excel
          </button>
          <button
            onClick={exportToPDF}
            className="bg-red-500 text-white px-4 py-2 rounded flex items-center gap-2"
          >
            <FileText className="w-4 h-4" /> Exportar a PDF
          </button>
        </div>

        {/* 📊 Tabla de artículos */}
        <table className="w-full border-collapse border border-gray-300 text-sm mt-6">
  <thead className="bg-gray-800 text-white">
    <tr>
      {["COD", "ARTICULO", "PROVEEDOR", "UBICACION", "STOCK", "ACCION"].map((header, index) => (
        <th key={index} className="border p-2">{header}</th>
      ))}
    </tr>
  </thead>
  <tbody>
    {articulos.map((a) => (
      <tr key={a.id} className="text-center">
        <td className="border p-2">{a.id}</td>
        <td className="border p-2">{a.nombre}</td>
        <td className="border p-2">{a.proveedor?.empresa || ""}</td>
        <td className="border p-2">{a.ubicacion}</td>
        <td className="border p-2">{a.cantidad}</td>
        <td className="border p-2">
          <button
            className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 flex items-center gap-1 text-xs"
            onClick={() => handleEliminarArticulo(a.id)}
          >
            <Trash2 className="w-4 h-4" />
            Eliminar
          </button>
        </td>
      </tr>
    ))}
  </tbody>
</table>

      </div>
    </div>
  );
};

export default ArticuloPage;
