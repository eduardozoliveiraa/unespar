import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const chamados = await prisma.chamado.findMany({
      select: {
        id: true,
        motivo: true,
        setor: true,
        comment: true,
        files: true,
        username: true, 
      }
    });

    return NextResponse.json(chamados, { status: 200 });
  } catch (error) {
    console.error('Error fetching chamados:', error);
    return NextResponse.json({ error: 'Failed to fetch chamados.' }, { status: 500 });
  }
}
