import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function GET(req, { params }) {
  try {
    // In Next.js 15+, params is a Promise and must be awaited
    const resolvedParams = await params;
    const idParam = resolvedParams?.id;
    
    if (!idParam) {
      return NextResponse.json({ error: "Capsule ID is required" }, { status: 400 });
    }
    
    const user = await requireAuth();
    const parsedId = parseInt(Array.isArray(idParam) ? idParam[0] : idParam);
    
    if (isNaN(parsedId)) {
      return NextResponse.json({ error: "Invalid capsule ID" }, { status: 400 });
    }

    const capsule = await prisma.capsule.findUnique({
      where: { id: parsedId },
      include: { memories: true, recipients: true },
    });

    if (!capsule) {
      return NextResponse.json({ error: "Capsule not found" }, { status: 404 });
    }

    // Only creator can view capsule details
    if (capsule.creatorId !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    return NextResponse.json({ capsule });
  } catch (error) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Failed to load capsule" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    // In Next.js 15+, params is a Promise and must be awaited
    const resolvedParams = await params;
    const idParam = resolvedParams?.id;
    
    if (!idParam) {
      return NextResponse.json({ error: "Capsule ID is required" }, { status: 400 });
    }
    
    const user = await requireAuth();
    const parsedId = parseInt(Array.isArray(idParam) ? idParam[0] : idParam);
    
    if (isNaN(parsedId)) {
      return NextResponse.json({ error: "Invalid capsule ID" }, { status: 400 });
    }

    // Verify capsule exists and user owns it
    const capsule = await prisma.capsule.findUnique({
      where: { id: parsedId },
      include: { memories: true, recipients: true },
    });

    if (!capsule) {
      return NextResponse.json({ error: "Capsule not found" }, { status: 404 });
    }

    // Only creator can delete capsule
    if (capsule.creatorId !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Delete related records first to avoid foreign key constraint issues
    // Delete memories first
    if (capsule.memories && capsule.memories.length > 0) {
      await prisma.memory.deleteMany({
        where: { capsuleId: parsedId },
      });
    }

    // Delete recipients
    if (capsule.recipients && capsule.recipients.length > 0) {
      await prisma.recipient.deleteMany({
        where: { capsuleId: parsedId },
      });
    }

    // Now delete the capsule
    await prisma.capsule.delete({
      where: { id: parsedId },
    });

    return NextResponse.json({ message: "Capsule deleted successfully" });
  } catch (error) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Capsule deletion error:", error);
    return NextResponse.json({ error: "Failed to delete capsule" }, { status: 500 });
  }
}
