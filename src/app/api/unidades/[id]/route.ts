import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

type Context = {
  params: {
    id: string;
  };
};

export async function GET(req: NextRequest, context: Context) {
  const id = Number(context.params.id);

  if (isNaN(id)) {
    return NextResponse.json({ message: "ID inválido" }, { status: 400 });
  }

  try {
    const unidad = await prisma.unidad.findUnique({
      where: { id },
      include: {
        marca: true,
        modelo: true,
        status: true,
      },
    });

    if (!unidad) {
      return NextResponse.json({ message: "Unidad no encontrada" }, { status: 404 });
    }

    return NextResponse.json(unidad);
  } catch (error: any) {
    return NextResponse.json({ message: "Error en el servidor", error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, context: Context) {
  const id = Number(context.params.id);

  if (isNaN(id)) {
    return NextResponse.json({ message: "ID inválido" }, { status: 400 });
  }

  try {
    const deleted = await prisma.unidad.delete({
      where: { id },
    });

    return NextResponse.json(deleted);
  } catch (error: any) {
    return NextResponse.json({ message: "Error al eliminar", error: error.message }, { status: 500 });
  }
}
