import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req, { params }) {
  try {
    const { email } = await req.json();

    const recipient = await prisma.recipient.create({
      data: {
        email,
        capsuleId: parseInt(params.id),
      },
    });

    return NextResponse.json({ message: "Recipient added", recipient });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to add recipient" }, { status: 500 });
  }
}
