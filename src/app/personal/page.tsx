"use client"; // Directiva necesaria para componentes que usan hooks en Next.js 13+ con app router

import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import AuthGuard from "../components/AuthGuard";

// Interfaces para tipar los datos esperados
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

// Componente principal
const PersonalPage = () => {
  const [menuOpen, setMenuOpen] = useState(false); // Controla si el menú está abierto
  const [personalList, setPersonalList] = useState<Personal[]>([]); // Lista de personal
  const [cargoList, setCargoList] = useState<Cargo[]>([]); // Lista de cargos

  // Lista fija de estados
  const [statusList] = useState<Status[]>([
    { id: 1, name: "Activo", color: "bg-green-500" },
    { id: 2, name: "Inactivo", color: "bg-red-500" },
    { id: 5, name: "Vacaciones", color: "bg-yellow-500" },
    { id: 6, name: "Reposo", color: "bg-blue-500" },
  ]);

  // Estado para el formulario
  const [formData, setFormData] = useState({
    cedula: "",
    nombre: "",
    telefono: "",
    cargoId: "",
    tag: "0",
  });

  const [modalOpen, setModalOpen] = useState(false); // Controla si el modal está abierto
  const [selectedPersonal, setSelectedPersonal] = useState<Personal | null>(null); // Persona seleccionada para cambiar estado
  const [newStatus, setNewStatus] = useState<number>(1); // Nuevo estado seleccionado

  // Cargar datos al montar el componente
  useEffect(() => {
    loadCargos();
    loadPersonal();
  }, []);

  // Carga los cargos desde el backend
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

  // Carga el personal desde el backend
  const loadPersonal = async () => {
    try {
      const res = await fetch("/api/auth/personal?action=list");
      const data = await res.json();

      if (res.ok && data.success) {
        // Asigna el estado a cada persona usando `statusId`
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

  // Maneja el cambio en inputs y selects del formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Maneja el envío del formulario de nuevo personal
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validación simple
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
        // Añadir nuevo personal a la lista
        const newPerson = {
          ...data.data,
          status: { id: 1, name: "Activo", color: "bg-green-500" }
        };
        setPersonalList((prev) => [...prev, newPerson]);

        // Limpiar formulario
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

  // Cambia el estado de un personal
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
          // Actualiza el estado en la lista local
          setPersonalList((prev) =>
            prev.map((personal) =>
              personal.id === selectedPersonal.id
                ? { ...personal, status: updatedStatus }
                : personal
            )
          );
          alert("Estado actualizado correctamente");
          setModalOpen(false); // Cierra el modal
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
    <AuthGuard>
      <div className="flex">
        {/* Menú lateral */}
        <Navbar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

        {/* Contenido principal */}
        <div className={`flex-1 bg-gray-100 min-h-screen transition-all duration-300 ${menuOpen ? "ml-64" : "ml-0 md:ml-64"}`}>
          <div className="container mx-auto p-6">
            <h4 className="text-lg font-semibold mb-4">Gestión de Personal</h4>

            {/* Formulario para agregar personal */}
            <div className="bg-white p-4 rounded-lg shadow-md mb-6">
              <h3 className="text-lg font-medium mb-4">Agregar nuevo personal</h3>
              <form onSubmit={handleSubmit} className="flex flex-wrap gap-4">
                {/* Cédula */}
                <input
                  type="text"
                  name="cedula"
                  placeholder="Cédula"
                  className="p-2 border rounded w-full md:w-1/4 min-w-[180px]"
                  value={formData.cedula}
                  onChange={handleChange}
                  required
                />
                {/* Nombre */}
                <input
                  type="text"
                  name="nombre"
                  placeholder="Nombre y apellido"
                  className="p-2 border rounded w-full md:w-1/4 min-w-[180px]"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                />
                {/* Teléfono */}
                <input
                  type="text"
                  name="telefono"
                  placeholder="Teléfono"
                  className="p-2 border rounded w-full md:w-1/4 min-w-[180px]"
                  value={formData.telefono}
                  onChange={handleChange}
                  required
                />
                {/* Cargo */}
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
                {/* Tag */}
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

                {/* Botón de enviar */}
                <button
                  type="submit"
                  className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Agregar
                </button>
              </form>
            </div>

            {/* Tabla con lista del personal */}
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-medium mb-4">Lista de Personal</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full table-auto">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3">Cédula</th>
                      <th className="px-6 py-3">Nombre</th>
                      <th className="px-6 py-3">Cargo</th>
                      <th className="px-6 py-3">Teléfono</th>
                      <th className="px-6 py-3">Status</th>
                      <th className="px-6 py-3">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {personalList.length > 0 ? (
                      personalList.map((personal) => (
                        <tr key={personal.id}>
                          <td className="px-6 py-4">{personal.cedula}</td>
                          <td className="px-6 py-4">{personal.nombre}</td>
                          <td className="px-6 py-4">{personal.cargo.name}</td>
                          <td className="px-6 py-4">{personal.telefono}</td>
                          <td className="px-6 py-4">
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
                          <td className="px-6 py-4">
                            <button className="bg-yellow-500 text-white px-3 py-1 rounded text-sm" disabled>
                              Editar
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="text-center text-sm text-gray-500">
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

        {/* Modal para cambiar estado */}
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
                  <option key={status.id} value={status.id} className={status.color}>
                    {status.name}
                  </option>
                ))}
              </select>

              <div className="flex justify-end">
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  onClick={handleStatusChange}
                >
                  Confirmar
                </button>
                <button
                  className="bg-gray-500 text-white px-4 py-2 rounded ml-2"
                  onClick={() => setModalOpen(false)}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AuthGuard>
  );
};

export default PersonalPage;
