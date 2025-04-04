"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import Navbar from "./Navbar";

export default function NavbarWrapper() {
  const pathname = usePathname();
  const hideNavbar = ["/", "/login", "/register"].includes(pathname);
  const [menuOpen, setMenuOpen] = useState(false);

  if (hideNavbar) return null;

  return <Navbar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />;
}
