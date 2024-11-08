import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function GET() {
  try {
    const chamados = await prisma.chamado.findMany({
      include: {
        cadastro: {
          select: { login: true }, 
        },
      },
    });

    const response = chamados.map((chamado) => ({
      id: chamado.id,
      motivo: chamado.motivo,
      setor: chamado.setor,
      comment: chamado.comment,
      files: chamado.files,
      username: chamado.cadastro.login, 
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
