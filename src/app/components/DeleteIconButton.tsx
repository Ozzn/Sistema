"use client";

import { FaTrash } from "react-icons/fa";
import React from "react";

interface DeleteIconButtonProps {
  id: string;
  url: string;
  onSuccess?: () => void;
  confirmMessage?: string;
  iconSize?: number;
  iconColor?: string;
  title?: string; // tooltip
}

export default function DeleteIconButton({
  id,
  url,
  onSuccess,
  confirmMessage = "¿Estás seguro de eliminar este elemento?",
  iconSize = 18,
  iconColor = "#dc2626", // rojo tailwind
  title = "Eliminar",
}: DeleteIconButtonProps) {
  const handleDelete = async () => {
    const confirm = window.confirm(confirmMessage);
    if (!confirm) return;

    try {
      const res = await fetch(`${url}/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Error al eliminar");

      alert("Elemento eliminado correctamente");
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error eliminando:", error);
      alert("Hubo un error al eliminar");
    }
  };

  return (
    <button onClick={handleDelete} title={title} className="p-1 hover:scale-110 transition">
      <FaTrash size={iconSize} color={iconColor} />
    </button>
  );
}
