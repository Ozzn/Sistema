// app/api/notificacion/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { phone, message } = body;

    // Reemplaza con tu número de teléfono y tu API key real de CallMeBot
    const whatsappNumber = 584127747514; // debe incluir el código de país, ej: +584241234567
    const apiKey = '4531681'; // copia aquí tu API key

    const url = `https://api.callmebot.com/whatsapp.php?phone=${encodeURIComponent(
      whatsappNumber
    )}&text=${encodeURIComponent(message)}&apikey=${apiKey}`;

    const response = await fetch(url);

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: 'No se pudo enviar el mensaje' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
