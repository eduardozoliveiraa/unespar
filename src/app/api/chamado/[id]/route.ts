import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    const chamado = await prisma.chamado.findUnique({
      where: { id },
      include: {
        cadastro: {
          select: { login: true },
        },
      },
    });

    if (!chamado) {
      return NextResponse.json({ error: "Chamado not found." }, { status: 404 });
    }

    return NextResponse.json(chamado, { status: 200 });
  } catch (error) {
    console.error("Error fetching chamado details:", error);
    return NextResponse.json(
      { error: "Failed to fetch chamado details." },
      { status: 500 }
    );
  }
}
