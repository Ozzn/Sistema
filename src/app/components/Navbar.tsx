"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FaHome,
  FaWarehouse,
  FaUser,
  FaCog,
  FaBus,
  FaGasPump,
  FaPeopleCarry,
  FaDatabase,
} from "react-icons/fa";

interface NavbarProps {
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
}

export default function Navbar({ menuOpen, setMenuOpen }: NavbarProps) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const toggleDropdown = (menu: string) => {
    setOpenDropdown(openDropdown === menu ? null : menu);
  };

  return (
    <>
      {/* Sidebar */}
      <nav
        className={`fixed top-0 left-0 h-screen bg-gray-800 text-white p-4 transition-transform duration-500 ease-in-out overflow-y-auto
        ${menuOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0 md:w-64 w-64 z-40`}
      >
        <div className="flex flex-col space-y-4 pb-10">
          <Link href="/profile" onClick={() => setMenuOpen(false)}>
            <div className="text-xl font-bold mb-4 block hover:bg-gray-600 px-4 py-2 cursor-pointer">
              <FaHome className="inline mr-2" />
              INICIO
            </div>
          </Link>

          {/* Dropdowns */}
          <DropdownMenu
            title="ALMACEN"
            icon={<FaWarehouse className="inline mr-2" />}
            isOpen={openDropdown === "almacen"}
            toggle={() => toggleDropdown("almacen")}
            links={[{ href: "/almacen", label: "articulos" }]}
          />
          <DropdownMenu
            title="DATA"
            icon={<FaDatabase className="inline mr-2" />}
            isOpen={openDropdown === "data"}
            toggle={() => toggleDropdown("data")}
            links={[
              { href: "/data", label: "Data" },
              { href: "/scanner", label: "Scanner" },
              { href: "/cleandesp", label: "Cleandesp" },
            ]}
          />
          <DropdownMenu
            title="ESTACION"
            icon={<FaGasPump className="inline mr-2" />}
            isOpen={openDropdown === "estacion"}
            toggle={() => toggleDropdown("estacion")}
            links={[{ href: "/estacion", label: "Estacion" }]}
          />
          <DropdownMenu
            title="OPCIONES AVANZADAS"
            icon={<FaCog className="inline mr-2" />}
            isOpen={openDropdown === "menu"}
            toggle={() => toggleDropdown("menu")}
            links={[{ href: "/menu", label: "Crear menú" }]}
          />
          <DropdownMenu
            title="PERSONAL"
            icon={<FaUser className="inline mr-2" />}
            isOpen={openDropdown === "personal"}
            toggle={() => toggleDropdown("personal")}
            links={[
              { href: "/usuario", label: "Usuarios" },
              { href: "/personal", label: "Personal" },
            ]}
          />
          <DropdownMenu
            title="PROVEEDOR"
            icon={<FaPeopleCarry className="inline mr-2" />}
            isOpen={openDropdown === "proveedor"}
            toggle={() => toggleDropdown("proveedor")}
            links={[{ href: "/proveedor", label: "Proveedor" }]}
          />
          <DropdownMenu
            title="DESPACHO"
            icon={<FaBus className="inline mr-2" />}
            isOpen={openDropdown === "despacho"}
            toggle={() => toggleDropdown("despacho")}
            links={[
              { href: "/despacho", label: "Despacho" },
              { href: "/lista-despacho", label: "Lista de Despacho" },
            ]}
          />
          <DropdownMenu
            title="FLOTA"
            icon={<FaBus className="inline mr-2" />}
            isOpen={openDropdown === "unidades"}
            toggle={() => toggleDropdown("unidades")}
            links={[
              { href: "/unidades", label: "unidades" },
              { href: "/mantenimiento", label: "Mantenimiento" },
            ]}
          />
        </div>
      </nav>
    </>
  );
}

// Subcomponente de dropdown
function DropdownMenu({
  title,
  icon,
  isOpen,
  toggle,
  links,
}: {
  title: string;
  icon: React.ReactNode;
  isOpen: boolean;
  toggle: () => void;
  links: { href: string; label: string }[];
}) {
  return (
    <div className="relative">
      <div
        className="w-full text-left px-4 py-2 cursor-pointer hover:bg-gray-600"
        onClick={toggle}
      >
        {icon}
        {title}
      </div>
      {isOpen && (
        <div className="ml-4 mt-2 space-y-2">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-600 rounded-md"
            >
              <span className="w-6 h-6 border-2 border-white rounded-full flex justify-center items-center" />
              <span>{label}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
