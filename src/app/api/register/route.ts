import { prisma } from '../../../../lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { name, surname, role } = await req.json();
    const password = 'unespar'; 

    if (!name || !surname || !role) {
      return NextResponse.json({ message: 'Todos os campos são obrigatórios' }, { status: 400 });
    }

    let login = `${name}.${surname}`;
    let exists = await prisma.cadastro.findUnique({
      where: { login },
    });

    if (exists) {
      let count = 1;
      while (exists) {
        login = `${name}.${surname}${count}`;
        exists = await prisma.cadastro.findUnique({
          where: { login },
        });
        count++;
      }
    }

    const newUser = await prisma.cadastro.create({
      data: {
        name,
        surname,
        login,
        password,
        role,
      },
    });

    return NextResponse.json({
      message: 'Cadastro realizado com sucesso',
      redirect: '/admin/CreateLogin',
    }, { status: 201 });
  } catch (error: any) {
    console.error('Erro ao fazer o cadastro:', error);  
    if (error.code === 'P2002') {
      return NextResponse.json({ message: 'Nome e Sobrenome já estão em uso' }, { status: 409 });
    }
    return NextResponse.json({ message: 'Erro no servidor', error: error.message }, { status: 500 });
  }
}

