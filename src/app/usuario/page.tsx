"use client";
import { useState, useEffect } from "react";
import { FaTrash, FaPlus } from "react-icons/fa";
import Navbar from "../components/Navbar";
import AuthGuard from "../components/AuthGuard"; // Importa AuthGuard

interface Usuario {
  id: number;
  nick: string;
  nombres: string;
  apellidos: string;
  email: string;
  telefono: string;
  role: { name: string };
  status: { name: string };
}

interface Role {
  id: number;
  name: string;
}

export default function Usuarios() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [form, setForm] = useState({
    nick: "",
    nombres: "",
    apellidos: "",
    telefono: "",
    email: "",
    password: "",
    roleId: "",
    statusId: "1",
  });

  useEffect(() => {
    // Obtener usuarios y roles desde la API
    const fetchUsuarios = async () => {
      try {
        const res = await fetch("/api/auth/register");
        const data = await res.json();
        if (res.ok) {
          setUsuarios(data.users); // Usamos data.users que contiene los usuarios
          setRoles(data.roles); // Usamos data.roles que contiene los roles
        } else {
          alert(data.error || "Error al cargar los usuarios");
        }
      } catch (error) {
        console.error("Error al obtener usuarios:", error);
        alert("Error al conectar con el servidor");
      }
    };

    fetchUsuarios();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const { nick, nombres, apellidos, telefono, email, password, roleId, statusId } = form;

    if (!nick || !nombres || !apellidos || !telefono || !email || !password || !roleId) {
      alert("Todos los campos son obligatorios");
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nick,
          nombres,
          apellidos,
          telefono,
          email,
          password,
          roleId: parseInt(roleId),
          statusId: parseInt(statusId),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Error al registrar usuario");
      } else {
        alert("Usuario registrado exitosamente");
        setUsuarios((prev) => [...prev, data]);
        setForm({
          nick: "",
          nombres: "",
          apellidos: "",
          telefono: "",
          email: "",
          password: "",
          roleId: "",
          statusId: "1",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error al conectar con el servidor");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`/api/auth/register/${id}`, { method: "DELETE" });

      if (res.ok) {
        setUsuarios(usuarios.filter((usuario) => usuario.id !== id));
        alert("Usuario eliminado exitosamente");
      } else {
        const data = await res.json();
        alert(data.error || "Error al eliminar el usuario");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error al conectar con el servidor");
    }
  };

  return (
    <AuthGuard> {/* Envolvemos el contenido con AuthGuard */}
      <div className="flex">
        <Navbar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
        <div className={`flex-1 bg-gray-100 min-h-screen transition-all duration-300 ${menuOpen ? "ml-64" : "ml-0 md:ml-64"}`}>
          <div className="container mx-auto p-6">
            <h4 className="text-lg font-semibold mb-4">Gestión de Usuarios</h4>

            {/* Formulario de registro */}
            <div className="bg-white p-4 rounded-lg shadow-md mb-6">
              <h3 className="text-lg font-medium mb-4">Agregar nuevo usuario</h3>
              <div className="grid grid-cols-6 gap-3 mb-4">
                <input className="border p-2 rounded" placeholder="Nick" name="nick" value={form.nick} onChange={handleChange} />
                <input className="border p-2 rounded" placeholder="Nombres" name="nombres" value={form.nombres} onChange={handleChange} />
                <input className="border p-2 rounded" placeholder="Apellidos" name="apellidos" value={form.apellidos} onChange={handleChange} />
                <input className="border p-2 rounded" placeholder="Teléfono" name="telefono" value={form.telefono} onChange={handleChange} />
                <input className="border p-2 rounded" placeholder="Email" name="email" value={form.email} onChange={handleChange} />
                <input className="border p-2 rounded" placeholder="Contraseña" name="password" type="password" value={form.password} onChange={handleChange} />
              </div>

              <div className="grid grid-cols-6 gap-3">
                <select className="border p-2 rounded text-gray-500" name="roleId" value={form.roleId} onChange={handleChange}>
                  <option value="">Selecciona Rol</option>
                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>{role.name}</option>
                  ))}
                </select>

                <input type="hidden" name="statusId" value={form.statusId} />

                <div className="col-span-3"></div>

                <button className="bg-blue-600 text-white px-4 py-2 rounded col-span-1 flex items-center justify-center gap-2" onClick={handleSubmit}>
                  <FaPlus /> Agregar
                </button>
              </div>
            </div>

            {/* Tabla de usuarios */}
            <div className="bg-white p-4 rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <label className="mr-2">Mostrar</label>
                  <select className="border px-2 py-1 rounded">
                    <option>50</option>
                  </select>
                  <span className="ml-2">registros</span>
                </div>
                <div>
                  <label className="mr-2">Buscar:</label>
                  <input type="text" className="border px-2 py-1 rounded" />
                </div>
              </div>

              <table className="min-w-full text-sm text-left border">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 border">ID</th>
                    <th className="px-4 py-2 border">Nick</th>
                    <th className="px-4 py-2 border">Nombres</th>
                    <th className="px-4 py-2 border">Apellidos</th>
                    <th className="px-4 py-2 border">Email</th>
                    <th className="px-4 py-2 border">Telefono</th>
                    <th className="px-4 py-2 border">Rol</th>
                    <th className="px-4 py-2 border">Status</th>
                    <th className="px-4 py-2 border">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {usuarios.map((usuario) => (
                    <tr key={usuario.id} className="text-center">
                      <td className="border px-2 py-2">{usuario.id}</td>
                      <td className="border px-2 py-2">{usuario.nick}</td>
                      <td className="border px-2 py-2">{usuario.nombres}</td>
                      <td className="border px-2 py-2">{usuario.apellidos}</td>
                      <td className="border px-2 py-2">{usuario.email}</td>
                      <td className="border px-2 py-2">{usuario.telefono}</td>
                      <td className="border px-2 py-2">{usuario.role ? usuario.role.name : "No asignado"}</td>
                      <td className="border px-2 py-2">{usuario.status ? usuario.status.name : "No asignado"}</td>
                      <td className="border px-2 py-2">
                        <button className="bg-red-600 text-white p-2 rounded" onClick={() => handleDelete(usuario.id)}>
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Paginación */}
              <div className="flex justify-between items-center mt-4">
                <span>Total de {usuarios.length} Registros</span>
                <div className="flex items-center gap-2">
                  <button className="px-3 py-1 border rounded bg-white">Anterior</button>
                  <button className="px-3 py-1 border rounded bg-blue-600 text-white">1</button>
                  <button className="px-3 py-1 border rounded bg-white">Siguiente</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
