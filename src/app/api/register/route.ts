import { prisma } from '../../../../lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { name, password } = await req.json();

    if (!name || !password) {
      return NextResponse.json({ message: 'Nome e senha são obrigatórios' }, { status: 400 });
    }

    const cadastro = await prisma.cadastro.findFirst({
      where: { name },
    });

    if (!cadastro) {
      return NextResponse.json({ message: 'Usuário não encontrado' }, { status: 401 });
    }

    if (password !== cadastro.password) {
      return NextResponse.json({ message: 'Senha incorreta' }, { status: 401 });
    }

    return NextResponse.json({ message: 'Login realizado com sucesso', redirect: '/pages/Pagprincipal' }, { status: 200 });
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    return NextResponse.json({ message: 'Erro no servidor' }, { status: 500 });
  }
}