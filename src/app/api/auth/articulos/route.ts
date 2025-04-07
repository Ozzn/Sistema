import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Forzar la dinámica de la respuesta (opcional según tu configuración)
export const dynamic = "force-dynamic";

/**
 * GET: Obtiene todos los artículos registrados.
 */
export async function GET() {
  try {
    const articulos = await prisma.articulo.findMany({
      include: {
        proveedor: true, // Incluye información del proveedor relacionado
      },
      orderBy: { id: "desc" },
    });
    return NextResponse.json({ articulos });
  } catch (error) {
    console.error("Error al obtener artículos:", error);
    return NextResponse.json(
      { error: "Error al obtener artículos" },
      { status: 500 }
    );
  }
}

/**
 * POST: Crea un nuevo artículo.
 * Se espera que la solicitud contenga un JSON con los siguientes campos:
 * - nombre: string
 * - estado: string
 * - unidad: string
 * - cantidad: number
 * - ubicacion: string
 * - proveedorId: number (id del proveedor relacionado)
 */
export async function POST(req: Request) {
  try {
    const { nombre, estado, unidad, cantidad, ubicacion, proveedorId } =
      await req.json();

    if (
      !nombre ||
      !estado ||
      !unidad ||
      cantidad === undefined ||
      !ubicacion ||
      !proveedorId
    ) {
      return NextResponse.json(
        { error: "Faltan datos obligatorios" },
        { status: 400 }
      );
    }

    const nuevoArticulo = await prisma.articulo.create({
      data: {
        nombre,
        estado,
        unidad,
        cantidad,
        ubicacion,
        proveedor: {
          connect: { id: Number(proveedorId) },
        },
      },
      include: {
        proveedor: true,
      },
    });

    return NextResponse.json({ nuevoArticulo });
  } catch (error) {
    console.error("Error al crear artículo:", error);
    return NextResponse.json(
      { error: "Error al crear artículo" },
      { status: 500 }
    );
  }
}

/**
 * PUT: Actualiza la cantidad de un artículo existente.
 * Solo se actualizará la cantidad.
 */
export async function PUT(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id || isNaN(Number(id))) {
      return NextResponse.json(
        { error: "ID de artículo inválido" },
        { status: 400 }
      );
    }

    const { cantidad } = await req.json();

    // Primero obtenemos el artículo actual
    const articulo = await prisma.articulo.findUnique({
      where: { id: Number(id) },
    });

    if (!articulo) {
      return NextResponse.json(
        { error: "Artículo no encontrado" },
        { status: 404 }
      );
    }

    // Actualizamos solo la cantidad
    const articuloActualizado = await prisma.articulo.update({
      where: { id: Number(id) },
      data: {
        cantidad: articulo.cantidad + cantidad,  // Solo actualizamos la cantidad
      },
    });

    return NextResponse.json(articuloActualizado);
  } catch (error) {
    console.error("Error al actualizar artículo:", error);
    return NextResponse.json(
      { error: "Error al actualizar artículo" },
      { status: 500 }
    );
  }
}

/**
 * DELETE: Elimina un artículo existente.
 * Se espera que la URL tenga un query parameter 'id'.
 */
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id || isNaN(Number(id))) {
      return NextResponse.json(
        { error: "ID de artículo inválido" },
        { status: 400 }
      );
    }

    const articulo = await prisma.articulo.findUnique({
      where: { id: Number(id) },
    });

    if (!articulo) {
      return NextResponse.json(
        { error: "Artículo no encontrado" },
        { status: 404 }
      );
    }

    await prisma.articulo.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({
      success: true,
      message: "Artículo eliminado correctamente",
    });
  } catch (error) {
    console.error("Error al eliminar artículo:", error);
    return NextResponse.json(
      { error: "Error al eliminar artículo" },
      { status: 500 }
    );
  }
}
