import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");

    if (action === "list") {
      const personal = await prisma.personal.findMany({
        include: {
          cargo: true,
          status: true,
        },
        orderBy: {
          nombre: "asc",
        },
      });

      return NextResponse.json({ success: true, data: personal }, { status: 200 });
    }

    // Obtener los cargos
    const cargos = await prisma.cargo.findMany({
      orderBy: { name: "asc" },
    });

    return NextResponse.json(
      { success: true, data: { cargos } },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error en GET /api/personal:", error);
    return NextResponse.json(
      { success: false, message: "Error al obtener datos." },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request: Request) {
  try {
    const { cedula, nombre, telefono, cargoId, tag } = await request.json();

    // Validar que todos los campos sean enviados
    if (!cedula || !nombre || !telefono || !cargoId || !tag) {
      return NextResponse.json(
        { success: false, message: "Todos los campos son obligatorios." },
        { status: 400 }
      );
    }

    // Verificar que el cargo exista
    const cargoExists = await prisma.cargo.findUnique({
      where: { id: cargoId },
    });

    if (!cargoExists) {
      return NextResponse.json(
        { success: false, message: "El cargo no existe." },
        { status: 400 }
      );
    }

    // Crear el nuevo personal
    const personal = await prisma.personal.create({
      data: {
        cedula,
        nombre,
        telefono,
        tag,
        statusId: 1, // Por defecto, activo
        cargoId: Number(cargoId),
      },
      include: {
        cargo: true,
        status: true,
      },
    });

    return NextResponse.json({ success: true, data: personal }, { status: 201 });

  } catch (error) {
    console.error("Error en POST /api/auth/personal:", error);
    return NextResponse.json(
      { success: false, message: "Error al registrar el personal." },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, statusId } = await request.json();
    
    if (!id || !statusId) {
      return NextResponse.json(
        { success: false, message: "ID y Status ID son requeridos." },
        { status: 400 }
      );
    }

    // Validar que el status sea uno de los permitidos
    if (![1, 2, 5, 6].includes(statusId)) {
      return NextResponse.json(
        { success: false, message: "Status no válido." },
        { status: 400 }
      );
    }

    // Actualizar el personal
    const updatedPersonal = await prisma.personal.update({
      where: { id: Number(id) },
      data: { statusId },
      include: {
        cargo: true,
        status: true,
      },
    });

    return NextResponse.json(
      { success: true, data: updatedPersonal },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error en PATCH /api/personal:", error);
    return NextResponse.json(
      { success: false, message: "Error al actualizar status." },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
