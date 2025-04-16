"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { FaPlusCircle } from "react-icons/fa";
import DeleteIconButton from "../../components/DeleteIconButton"; // 👈 Importa el botón


export default function UnidadDetallePage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const router = useRouter();

  const [formData, setFormData] = useState({
    idUnidad: "",
    marcaId: "",
    modeloId: "",
    vim: "",
    fecha: "",
    capacidad: "",
    combustible: "",
    transmision: "",
  });

  const [marcas, setMarcas] = useState([]);
  const [modelos, setModelos] = useState([]);

  useEffect(() => {
    if (!id) return;

    fetch(`/api/auth/unidades/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Error al obtener la unidad");
        return res.json();
      })
      .then((data) => {
        setFormData({
          idUnidad: data.idUnidad || "",
          marcaId: data.marcaId || "",
          modeloId: data.modeloId || "",
          vim: data.vim || "",
          fecha: data.fecha || "",
          capacidad: data.capacidad || "",
          combustible: data.combustible || "",
          transmision: data.transmision || "",
        });
      })
      .catch((error) => console.error("Error al cargar unidad:", error));

    fetch("/api/auth/marcas")
      .then((res) => res.json())
      .then((data) => setMarcas(data));

    fetch("/api/auth/modelos")
      .then((res) => res.json())
      .then((data) => setModelos(data));
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch(`/api/auth/unidades/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    alert("Unidad actualizada correctamente");
    router.push("/unidades");
  };

  return (
    <div className="pl-64 pr-6 pt-6">
      <div className="max-w-5xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-6 text-gray-800">Editar Unidad</h2>

        <form onSubmit={handleUpdate}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text"
              name="idUnidad"
              placeholder="Id Unidad"
              className="p-2 border rounded-md text-center"
              value={formData.idUnidad}
              onChange={handleChange}
            />
            <div className="flex items-center">
              <select
                name="marcaId"
                className="p-2 border rounded-md text-center w-full"
                value={formData.marcaId}
                onChange={handleChange}
              >
                <option value="">MARCA</option>
                {marcas.map((marca: any) => (
                  <option key={marca.id} value={marca.id}>
                    {marca.nombre}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center">
              <select
                name="modeloId"
                className="p-2 border rounded-md text-center w-full"
                value={formData.modeloId}
                onChange={handleChange}
              >
                <option value="">MODELO</option>
                {modelos.map((modelo: any) => (
                  <option key={modelo.id} value={modelo.id}>
                    {modelo.nombre}
                  </option>
                ))}
              </select>
            </div>
            <input
              type="text"
              name="vim"
              placeholder="VIM"
              className="p-2 border rounded-md text-center"
              value={formData.vim}
              onChange={handleChange}
            />
            <input
              type="text"
              name="fecha"
              placeholder="AÑO"
              className="p-2 border rounded-md text-center"
              value={formData.fecha}
              onChange={handleChange}
            />
            <input
              type="text"
              name="capacidad"
              placeholder="CAPACIDAD"
              className="p-2 border rounded-md text-center"
              value={formData.capacidad}
              onChange={handleChange}
            />
            <select
              name="combustible"
              className="p-2 border rounded-md text-center"
              value={formData.combustible}
              onChange={handleChange}
            >
              <option value="">COMBUSTIBLE</option>
              <option value="Gasolina">Gasolina</option>
              <option value="Diesel">Diesel</option>
            </select>
            <select
              name="transmision"
              className="p-2 border rounded-md text-center"
              value={formData.transmision}
              onChange={handleChange}
            >
              <option value="">TRANSMISIÓN</option>
              <option value="Automática">Automática</option>
              <option value="Manual">Manual</option>
            </select>
          </div>

          <div className="mt-6 flex gap-4 justify-end">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
            >
              Guardar Cambios
            </button>

            {/* 🔥 Botón de eliminar con ícono */}
            <DeleteIconButton
              id={id ?? ""}
              url="/api/auth/unidades"
              title="Eliminar unidad"
            />
          </div>
        </form>
      </div>
    </div>
  );
}
