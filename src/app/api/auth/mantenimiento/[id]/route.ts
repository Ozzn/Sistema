import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Función para extraer el ID desde la URL
function getIdFromUrl(req: NextRequest): number | null {
  const segments = req.nextUrl.pathname.split('/');
  const idString = segments[segments.length - 1];
  const id = parseInt(idString);
  return isNaN(id) ? null : id;
}

// Obtener mantenimiento
export async function GET(req: NextRequest) {
  try {
    const id = getIdFromUrl(req);
    if (!id) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
    }

    const mantenimiento = await prisma.mantenimiento.findUnique({
      where: { id },
      include: {
        unidad: {
          include: {
            marca: true,
            modelo: true,
          },
        },
      },
    });

    if (!mantenimiento) {
      return NextResponse.json({ error: 'Mantenimiento no encontrado' }, { status: 404 });
    }

    return NextResponse.json(mantenimiento);
  } catch (error) {
    console.error('Error al obtener mantenimiento:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

// Actualizar mantenimiento
export async function PUT(req: NextRequest) {
  try {
    const id = getIdFromUrl(req);
    if (!id) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
    }

    const data = await req.json();

    const actualizado = await prisma.mantenimiento.update({
      where: { id },
      data,
      include: {
        unidad: {
          include: {
            marca: true,
            modelo: true,
          },
        },
      },
    });

    return NextResponse.json(actualizado);
  } catch (error) {
    console.error('Error al actualizar mantenimiento:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
