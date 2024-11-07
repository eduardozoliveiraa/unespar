import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function GET() {
  try {
    // Busca todos os chamados diretamente do banco de dados
    const chamados = await prisma.chamado.findMany({
      include: {
        cadastro: {
          select: { login: true }, // Inclui o login do usuário associado ao chamado
        },
      },
    });

    // Mapeia os chamados para a estrutura de resposta desejada
    const response = chamados.map((chamado) => ({
      id: chamado.id,
      motivo: chamado.motivo,
      setor: chamado.setor,
      comment: chamado.comment,
      files: chamado.files,
      username: chamado.cadastro.login, // Nome do usuário associado ao chamado
      status: chamado.status,
    }));

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Error fetching chamados:", error);
    return NextResponse.json(
      { error: "Failed to fetch chamados." },
      { status: 500 }
    );
  }
}
