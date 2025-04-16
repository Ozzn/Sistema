// /app/api/mantenimientos/mis-trabajos/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions"; // Asegúrate de tenerlo correctamente configurado
import prisma from "@/lib/prisma"; // Tu cliente Prisma

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const trabajos = await prisma.mantenimiento.findMany({
    where: {
      mecanicoId: Number(session.user.id),
    },
    include: {
      unidad: {
        include: {
          marca: true,
          modelo: true,
        },
      },
      operador: true,
    },
    orderBy: {
      fechaEntrada: 'desc',
    }
  });

  return NextResponse.json(trabajos);
}
