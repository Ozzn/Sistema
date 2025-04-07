"use client";

import React, { useState, useEffect, FormEvent } from "react"; 
import Navbar from "../components/Navbar"; 

interface Status {
  id: number;
  name: string;
}

interface Proveedor {
  id: number;
  rif: string;
  empresa: string;
  nombre: string;
  apellido: string;
  telefono: string;
  email: string;
  statusId: number;
}

const statuses: Status[] = [
  { id: 1, name: "Activo" },
  { id: 2, name: "Inactivo" },
];

const Proveedor: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [rif, setRif] = useState("");
  const [empresa, setEmpresa] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProveedor, setSelectedProveedor] = useState<Proveedor | null>(null);

  useEffect(() => {
    fetchProveedores();
  }, []);

  const fetchProveedores = async () => {
    try {
      const response = await fetch("/api/auth/proveedores");
      const data = await response.json();
      setProveedores(data);
    } catch (error) {
      console.error("Error al obtener proveedores:", error);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const nuevoProveedor = { 
      rif, 
      empresa, 
      nombre, 
      apellido, 
      telefono, 
      email, 
      statusId: 1
    };

    try {
      const response = await fetch("/api/auth/proveedores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevoProveedor),
      });

      if (response.ok) {
        fetchProveedores();
        alert("Proveedor agregado exitosamente");
        setRif("");
        setEmpresa("");
        setNombre("");
        setApellido("");
        setTelefono("");
        setEmail("");
      } else {
        alert("Error al agregar proveedor");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const deleteProveedor = async (id: number) => {
    if (confirm("¿Estás seguro de eliminar este proveedor?")) {
      try {
        const response = await fetch(`/api/auth/proveedores?id=${id}`, {
          method: "DELETE",
        });
  
        if (response.ok) {
          fetchProveedores();
          alert("Proveedor eliminado exitosamente");
        } else {
          const errorData = await response.json();
          alert(`Error: ${errorData.error}`);
        }
      } catch (error) {
        console.error("Error:", error);
        alert("Error al conectar con el servidor");
      }
    }
  };

  const toggleStatus = async () => {
    if (!selectedProveedor) return;
  
    const updatedStatus = selectedProveedor.statusId === 1 ? 2 : 1;
  
    try {
      const response = await fetch(`/api/auth/proveedores?id=${selectedProveedor.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ statusId: updatedStatus }),
      });
  
      if (response.ok) {
        fetchProveedores();
        alert("Estado de proveedor actualizado");
        setModalOpen(false);
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error al conectar con el servidor");
    }
  };

  return (
    <div className="flex">
      <Navbar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <div className={`flex-1 bg-gray-100 min-h-screen p-6 transition-all duration-300 ${menuOpen ? "ml-64" : "ml-0 md:ml-64"}`}>
        <h4 className="text-lg font-semibold mb-4">Agregar Proveedor</h4>

        <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-4">
            <input type="text" className="p-2 border rounded text-sm w-40" placeholder="RIF" value={rif} onChange={(e) => setRif(e.target.value)} />
            <input type="text" className="p-2 border rounded text-sm w-40" placeholder="Empresa" value={empresa} onChange={(e) => setEmpresa(e.target.value)} />
            <input type="text" className="p-2 border rounded text-sm w-40" placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} />
            <input type="text" className="p-2 border rounded text-sm w-40" placeholder="Apellido" value={apellido} onChange={(e) => setApellido(e.target.value)} />
          </div>
          <div className="flex items-center gap-2">
            <input type="text" className="p-2 border rounded text-sm w-32" placeholder="Teléfono" value={telefono} onChange={(e) => setTelefono(e.target.value)} />
            <input type="email" className="p-2 border rounded text-sm w-32" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <button type="submit" className="bg-blue-500 text-white px-3 py-1 rounded text-xs w-24 hover:bg-blue-600">+ Agregar</button>
          </div>
        </form>

        <div className="mt-6">
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm">Mostrar:
              <select className="ml-2 p-1 border rounded text-sm">
                <option>10</option>
                <option>25</option>
                <option>50</option>
              </select>
            </label>
            <input type="text" placeholder="Buscar..." className="p-1 border rounded text-sm w-40" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
          </div>

          <table className="w-full border-collapse border border-gray-300 text-sm">
            <thead className="bg-gray-800 text-white">
              <tr>
                {["COD", "RIF", "EMPRESA", "NOMBRE, APELLIDO", "TELÉFONO", "EMAIL", "STATUS", "ACCIONES"].map((header, index) => (
                  <th key={index} className="border p-2">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {proveedores.filter(p => p.empresa.toLowerCase().includes(busqueda.toLowerCase())).map((prov, index) => (
                <tr key={prov.id} className="text-center">
                  <td className="border p-2">{index + 1}</td>
                  <td className="border p-2">{prov.rif}</td>
                  <td className="border p-2">{prov.empresa}</td>
                  <td className="border p-2">{`${prov.nombre} ${prov.apellido}`}</td>
                  <td className="border p-2">{prov.telefono}</td>
                  <td className="border p-2">{prov.email}</td>
                  <td className="border p-2">
                    <span
                      className={`px-2 py-1 rounded text-xs cursor-pointer ${prov.statusId === 1 ? "bg-green-500 text-white" : "bg-gray-500 text-white"}`}
                      onClick={() => {
                        setSelectedProveedor(prov);
                        setModalOpen(true);
                      }}
                    >
                      {statuses.find(status => status.id === prov.statusId)?.name}
                    </span>
                  </td>
                  <td className="border p-2">
                    <button 
                      onClick={() => deleteProveedor(prov.id)} 
                      className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
                    >
                      🗑
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-between items-center mt-4 text-sm">
            <p>Total de {proveedores.length} Registros</p>
          </div>
        </div>
      </div>

      {modalOpen && selectedProveedor && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h4 className="text-lg font-semibold mb-4">Cambiar estado de proveedor</h4>
            <p>¿Estás seguro de que deseas cambiar el estado de {selectedProveedor.empresa}?</p>
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setModalOpen(false)} className="bg-gray-500 text-white px-4 py-2 rounded">Cancelar</button>
              <button onClick={toggleStatus} className="bg-blue-500 text-white px-4 py-2 rounded">Confirmar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Proveedor;