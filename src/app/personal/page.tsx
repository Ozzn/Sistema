"use client";

import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";

interface Cargo {
  id: number;
  name: string;
}

interface Status {
  id: number;
  name: string;
  color: string;
}

interface Personal {
  id: number;
  cedula: string;
  nombre: string;
  telefono: string;
  cargoId: number;
  cargo: Cargo;
  tag: string;
  statusId: number;
  status: Status;
}

const PersonalPage = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [personalList, setPersonalList] = useState<Personal[]>([]);
  const [cargoList, setCargoList] = useState<Cargo[]>([]);
  const [statusList] = useState<Status[]>([
    { id: 1, name: "Activo", color: "bg-green-500" },
    { id: 2, name: "Inactivo", color: "bg-red-500" },
    
    { id: 5, name: "Vacaciones", color: "bg-yellow-500" },
    { id: 6, name: "Reposo", color: "bg-blue-500" },
  ]);
  const [formData, setFormData] = useState({
    cedula: "",
    nombre: "",
    telefono: "",
    cargoId: "",
    tag: "0",
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPersonal, setSelectedPersonal] = useState<Personal | null>(null);
  const [newStatus, setNewStatus] = useState<number>(1);

  useEffect(() => {
    loadCargos();
    loadPersonal();
  }, []);

  const loadCargos = async () => {
    try {
      const res = await fetch("/api/auth/personal");
      const data = await res.json();

      if (res.ok && data.success) {
        setCargoList(data.data.cargos);
      } else {
        console.error("Error al cargar cargos:", data.message);
      }
    } catch (error) {
      console.error("Error en la petición de cargos:", error);
    }
  };

  const loadPersonal = async () => {
    try {
      const res = await fetch("/api/auth/personal?action=list");
      const data = await res.json();

      if (res.ok && data.success) {
        const personalWithStatus = data.data.map((person: any) => ({
          ...person,
          status: statusList.find(s => s.id === person.statusId) || 
                 { id: 1, name: "Activo", color: "bg-green-500" }
        }));
        setPersonalList(personalWithStatus);
      } else {
        console.error("Error al cargar personal:", data.message);
      }
    } catch (error) {
      console.error("Error en la petición de personal:", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.cedula || !formData.nombre || !formData.telefono || !formData.cargoId) {
      alert("Complete todos los campos");
      return;
    }

    try {
      const res = await fetch("/api/auth/personal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          cargoId: Number(formData.cargoId),
        }),
      });

      const data = await res.json();

      if (res.ok) {
        const newPerson = {
          ...data.data,
          status: { id: 1, name: "Activo", color: "bg-green-500" }
        };
        setPersonalList((prev) => [...prev, newPerson]);
        setFormData({ cedula: "", nombre: "", telefono: "", cargoId: "", tag: "0" });
        alert("Personal agregado correctamente");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error al agregar personal");
    }
  };

  const handleStatusChange = async () => {
    if (!selectedPersonal) return;

    const updatedStatus = statusList.find(s => s.id === newStatus);

    if (updatedStatus) {
      try {
        const res = await fetch("/api/auth/personal", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: selectedPersonal.id,
            statusId: updatedStatus.id, 
          }),
        });

        const data = await res.json();

        if (res.ok) {
          setPersonalList((prev) =>
            prev.map((personal) =>
              personal.id === selectedPersonal.id
                ? { 
                    ...personal, 
                    status: updatedStatus 
                  }
                : personal
            )
          );
          alert("Estado actualizado correctamente");
          setModalOpen(false);  // Cerrar el modal después de la actualización
        } else {
          alert(data.message);
        }
      } catch (error) {
        console.error("Error al actualizar estado:", error);
        alert("Error al actualizar estado");
      }
    } else {
      alert("Estado no encontrado");
    }
  };

  return (
    <div className="flex">
      <Navbar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      <div className={`flex-1 bg-gray-100 min-h-screen transition-all duration-300 ${menuOpen ? "ml-64" : "ml-0 md:ml-64"}`}>
        <div className="container mx-auto p-6">
          <h4 className="text-lg font-semibold mb-4">Gestión de Personal</h4>

          <div className="bg-white p-4 rounded-lg shadow-md mb-6">
            <h3 className="text-lg font-medium mb-4">Agregar nuevo personal</h3>
            <form onSubmit={handleSubmit} className="flex flex-wrap gap-4">
              <input
                type="text"
                name="cedula"
                placeholder="Cédula"
                className="p-2 border rounded w-full md:w-1/4 min-w-[180px]"
                value={formData.cedula}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="nombre"
                placeholder="Nombre y apellido"
                className="p-2 border rounded w-full md:w-1/4 min-w-[180px]"
                value={formData.nombre}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="telefono"
                placeholder="Teléfono"
                className="p-2 border rounded w-full md:w-1/4 min-w-[180px]"
                value={formData.telefono}
                onChange={handleChange}
                required
              />
              <select
                name="cargoId"
                className="p-2 border rounded w-full md:w-1/4 min-w-[180px]"
                onChange={handleChange}
                value={formData.cargoId}
                required
              >
                <option value="">Seleccione cargo</option>
                {cargoList.map((cargo) => (
                  <option key={cargo.id} value={cargo.id}>
                    {cargo.name}
                  </option>
                ))}
              </select>

              <select
                name="tag"
                className="p-2 border rounded w-full md:w-1/4 min-w-[180px]"
                onChange={handleChange}
                value={formData.tag}
              >
                <option value="0">Seleccione enlace</option>
                <option value="1">Informática</option>
                <option value="2">Almacén</option>
              </select>

              <button
                type="submit"
                className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Agregar
              </button>
            </form>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-medium mb-4">Lista de Personal</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cédula</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cargo</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teléfono</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acción</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {personalList.length > 0 ? (
                    personalList.map((personal) => (
                      <tr key={personal.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{personal.cedula}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{personal.nombre}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{personal.cargo.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{personal.telefono}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            className={`${personal.status.color} text-white px-3 py-1 rounded text-sm`}
                            onClick={() => {
                              setSelectedPersonal(personal);
                              setNewStatus(personal.statusId);
                              setModalOpen(true);
                            }}
                          >
                            {personal.status.name}
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <button className="bg-yellow-500 text-white px-3 py-1 rounded text-sm" disabled>
                            Editar
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                        No hay personal registrado
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {modalOpen && selectedPersonal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-semibold mb-4">Cambiar Estado</h3>
            <select
              className="w-full p-2 border rounded mb-4"
              value={newStatus}
              onChange={(e) => setNewStatus(Number(e.target.value))}
            >
              {statusList.map((status) => (
                <option key={status.id} value={status.id}>
                  {status.name}
                </option>
              ))}
            </select>
            <button
              onClick={handleStatusChange}
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
            >
              Cambiar Estado
            </button>
            <button
              onClick={() => setModalOpen(false)}
              className="mt-2 w-full bg-gray-300 text-black py-2 rounded hover:bg-gray-400"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonalPage;
