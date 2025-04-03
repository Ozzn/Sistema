import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';  // Asegúrate de que esta ruta esté correcta

// Obtener todos los cargos
export async function GET() {
    try {
        const cargos = await prisma.cargo.findMany();  // Obtener todos los cargos de la base de datos
        return NextResponse.json(cargos, { status: 200 });
    } catch (error) {
        console.error("Error al obtener cargos:", error);
        return NextResponse.json({ error: "Error al obtener cargos" }, { status: 500 });
    }
}

// Crear un nuevo cargo
export async function POST(request: Request) {
    try {
        const { nombre } = await request.json();

        // Crear el nuevo cargo en la base de datos
        const nuevoCargo = await prisma.cargo.create({
            data: {
                nombre,
            },
        });

        return NextResponse.json(nuevoCargo, { status: 201 });
    } catch (error) {
        console.error("Error al agregar cargo:", error);
        return NextResponse.json({ error: "Error al agregar cargo" }, { status: 500 });
    }
}
