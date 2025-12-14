import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req, { params }) {
  try {
    // In Next.js 15+, params is a Promise and must be awaited
    const resolvedParams = await params;
    const { token } = resolvedParams;

    // Find recipient by token
    const recipient = await prisma.recipient.findFirst({
      where: { token },
      include: {
        capsule: {
          include: {
            memories: true,
          },
        },
      },
    });

    if (!recipient) {
      return NextResponse.json({ error: "Invalid token" }, { status: 404 });
    }

    const capsule = recipient.capsule;

    return NextResponse.json({ capsule });
  } catch (error) {
    console.error("Recipient fetch error:", error);
    return NextResponse.json({ error: "Failed to load capsule" }, { status: 500 });
  }
}

