"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

interface NavbarProps {
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
}

export default function Navbar({ menuOpen, setMenuOpen }: NavbarProps) {
  const { data: session } = useSession();

  // Estado para controlar qué submenú está abierto
  const [openSubMenu, setOpenSubMenu] = useState<string | null>(null);

  const menusData =
    session?.user?.menus?.filter(
      (menu) => typeof menu.path === "string" && menu.path.startsWith("/")
    ) || [];

  const uniqueCategories = [
    ...new Set(menusData.map((item) => item.category || "Sin categoría")),
  ];

  const toggleSubMenu = (category: string) => {
    setOpenSubMenu(openSubMenu === category ? null : category);
  };

  return (
    <>
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="md:hidden text-white p-4"
      >
        {menuOpen ? "Cerrar Menú" : "Abrir Menú"}
      </button>

      <nav
        className={`fixed top-0 left-0 h-screen bg-gray-800 text-white p-4 overflow-y-auto w-64 z-40
          transition-transform duration-500 ease-in-out
          ${menuOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0`}
      >
        <div className="flex flex-col space-y-6 pb-10">
          {menusData.length === 0 ? (
            <p className="text-white">No hay menús disponibles</p>
          ) : (
            uniqueCategories.map((category) => (
              <div key={category}>
                <h2
                  className="text-lg font-semibold text-gray-300 mb-2 cursor-pointer"
                  onClick={() => toggleSubMenu(category)}
                >
                  {category}
                </h2>
                <ul
                  className={`space-y-1 ml-2 ${
                    openSubMenu === category ? "block" : "hidden"
                  }`}
                >
                  {menusData
                    .filter(
                      (menu) =>
                        (menu.category || "Sin categoría") === category
                    )
                    .map((menu) => (
                      <li key={menu.id}>
                        <Link
                          href={menu.path}
                          className="text-sm text-white hover:text-yellow-400 transition"
                        >
                          {menu.name}
                        </Link>
                      </li>
                    ))}
                </ul>
              </div>
            ))
          )}

          {session?.user && (
            <div className="mt-6">
              <button
                onClick={() =>
                  signOut({ redirect: true, callbackUrl: "/login" })
                }
                className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
              >
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </nav>
    </>
  );
}
