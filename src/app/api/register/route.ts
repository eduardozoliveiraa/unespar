import { prisma } from '../../../../lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { name, surname, role } = await req.json();
    const password = 'unespar'; 

    if (!name || !surname || !role) {
      return NextResponse.json({ message: 'Todos os campos são obrigatórios' }, { status: 400 });
    }

    const login = `${name}.${surname}`;

    const newUser = await prisma.cadastro.create({
      data: {
        name,
        surname,
        password,
        role,
      },
    });

    return NextResponse.json({
      message: 'Cadastro realizado com sucesso',
      redirect: '/admin/CreateLogin',
    }, { status: 201 });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ message: 'Nome e Sobrenome já estão em uso' }, { status: 409 });
    }
    console.error('Erro ao fazer o cadastro:', error);
    return NextResponse.json({ message: 'Erro no servidor', error: error.message }, { status: 500 });
  }
}
