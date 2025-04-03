"use client";
import React, { useState, useEffect, FormEvent } from "react";
import { FaPlusCircle } from "react-icons/fa";
import Navbar from "../components/Navbar";

interface Departamento {
  id: number;
  nombre: string;
}

interface Cargo {
  id: number;
  nombre: string;
}

interface Personal {
  id: number;
  nick: string;
  nombres: string;
  apellidos: string;
  email: string;
  telefono: string;
  rol: string;
  statusId: number; // 1 = Activo, 2 = Inactivo
  departamentoId: number;
  cargoId: number;
}

const Personal: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [personal, setPersonal] = useState<Personal[]>([]);
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  const [cargos, setCargos] = useState<Cargo[]>([]);

  const [formData, setFormData] = useState({
    nick: "",
    nombres: "",
    apellidos: "",
    telefono: "",
    email: "",
    departamentoId: 0,
    cargoId: 0,
  });

  const [busqueda, setBusqueda] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"departamento" | "cargo" | "status" | "none">("none");
  const [newDepartamento, setNewDepartamento] = useState("");
  const [newCargo, setNewCargo] = useState("");
  const [selectedPerson, setSelectedPerson] = useState<Personal | null>(null);

  useEffect(() => {
    fetchPersonal();
    fetchDepartamentos();
    fetchCargos();
  }, []);

  const fetchPersonal = async () => {
    try {
      const response = await fetch("/api/auth/personal");
      const data = await response.json();
      if (Array.isArray(data)) {
        setPersonal(data);
      } else {
        console.error("La respuesta de personal no es un arreglo:", data);
      }
    } catch (error) {
      console.error("Error al obtener personal:", error);
    }
  };

  const fetchDepartamentos = async () => {
    try {
      const response = await fetch("/api/auth/departamentos");
      const data = await response.json();
      setDepartamentos(data);
    } catch (error) {
      console.error("Error al obtener departamentos:", error);
    }
  };

  const fetchCargos = async () => {
    try {
      const response = await fetch("/api/auth/cargos");
      const data = await response.json();
      setCargos(data);
    } catch (error) {
      console.error("Error al obtener cargos:", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "departamentoId" || name === "cargoId" ? Number(value) : value,
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (formData.departamentoId === 0 || formData.cargoId === 0) {
      alert("Debes seleccionar un departamento y un cargo.");
      return;
    }

    const nuevoPersonal = {
      ...formData,
      rol: "",
      statusId: 1,
    };

    try {
      const response = await fetch("/api/auth/personal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevoPersonal),
      });

      if (response.ok) {
        fetchPersonal();
        alert("Personal agregado exitosamente");
        setFormData({
          nick: "",
          nombres: "",
          apellidos: "",
          telefono: "",
          email: "",
          departamentoId: 0,
          cargoId: 0,
        });
      } else {
        alert("Error al agregar personal");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const openModal = (type: "departamento" | "cargo" | "status") => {
    setModalType(type);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalType("none");
    setNewDepartamento("");
    setNewCargo("");
  };

  const handleAddDepartamento = async () => {
    try {
      const response = await fetch("/api/auth/departamentos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre: newDepartamento }),
      });

      if (response.ok) {
        alert("Departamento agregado");
        fetchDepartamentos();
        closeModal();
      } else {
        alert("Error al agregar departamento");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleAddCargo = async () => {
    try {
      const response = await fetch("/api/auth/cargos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre: newCargo }),
      });

      if (response.ok) {
        alert("Cargo agregado");
        fetchCargos();
        closeModal();
      } else {
        alert("Error al agregar cargo");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleStatusChange = async (newStatusId: number) => {
    if (selectedPerson) {
      try {
        const response = await fetch("/api/auth/personal", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: selectedPerson.id, statusId: newStatusId }),
        });

        if (response.ok) {
          alert("Estado actualizado con éxito");
          setIsModalOpen(false);
          setSelectedPerson(null);
          fetchPersonal();
        } else {
          alert("Error al actualizar el estado");
        }
      } catch (error) {
        console.error("Error al cambiar el estado:", error);
        alert("Error al cambiar el estado");
      }
    }
  };

  const handleDelete = async (id: number) => {
    const confirm = window.confirm("¿Estás seguro de que quieres eliminar este personal?");
    if (!confirm) return;

    try {
      const response = await fetch(`/api/auth/personal/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("Personal eliminado con éxito");
        fetchPersonal();
      } else {
        alert("Error al eliminar personal");
      }
    } catch (error) {
      console.error("Error al eliminar:", error);
    }
  };

  const getStatusColor = (statusId: number) => {
    return statusId === 1 ? "bg-green-500" : "bg-red-500";
  };

  const getStatusName = (statusId: number) => {
    return statusId === 1 ? "Activo" : "Inactivo";
  };

  return (
    <div className="flex">
      <Navbar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <div className={`flex-1 bg-gray-100 min-h-screen transition-all duration-300 ${menuOpen ? "ml-64" : "ml-0 md:ml-64"}`}>
        <div className="container mx-auto p-6">
          <h4 className="text-lg font-semibold mb-4">AGREGAR NUEVO PERSONAL</h4>

          <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow-md">
            <div className="grid grid-cols-4 gap-4">
              <input
                type="text"
                name="nick"
                placeholder="ID Personal"
                className="p-2 border rounded-md text-center"
                value={formData.nick}
                onChange={handleChange}
              />
              <div className="flex items-center">
                <select
                  name="departamentoId"
                  className="p-2 border rounded-md text-center"
                  value={formData.departamentoId}
                  onChange={handleChange}
                >
                  <option value={0}>DEPARTAMENTO</option>
                  {departamentos.map((dep) => (
                    <option key={dep.id} value={dep.id}>{dep.nombre}</option>
                  ))}
                </select>
                <FaPlusCircle className="ml-2 text-blue-500 cursor-pointer" size={20} onClick={() => openModal("departamento")} />
              </div>
              <div className="flex items-center">
                <select
                  name="cargoId"
                  className="p-2 border rounded-md text-center"
                  value={formData.cargoId}
                  onChange={handleChange}
                >
                  <option value={0}>CARGO</option>
                  {cargos.map((cargo) => (
                    <option key={cargo.id} value={cargo.id}>{cargo.nombre}</option>
                  ))}
                </select>
                <FaPlusCircle className="ml-2 text-blue-500 cursor-pointer" size={20} onClick={() => openModal("cargo")} />
              </div>
              <input
                type="text"
                name="nombres"
                placeholder="Nombre"
                className="p-2 border rounded-md text-center"
                value={formData.nombres}
                onChange={handleChange}
              />
              <input
                type="text"
                name="apellidos"
                placeholder="Apellido"
                className="p-2 border rounded-md text-center"
                value={formData.apellidos}
                onChange={handleChange}
              />
              <input
                type="text"
                name="telefono"
                placeholder="Teléfono"
                className="p-2 border rounded-md text-center"
                value={formData.telefono}
                onChange={handleChange}
              />
              <input
                type="email"
                name="email"
                placeholder="Correo Electrónico"
                className="p-2 border rounded-md text-center"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <button type="submit" className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md">
              Guardar
            </button>
          </form>

          {/* Tabla de Personal */}
          <div className="mt-8">
            <h4 className="text-lg font-semibold mb-4">LISTADO DE PERSONAL</h4>
            <table className="min-w-full bg-white rounded-lg overflow-hidden">
              <thead>
                <tr>
                  <th className="py-2 px-4 bg-blue-100">Nick</th>
                  <th className="py-2 px-4 bg-blue-100">Nombre</th>
                  <th className="py-2 px-4 bg-blue-100">Departamento</th>
                  <th className="py-2 px-4 bg-blue-100">Cargo</th>
                  <th className="py-2 px-4 bg-blue-100">Estado</th>
                  <th className="py-2 px-4 bg-blue-100">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {personal.map((p) => (
                  <tr key={p.id}>
                    <td className="text-center py-2 px-4">{p.nick}</td>
                    <td className="text-center py-2 px-4">{p.nombres}</td>
                    <td className="text-center py-2 px-4">
                      {departamentos.find((dep) => dep.id === p.departamentoId)?.nombre || "—"}
                    </td>
                    <td className="text-center py-2 px-4">
                      {cargos.find((cargo) => cargo.id === p.cargoId)?.nombre || "—"}
                    </td>
                    <td className="text-center py-2 px-4">
                      <button
                        className={`flex items-center justify-center gap-2 px-3 py-1 rounded-md text-white ${getStatusColor(p.statusId)}`}
                        onClick={() => {
                          setSelectedPerson(p);
                          openModal("status");
                        }}
                      >
                        <span className="w-3 h-3 rounded-full bg-white"></span>
                        {getStatusName(p.statusId)}
                      </button>
                    </td>
                    <td className="text-center py-2 px-4 flex justify-center gap-2">
                      
                      <button
                        className="bg-red-600 text-white px-2 py-1 rounded-md"
                        onClick={() => handleDelete(p.id)}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Modal Estado */}
          {isModalOpen && modalType === "status" && selectedPerson && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded shadow-md w-80">
                <h4 className="text-lg font-semibold mb-4 text-center">Cambiar Estado</h4>
                <div className="flex justify-around">
                  <button
                    className="bg-green-500 text-white px-4 py-2 rounded"
                    onClick={() => handleStatusChange(1)}
                  >
                    Activo
                  </button>
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded"
                    onClick={() => handleStatusChange(2)}
                  >
                    Inactivo
                  </button>
                </div>
                <button
                  className="mt-4 block mx-auto px-4 py-2 bg-gray-300 rounded"
                  onClick={closeModal}
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Personal;
