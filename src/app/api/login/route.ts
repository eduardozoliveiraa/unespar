import { prisma } from '../../../../lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { name, password } = await req.json();

    if (!name || !password) {
      return NextResponse.json({ message: 'Login e senha são obrigatórios' }, { status: 400 });
    }

    const cadastro = await prisma.cadastro.findFirst({
      where: { login: name },
    });

    if (!cadastro) {
      return NextResponse.json({ message: 'Usuário não encontrado' }, { status: 401 });
    }

    if (password !== cadastro.password) {
      return NextResponse.json({ message: 'Senha incorreta' }, { status: 401 });
    }

    if (password === 'unespar') {
      return NextResponse.json({
        message: 'Redirecionando para mudança de senha',
        redirect: '/pages/MudarSenha', 
        role: cadastro.role, 
      }, { status: 200 });
    }

    return NextResponse.json({
      message: 'Login realizado com sucesso',
      redirect: '/pages/Pagprincipal',
      role: cadastro.role, 
    }, { status: 200 });
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    return NextResponse.json({ message: 'Erro no servidor' }, { status: 500 });
  }
}
