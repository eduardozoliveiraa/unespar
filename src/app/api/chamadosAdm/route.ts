import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get("username");

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

    let chamados;
    if (user.role === "ADMIN") {
      chamados = await prisma.chamado.findMany({
        include: {
          cadastro: {
            select: { login: true }, 
          },
        },
      });
    } else {
      chamados = await prisma.chamado.findMany({
        where: { cadastroId: user.id },
        include: {
          cadastro: {
            select: { login: true }, 
          },
        },
      });
    }

    const response = chamados.map((chamado) => ({
      id: chamado.id,
      motivo: chamado.motivo, 
      setor: chamado.setor,
      comment: chamado.comment,
      files: chamado.files,
      username: chamado.cadastro.login, 
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
