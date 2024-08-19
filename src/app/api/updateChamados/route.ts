import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function POST(req: NextRequest) {
  const { id, status } = await req.json();

  if (!id || !status) {
    return NextResponse.json(
      { error: "Chamado ID or status not provided." },
      { status: 400 }
    );
  }

  try {
    const updatedChamado = await prisma.chamado.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json(updatedChamado, { status: 200 });
  } catch (error) {
    console.error("Error updating chamado status:", error);
    return NextResponse.json(
      { error: "Failed to update chamado status." },
      { status: 500 }
    );
  }
}
