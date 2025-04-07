import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Configuración importante para métodos DELETE
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const proveedores = await prisma.proveedor.findMany({
      include: {
        status: true,
      },
      orderBy: { id: "desc" },
    });
    return NextResponse.json(proveedores);
  } catch (error) {
    console.error("Error al obtener proveedores:", error);
    return NextResponse.json({ error: "Error al obtener proveedores" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { rif, empresa, nombre, apellido, telefono, email, statusId } = await req.json();

    if (!rif || !empresa || !nombre || !apellido || !telefono || !email) {
      return NextResponse.json({ error: "Faltan datos obligatorios" }, { status: 400 });
    }

    const nuevoProveedor = await prisma.proveedor.create({
      data: {
        rif,
        empresa,
        nombre,
        apellido,
        telefono,
        email,
        status: {
          connect: { id: statusId || 1 },
        },
      },
      include: {
        status: true,
      },
    });

    return NextResponse.json(nuevoProveedor);
  } catch (error) {
    console.error("Error al crear proveedor:", error);
    return NextResponse.json({ error: "Error al crear proveedor" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const { statusId } = await req.json();

    if (!id || isNaN(Number(id))) {
      return NextResponse.json({ error: "ID de proveedor inválido" }, { status: 400 });
    }

    if (!statusId || (statusId !== 1 && statusId !== 2)) {
      return NextResponse.json({ error: "Estado inválido" }, { status: 400 });
    }

    const proveedorActualizado = await prisma.proveedor.update({
      where: { id: Number(id) },
      data: {
        status: {
          connect: { id: statusId },
        },
      },
      include: {
        status: true,
      },
    });

    return NextResponse.json(proveedorActualizado);
  } catch (error) {
    console.error("Error al actualizar estado:", error);
    return NextResponse.json({ error: "Error al actualizar estado" }, { status: 500 });
  }
}

// Versión corregida del DELETE que acepta query parameters
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id || isNaN(Number(id))) {
      return NextResponse.json({ error: "ID de proveedor inválido" }, { status: 400 });
    }

    // Verificar si el proveedor existe primero
    const proveedor = await prisma.proveedor.findUnique({
      where: { id: Number(id) },
    });

    if (!proveedor) {
      return NextResponse.json({ error: "Proveedor no encontrado" }, { status: 404 });
    }

    await prisma.proveedor.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ 
      success: true,
      message: "Proveedor eliminado correctamente" 
    });
  } catch (error) {
    console.error("Error al eliminar proveedor:", error);
    return NextResponse.json({ 
      error: "Error al eliminar proveedor",
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}