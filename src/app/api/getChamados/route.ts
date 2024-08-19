import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function POST(req: NextRequest) {
  const { username } = await req.json();

  if (!username) {
    return NextResponse.json(
      { error: "Username not provided." },
      { status: 400 }
    );
  }

  try {
    const user = await prisma.cadastro.findFirst({
      where: { login: username },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    const chamados = user.role === "ADMIN"
      ? await prisma.chamado.findMany({
          include: { cadastro: { select: { login: true } } },
        })
      : await prisma.chamado.findMany({
          where: { cadastroId: user.id },
          include: { cadastro: { select: { login: true } } },
        });

    const response = chamados.map((chamado) => ({
      id: chamado.id,
      motivo: chamado.motivo,
      setor: chamado.setor,
      comment: chamado.comment,
      files: chamado.files,
      username: chamado.cadastro.login,
      status: chamado.status
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
