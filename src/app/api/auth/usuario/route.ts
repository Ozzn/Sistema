import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET: Obtener personal (solo incluye ID de status)
export async function GET() {
  try {
    const personal = await prisma.personal.findMany({
      select: {
        id: true,
        nick: true,
        nombres: true,
        apellidos: true,
        telefono: true,
        email: true,
        statusId: true, // Solo el ID, no la relación completa
        departamento: {
          select: {
            id: true,
            nombre: true
          }
        },
        cargo: {
          select: {
            id: true,
            nombre: true
          }
        }
      }
    });

    return NextResponse.json(personal);
  } catch (error) {
    console.error('Error al obtener personal:', error);
    return NextResponse.json(
      { error: 'Error al obtener personal' },
      { status: 500 }
    );
  }
}

// POST: Crear nuevo personal (asigna el id de "Operativo" automáticamente)
export async function POST(request: Request) {
  try {
    const { nick, nombres, apellidos, telefono, email, departamentoId, cargoId } = await request.json();

    // Validación de campos obligatorios
    if (!nick || !nombres || !apellidos || !departamentoId || !cargoId) {
      return NextResponse.json(
        { error: 'Campos obligatorios faltantes' },
        { status: 400 }
      );
    }

    // Asegurarse de que los ids sean números
    const departamentoIdNumber = Number(departamentoId);
    const cargoIdNumber = Number(cargoId);

    // Verificar que la conversión a números es exitosa
    if (isNaN(departamentoIdNumber) || isNaN(cargoIdNumber)) {
      return NextResponse.json(
        { error: 'El ID de departamento o cargo no es válido' },
        { status: 400 }
      );
    }

    // Obtener solo el id de "Operativo" (sin obtener el nombre)
    const statusOperativo = await prisma.status.findUnique({
      where: { nombre: 'Operativo' },
      select: { id: true }  // Solo obtener el id
    });

    if (!statusOperativo) {
      return NextResponse.json(
        { error: 'El estado "Operativo" no existe en la base de datos' },
        { status: 400 }
      );
    }

    // Crear nuevo personal
    const nuevoPersonal = await prisma.personal.create({
      data: {
        nick,
        nombres,
        apellidos,
        telefono: telefono || null,
        email: email || null,
        statusId: statusOperativo.id, // Asignar solo el id de "Operativo"
        departamentoId: departamentoIdNumber,
        cargoId: cargoIdNumber,
      },
      select: {
        id: true,
        nick: true,
        nombres: true,
        apellidos: true,
        statusId: true,
        departamento: {
          select: {
            id: true,
            nombre: true
          }
        },
        cargo: {
          select: {
            id: true,
            nombre: true
          }
        }
      }
    });

    return NextResponse.json(nuevoPersonal, { status: 201 });
  } catch (error) {
    console.error('Error al crear personal:', error);
    return NextResponse.json(
      { error: 'Error al crear personal' },
      { status: 500 }
    );
  }
}

// PUT: Actualizar solo el statusId
export async function PUT(request: Request) {
  try {
    const { id, statusId } = await request.json();

    // Validación de campos obligatorios y valores permitidos
    if (!id || (statusId !== 1 && statusId !== 2)) {
      return NextResponse.json(
        { error: 'ID inválido o statusId debe ser 1 (Activo) o 2 (Inactivo)' },
        { status: 400 }
      );
    }

    // Actualizar el estado del personal
    const personalActualizado = await prisma.personal.update({
      where: { id: Number(id) },
      data: { statusId: Number(statusId) },
      select: {
        id: true,
        statusId: true,
        nombres: true,
        apellidos: true
      }
    });

    return NextResponse.json(personalActualizado);
  } catch (error) {
    console.error('Error al actualizar status:', error);
    return NextResponse.json(
      { error: 'Error al actualizar status' },
      { status: 500 }
    );
  }
}
