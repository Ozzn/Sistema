import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// POST: Registrar una nueva unidad
export async function POST(req: Request) {
  try {
    const { idUnidad, marcaId, modeloId, vim, fecha, capacidad, combustible, transmision, statusId } = await req.json();

    if (!idUnidad || !marcaId || !modeloId || !vim || !fecha || !capacidad || !combustible || !transmision || !statusId) {
      return NextResponse.json({ message: "Todos los campos son obligatorios" }, { status: 400 });
    }

    const unidad = await prisma.unidad.create({
      data: {
        idUnidad,
        marcaId: Number(marcaId),
        modeloId: Number(modeloId),
        vim,
        fecha,
        capacidad,
        combustible,
        transmision,
        statusId: Number(statusId),
      },
      include: {
        marca: true,
        modelo: true,
        status: true,
      },
    });

    return NextResponse.json(unidad, { status: 201 });
  } catch (error: any) {
    console.error("Error al registrar la unidad:", error);
    return NextResponse.json({ message: "Error al registrar la unidad", error: error.message }, { status: 500 });
  }
}

// GET: Obtener todas las unidades
export async function GET() {
  try {
    const unidades = await prisma.unidad.findMany({
      include: {
        marca: true,
        modelo: true,
        status: true,
      },
    });

    return NextResponse.json(unidades, { status: 200 });
  } catch (error: any) {
    console.error("Error al obtener unidades:", error);
    return NextResponse.json({ message: "Error al obtener unidades", error: error.message }, { status: 500 });
  }
}

// PATCH: Actualizar el estado de una unidad
export async function PATCH(req: Request) {
  try {
    // Extraer los datos necesarios del cuerpo de la solicitud
    const { id, statusId } = await req.json();

    if (!id || !statusId) {
      return NextResponse.json({ message: "El id y el statusId son obligatorios" }, { status: 400 });
    }

    // Actualizar la unidad con el nuevo statusId
    const updatedUnit = await prisma.unidad.update({
      where: { id: Number(id) },  // Buscar la unidad por su ID
      data: {
        statusId: Number(statusId),  // Actualizar el statusId
      },
      include: {
        marca: true,
        modelo: true,
        status: true,  // Incluir los datos relacionados del status
      },
    });

    return NextResponse.json(updatedUnit, { status: 200 });
  } catch (error: any) {
    console.error("Error al actualizar el estado de la unidad:", error);
    return NextResponse.json({ message: "Error al actualizar el estado de la unidad", error: error.message }, { status: 500 });
  }
}
