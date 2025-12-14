import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

// Add a collaborator to a capsule
export async function POST(req, { params }) {
  try {
    const user = await requireAuth();
    const resolvedParams = await params;
    const capsuleId = parseInt(resolvedParams.id);
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Verify capsule exists and user is the creator
    const capsule = await prisma.capsule.findUnique({
      where: { id: capsuleId },
    });

    if (!capsule) {
      return NextResponse.json({ error: "Capsule not found" }, { status: 404 });
    }

    if (capsule.creatorId !== user.id) {
      return NextResponse.json(
        { error: "Only the creator can add collaborators" },
        { status: 403 }
      );
    }

    // Find user by email
    const collaboratorUser = await prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() },
    });

    if (!collaboratorUser) {
      return NextResponse.json(
        { error: "User with this email not found" },
        { status: 404 }
      );
    }

    if (collaboratorUser.id === user.id) {
      return NextResponse.json(
        { error: "You cannot add yourself as a collaborator" },
        { status: 400 }
      );
    }

    // Check if already a collaborator
    const existingCollaborator = await prisma.collaborator.findUnique({
      where: {
        userId_capsuleId: {
          userId: collaboratorUser.id,
          capsuleId: capsuleId,
        },
      },
    });

    if (existingCollaborator) {
      return NextResponse.json(
        { error: "User is already a collaborator" },
        { status: 400 }
      );
    }

    // Add collaborator
    const collaborator = await prisma.collaborator.create({
      data: {
        userId: collaboratorUser.id,
        capsuleId: capsuleId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({
      message: "Collaborator added",
      collaborator,
    });
  } catch (error) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Add collaborator error:", error);
    return NextResponse.json(
      { error: "Failed to add collaborator" },
      { status: 500 }
    );
  }
}

// Get collaborators for a capsule
export async function GET(req, { params }) {
  try {
    await requireAuth();
    const resolvedParams = await params;
    const capsuleId = parseInt(resolvedParams.id);

    const collaborators = await prisma.collaborator.findMany({
      where: { capsuleId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({ collaborators });
  } catch (error) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json(
      { error: "Failed to load collaborators" },
      { status: 500 }
    );
  }
}

// Remove a collaborator
export async function DELETE(req, { params }) {
  try {
    const user = await requireAuth();
    const resolvedParams = await params;
    const capsuleId = parseInt(resolvedParams.id);
    const { userId } = await req.json();

    // Verify capsule exists and user is the creator
    const capsule = await prisma.capsule.findUnique({
      where: { id: capsuleId },
    });

    if (!capsule) {
      return NextResponse.json({ error: "Capsule not found" }, { status: 404 });
    }

    if (capsule.creatorId !== user.id) {
      return NextResponse.json(
        { error: "Only the creator can remove collaborators" },
        { status: 403 }
      );
    }

    await prisma.collaborator.delete({
      where: {
        userId_capsuleId: {
          userId: parseInt(userId),
          capsuleId: capsuleId,
        },
      },
    });

    return NextResponse.json({ message: "Collaborator removed" });
  } catch (error) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Remove collaborator error:", error);
    return NextResponse.json(
      { error: "Failed to remove collaborator" },
      { status: 500 }
    );
  }
}
