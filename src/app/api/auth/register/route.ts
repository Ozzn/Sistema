import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

interface RequestBody {
  nick: string;
  nombres: string;
  apellidos: string;
  telefono: string;
  email: string;
  password: string;
  roleId: number;
  statusId: number;
}

// Endpoint para obtener los usuarios y los roles
export async function GET(): Promise<Response> {
  try {
    // Obtener los usuarios con los detalles del rol y el status
    const users = await prisma.user.findMany({
      include: {
        role: true,
        status: true,
      },
    });

    // Obtener los roles disponibles para el frontend
    const roles = await prisma.role.findMany();

    // Devolver tanto los usuarios como los roles
    return NextResponse.json({ users, roles }, { status: 200 });
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    return NextResponse.json({ error: "Error al obtener usuarios" }, { status: 500 });
  }
}

// Endpoint para registrar nuevos usuarios
export async function POST(req: Request): Promise<Response> {
  try {
    const body: RequestBody = await req.json();
    const { nick, nombres, apellidos, telefono, email, password, roleId, statusId } = body;

    if (!nick || !nombres || !apellidos || !telefono || !email || !password || !roleId || !statusId) {
      return NextResponse.json({ error: "Todos los campos son obligatorios" }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      return NextResponse.json({ error: "El correo ya está registrado" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        nick,
        nombres,
        apellidos,
        telefono,
        email,
        password: hashedPassword,
        roleId,
        statusId,
      },
    });

    return NextResponse.json({ message: "Usuario registrado con éxito" }, { status: 201 });
  } catch (error) {
    console.error("Error en el servidor:", error);
    return NextResponse.json({ error: "Error en el servidor" }, { status: 500 });
  }
}
