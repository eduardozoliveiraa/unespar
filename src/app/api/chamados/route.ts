import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { motivo, setor, comment, files, username } = await req.json();

    console.log('Received data:', { motivo, setor, comment, files, username });

    const user = await prisma.cadastro.findFirst({
      where: { login: username },
    });

    if (!user) {
      console.log('User not found for username:', username);
      return NextResponse.json({ error: 'Usuário não encontrado.' }, { status: 404 });
    }

    const chamado = await prisma.chamado.create({
      data: {
        motivo,
        setor,
        comment,
        files, 
        cadastro: {
          connect: { id: user.id },
        },
      },
    });

    console.log('Chamado created successfully:', chamado);
    return NextResponse.json(chamado, { status: 201 });
  } catch (error) {
    console.error('Error creating chamado:', error);
    return NextResponse.json({ error: 'Failed to create chamado.' }, { status: 500 });
  }
}
