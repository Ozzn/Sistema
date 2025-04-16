import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET: Obtener unidad por ID
export async function GET(
  req: NextRequest,
  context: { params: Record<string, string> }
) {
  const { id } = context.params;

  if (!id) {
    return NextResponse.json({ message: "ID no proporcionado" }, { status: 400 });
  }

  try {
    const unidad = await prisma.unidad.findUnique({
      where: { id: Number(id) },
      include: {
        marca: true,
        modelo: true,
        status: true,
      },
    });

    if (!unidad) {
      return NextResponse.json({ message: "Unidad no encontrada" }, { status: 404 });
    }

    return NextResponse.json(unidad, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: "Error al obtener la unidad", error: error.message }, { status: 500 });
  }
}

// DELETE: Eliminar unidad por ID
export async function DELETE(
  req: NextRequest,
  context: { params: Record<string, string> }
) {
  const { id } = context.params;

  if (!id) {
    return NextResponse.json({ message: "ID no proporcionado" }, { status: 400 });
  }

  try {
    const unidadEliminada = await prisma.unidad.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json(unidadEliminada, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: "Error al eliminar la unidad", error: error.message }, { status: 500 });
  }
}
