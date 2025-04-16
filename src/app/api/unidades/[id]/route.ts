import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET unidad por ID
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    const unidad = await prisma.unidad.findUnique({
      where: { id },
      include: {
        marca: true,
        modelo: true,
        status: true,
      },
    });

    if (!unidad) {
      return NextResponse.json({ error: "Unidad no encontrada" }, { status: 404 });
    }

    return NextResponse.json(unidad);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE unidad por ID
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    const deleted = await prisma.unidad.delete({ where: { id } });
    return NextResponse.json(deleted);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
