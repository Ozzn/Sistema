import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // Asegúrate de que esta ruta esté correcta

// Configuración de encabezados CORS
const headers = {
    "Access-Control-Allow-Origin": "*", // O especifica el dominio del frontend
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
};

// Obtener todos los departamentos
export async function GET() {
    try {
        // Obtener todos los departamentos desde la base de datos
        const departamentos = await prisma.departamento.findMany({
            select: {
                id: true,
                nombre: true,
            },
        });

        // Devolver la respuesta con los departamentos
        return NextResponse.json(departamentos, { headers });
    } catch (error) {
        console.error("Error al obtener departamentos:", error);
        return NextResponse.json(
            { error: "Error al obtener departamentos" },
            { status: 500, headers }
        );
    }
}

// Crear un nuevo departamento
export async function POST(request: Request) {
    try {
        // Extraer el nombre del departamento del cuerpo de la solicitud
        const { nombre } = await request.json();

        // Validar que el nombre esté presente
        if (!nombre || typeof nombre !== "string") {
            return NextResponse.json(
                { error: "El nombre del departamento es requerido" },
                { status: 400, headers }
            );
        }

        // Verificar si el departamento ya existe
        const departamentoExistente = await prisma.departamento.findFirst({
            where: { nombre },
        });

        if (departamentoExistente) {
            return NextResponse.json(
                { error: "El departamento ya existe" },
                { status: 409, headers }
            );
        }

        // Crear el nuevo departamento en la base de datos
        const nuevoDepartamento = await prisma.departamento.create({
            data: { nombre },
        });

        // Devolver la respuesta con el nuevo departamento creado
        return NextResponse.json(nuevoDepartamento, { status: 201, headers });
    } catch (error) {
        console.error("Error al agregar departamento:", error);
        return NextResponse.json(
            { error: "Error interno del servidor" },
            { status: 500, headers }
        );
    }
}

// Manejar solicitudes OPTIONS para CORS
export async function OPTIONS() {
    return NextResponse.json({}, { headers });
}