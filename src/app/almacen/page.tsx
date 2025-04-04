"use client";
import React, { useState } from "react";
import Navbar from "../components/Navbar";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { FileDown, FileText } from "lucide-react";
    

const ArticuloPage: React.FC = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("nuevo");

    // Estado para Nuevo Artículo
    const [nombreArticulo, setNombreArticulo] = useState("");
    const [estado, setEstado] = useState("");
    const [unidad, setUnidad] = useState("");
    const [cantidad, setCantidad] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert("Artículo agregado");
        setNombreArticulo("");
        setEstado("");
        setUnidad("");
        setCantidad("");
    };

    const [articulos, setArticulos] = useState([
        {
          idUnidad: 123,
          nombre: "Artículo 1",
          modelo: "Modelo 1",
          proveedor: "Proveedor 1",
          ubicacion: "Ubicación 1",
          stock: 100,
          estado: "ACTIVOS"
        }
      ]);
      
      const exportToExcel = () => {
        if (!articulos.length) return alert("No hay datos para exportar");
      
        const datos = articulos.map(a => ({
          ID: a.idUnidad,
          Artículo: a.nombre,
          Modelo: a.modelo,
          Proveedor: a.proveedor,
          Ubicación: a.ubicacion,
          Stock: a.stock,
          Estado: a.estado
        }));
      
        const worksheet = XLSX.utils.json_to_sheet(datos);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Artículos");
        XLSX.writeFile(workbook, "articulos.xlsx");
      };
      
      const exportToPDF = () => {
        if (!articulos.length) return alert("No hay datos para exportar");
      
        const doc = new jsPDF();
        const headers = [["ID", "Artículo", "Modelo", "Proveedor", "Ubicación", "Stock", "Estado"]];
        const rows = articulos.map(a => [
          a.idUnidad,
          a.nombre,
          a.modelo,
          a.proveedor,
          a.ubicacion,
          a.stock,
          a.estado
        ]);
      
        autoTable(doc, {
          head: headers,
          body: rows,
        });
      
        doc.save("articulos.pdf");
      };
      
      

    return (
        <div className="flex">
            <Navbar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
            <div className={`flex-1 bg-gray-100 min-h-screen p-6 transition-all duration-300 ${menuOpen ? "ml-64" : "ml-0 md:ml-64"}`}>

                {/* Tabs de selección */}
                <div className="flex border-b">
                    <button 
                        className={`px-4 py-2 text-sm font-semibold ${activeTab === "nuevo" ? "bg-blue-600 text-white" : "bg-white text-black border"}`} 
                        onClick={() => setActiveTab("nuevo")}
                    >
                        NUEVO ARTICULO
                    </button>
                    <button 
                        className={`px-4 py-2 text-sm font-semibold ${activeTab === "existente" ? "bg-blue-600 text-white" : "bg-white text-black border"}`} 
                        onClick={() => setActiveTab("existente")}
                    >
                        ARTICULO EXISTENTE
                    </button>
                </div>

                {/* Contenido según la pestaña seleccionada */}
                <div className="bg-white p-4 rounded-lg shadow-md mt-4">
                    {activeTab === "nuevo" ? (
                        <>
                            <h4 className="text-lg font-semibold mb-4">Agregar Artículo</h4>
                            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-4">
                                <input type="text" className="p-2 border rounded text-sm w-56" placeholder="Nombre Artículo" value={nombreArticulo} onChange={(e) => setNombreArticulo(e.target.value)} />
                                <select className="p-2 border rounded text-sm w-56" value={estado} onChange={(e) => setEstado(e.target.value)}>
                                    <option value="">Estado</option>
                                    <option value="ACTIVOS">ACTIVOS</option>
                                    <option value="CONSUMIBLES">CONSUMIBLES</option>
                                    <option value="DESCONTINUADO">DESCONTINUADO</option>
                                </select>
                                <select className="p-2 border rounded text-sm w-56" value={unidad} onChange={(e) => setUnidad(e.target.value)}>
                                    <option value="">Unidad</option>
                                    <option value="Litro">Litro</option>
                                    <option value="Kilo">Kilo</option>
                                    <option value="Metro">Metro</option>
                                </select>
                                <input type="number" className="p-2 border rounded text-sm w-56" placeholder="Cantidad" value={cantidad} onChange={(e) => setCantidad(e.target.value)} />
                                <button type="submit" className="bg-blue-500 text-white px-3 py-1 rounded text-xs w-24 hover:bg-blue-600">
                                    + Agregar
                                </button>
                            </form>
                        </>
                    ) : (
                        <>
                            <h4 className="text-lg font-semibold mb-4">Artículo Existente</h4>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                                <select className="p-2 border rounded text-sm w-56">
                                    <option>Nothing selected</option>
                                    <option>Artículo 1</option>
                                    <option>Artículo 2</option>
                                </select>
                                <input type="text" className="p-2 border rounded text-sm w-56 bg-gray-200" placeholder="ACTUAL" disabled />
                                <input type="text" className="p-2 border rounded text-sm w-56 bg-gray-200" placeholder="CANTIE" disabled />
                                <input type="text" className="p-2 border rounded text-sm w-56 bg-gray-200" placeholder="PROVEEDOR" disabled />
                                <input type="text" className="p-2 border rounded text-sm w-56 bg-gray-200" placeholder="UBICACION" disabled />
                                <button className="bg-blue-500 text-white px-3 py-1 rounded text-xs w-24 hover:bg-blue-600">
                                    + Agregar
                                </button>
                            </div>
                        </>
                    )}
                </div>

                {/* TABLA DE ARTÍCULOS */}
                <div className="mt-6 bg-white p-4 rounded-lg shadow-md">
                    <div className="flex justify-between items-center mb-2">
                        <label className="text-sm">Mostrar:
                            <select className="ml-2 p-1 border rounded text-sm">
                                <option>10</option>
                                <option>25</option>
                                <option>50</option>
                            </select>
                        </label>
                        <input type="text" placeholder="Buscar..." className="p-1 border rounded text-sm w-40" />
                    </div>

                    <table className="w-full border-collapse border border-gray-300 text-sm">
                    <div className="flex justify-end gap-2 mb-4">
  <button
    onClick={exportToExcel}
    className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs"
  >
    <FileText className="w-4 h-4" /> Excel
  </button>
  <button
    onClick={exportToPDF}
    className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs"
  >
    <FileDown className="w-4 h-4" /> PDF
  </button>
</div>

                        <thead className="bg-gray-800 text-white">
                            <tr>
                                {["COD", "ARTICULO", "MODELO", "PROVEEDOR", "UBICACION", "STOCK", "ACCION"].map((header, index) => (
                                    <th key={index} className="border p-2">{header}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="text-center">
                                <td className="border p-2">123</td>
                                <td className="border p-2">Artículo 1</td>
                                <td className="border p-2">Modelo 1</td>
                                <td className="border p-2">Proveedor 1</td>
                                <td className="border p-2">Ubicación 1</td>
                                <td className="border p-2">100</td>
                                <td className="border p-2">
                                    <button className="bg-blue-500 text-white px-2 py-1 rounded text-xs mr-2">✏️</button>
                                    <button className="bg-red-500 text-white px-2 py-1 rounded text-xs">🗑</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    );
};

export default ArticuloPage;
