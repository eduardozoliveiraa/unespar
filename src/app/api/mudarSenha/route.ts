import { prisma } from '../../../../lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { username, newPassword } = await req.json();  

    if (!newPassword || !username) {
      return NextResponse.json({ message: 'Nome de usuário e nova senha são obrigatórios' }, { status: 400 });
    }

    const updatedUser = await prisma.cadastro.update({
      where: { login: username },
      data: { password: newPassword },
    });

    if (!updatedUser) {
      return NextResponse.json({ message: 'Usuário não encontrado' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'Senha alterada com sucesso',
      redirect: '/pages/Pagprincipal',
    }, { status: 200 });

  } catch (error) {
    console.error('Erro ao alterar senha:', error);
    return NextResponse.json({ message: 'Erro no servidor ao tentar alterar senha' }, { status: 500 });
  }
}
