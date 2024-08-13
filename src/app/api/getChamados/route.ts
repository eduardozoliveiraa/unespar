import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get('username');

  if (!username) {
    return NextResponse.json({ error: 'Username not provided.' }, { status: 400 });
  }

  try {
    // Fetch user role
    const user = await prisma.cadastro.findUnique({
      where: { name: username },
      select: { role: true, name: true }, // Inclua o campo 'role' aqui
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    }

    let chamados;
    if (user.role === 'ADMIN') {
      // Fetch all chamados for ADMIN
      chamados = await prisma.chamado.findMany({
        select: {
          id: true,
          motivo: true,
          setor: true,
          comment: true,
          files: true,
          username: true,
        },
      });
    } else {
      // Fetch chamados for the specific user
      chamados = await prisma.chamado.findMany({
        where: { username },
        select: {
          id: true,
          motivo: true,
          setor: true,
          comment: true,
          files: true,
          username: true,
        },
      });
    }

    return NextResponse.json(chamados, { status: 200 });
  } catch (error) {
    console.error('Error fetching chamados:', error);
    return NextResponse.json({ error: 'Failed to fetch chamados.' }, { status: 500 });
  }
}
