"use client";

import React, { useState } from "react";
import Navbar from "../components/Navbar";

interface MenuOption {
  id: string;
  name: string;
  submenus?: MenuOption[];
}

const MenuCreationPage = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedRoleName, setSelectedRoleName] = useState<string>("");
  const [selectedMenus, setSelectedMenus] = useState<string[]>([]);

  const menuOptions: MenuOption[] = [
    {
      id: "almacen",
      name: "ALMACEN",
      submenus: [
        { id: "/almacen", name: "Artículos" },
        { id: "/almacen-despacho", name: "Despacho" },
      ],
    },
    {
      id: "data",
      name: "DATA",
      submenus: [
        { id: "/data", name: "Data" },
        { id: "/scanner", name: "Scanner" },
        { id: "/cleandesp", name: "Cleandesp" },
      ],
    },
    {
      id: "estacion",
      name: "ESTACION",
      submenus: [{ id: "/estacion", name: "Estación" }],
    },
    {
      id: "menu",
      name: "OPCIONES AVANZADAS",
      submenus: [{ id: "/menus", name: "Crear Menú" }],
    },
    {
      id: "personal",
      name: "PERSONAL",
      submenus: [
        { id: "/usuario", name: "Usuarios" },
        { id: "/personal", name: "Personal" },
      ],
    },
    {
      id: "proveedor",
      name: "PROVEEDOR",
      submenus: [{ id: "/proveedor", name: "Proveedor" }],
    },
    {
      id: "despacho",
      name: "DESPACHO",
      submenus: [
        { id: "/despacho", name: "Despacho" },
        { id: "/lista-despacho", name: "Lista de Despacho" },
      ],
    },
    {
      id: "flota",
      name: "FLOTA",
      submenus: [
        { id: "/unidades", name: "Unidades" },
        { id: "/mantenimiento", name: "Mantenimiento" },
      ],
    },
  ];

  const handleSubmenuToggle = (submenuId: string) => {
    setSelectedMenus((prev) =>
      prev.includes(submenuId)
        ? prev.filter((id) => id !== submenuId)
        : [...prev, submenuId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedRoleName.trim()) {
      alert("Ingrese un nombre para el rol");
      return;
    }

    if (selectedMenus.length === 0) {
      alert("Seleccione al menos un menú");
      return;
    }

    try {
      const res = await fetch("/api/auth/menus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: selectedRoleName,
          menus: selectedMenus, // solo submenús, tipo "/unidades"
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Rol creado y menús asignados correctamente");
        setSelectedRoleName("");
        setSelectedMenus([]);
      } else {
        alert(data.message || "Error al crear rol");
      }
    } catch (error) {
      console.error("Error al crear rol:", error);
      alert("Error al crear rol");
    }
  };

  return (
    <div className="flex">
      <Navbar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <div
        className={`flex-1 bg-gray-100 min-h-screen transition-all duration-300 ${
          menuOpen ? "ml-64" : "ml-0 md:ml-64"
        }`}
      >
        <div className="container mx-auto p-6">
          <h4 className="text-lg font-semibold mb-4">Gestión de Menús por Rol</h4>

          <div className="bg-white p-4 rounded-lg shadow-md mb-6">
            <h3 className="text-lg font-medium mb-4">
              Crear un nuevo rol y asignar menús
            </h3>
            <form onSubmit={handleSubmit} className="flex flex-wrap gap-4">
              <input
                type="text"
                placeholder="Nombre del rol"
                className="p-2 border rounded w-full md:w-1/4 min-w-[180px]"
                value={selectedRoleName}
                onChange={(e) => setSelectedRoleName(e.target.value)}
                required
              />

              <div className="w-full mt-4">
                <h4 className="text-md font-semibold mb-2">Seleccionar Menús</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {menuOptions.map((menu) => (
                    <div key={menu.id} className="bg-gray-50 p-3 rounded shadow">
                      <p className="font-semibold text-blue-700 mb-2">{menu.name}</p>

                      {menu.submenus && (
                        <div className="ml-3 space-y-1">
                          {menu.submenus.map((submenu) => (
                            <label
                              key={submenu.id}
                              className="flex items-center space-x-2"
                            >
                              <input
                                type="checkbox"
                                checked={selectedMenus.includes(submenu.id)}
                                onChange={() => handleSubmenuToggle(submenu.id)}
                                className="text-blue-500"
                              />
                              <span>{submenu.name}</span>
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mt-4"
              >
                Crear Rol
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuCreationPage;
