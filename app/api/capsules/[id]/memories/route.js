import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function POST(req, { params }) {
  try {
    const user = await requireAuth();
    const requestBody = await req.json();
    const { type, contentUrl, caption } = requestBody;

    if (!type) {
      return NextResponse.json(
        { error: "Type is required" },
        { status: 400 }
      );
    }

    // In Next.js 15+, params is a Promise and must be awaited
    const resolvedParams = await params;

    // Verify capsule exists and user is creator or collaborator
    const capsule = await prisma.capsule.findUnique({
      where: { id: parseInt(resolvedParams.id) },
      include: {
        collaborators: true,
      },
    });

    if (!capsule) {
      return NextResponse.json({ error: "Capsule not found" }, { status: 404 });
    }

    // Check if user is creator or collaborator
    const isCreator = capsule.creatorId === user.id;
    const isCollaborator = capsule.collaborators.some(c => c.userId === user.id);
    
    if (!isCreator && !isCollaborator) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const memoryData = {
      type,
      capsuleId: parseInt(resolvedParams.id),
      addedById: user.id, // Track who added this memory
    };

    // Only include contentUrl if it has a value
    if (contentUrl && contentUrl.trim()) {
      memoryData.contentUrl = contentUrl.trim();
    }

    // Only include caption if it has a value
    if (caption && caption.trim()) {
      memoryData.caption = caption.trim();
    }

    const memory = await prisma.memory.create({
      data: memoryData,
    });

    return NextResponse.json({ message: "Memory added", memory });
  } catch (error) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Memory creation error:", error);
    return NextResponse.json({ error: "Failed to add memory" }, { status: 500 });
  }
}
