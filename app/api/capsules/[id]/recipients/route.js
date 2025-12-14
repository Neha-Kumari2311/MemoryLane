import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { sendEmail, isEmailConfigured } from "@/lib/email";

export async function POST(req, { params }) {
  try {
    const user = await requireAuth();
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // In Next.js 15+, params is a Promise and must be awaited
    const resolvedParams = await params;

    // Verify capsule exists and user owns it
    const capsule = await prisma.capsule.findUnique({
      where: { id: parseInt(resolvedParams.id) },
      include: {
        creator: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    if (!capsule) {
      return NextResponse.json({ error: "Capsule not found" }, { status: 404 });
    }

    if (capsule.creatorId !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Create recipient (token is auto-generated as UUID by schema)
    const recipient = await prisma.recipient.create({
      data: {
        email,
        capsuleId: parseInt(resolvedParams.id),
      },
    });

    // Send email if email service is configured
    if (isEmailConfigured()) {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
        const link = `${baseUrl}/recipient/${recipient.token}`;

        const creatorName = capsule.creator?.name || "Someone";
        const creatorEmail = capsule.creator?.email || "";
        const unlockDateFormatted = new Date(capsule.unlockDate).toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        });

        await sendEmail({
          to: email,
          subject: `${creatorName} shared a MemoryLane capsule with you`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h2 style="color: #e63946; margin-bottom: 20px;">MemoryLane Invitation</h2>
              <p style="font-size: 16px; line-height: 1.6; color: #333;">
                Hi there,
              </p>
              <p style="font-size: 16px; line-height: 1.6; color: #333;">
                <strong>${creatorName}</strong>${creatorEmail ? ` (${creatorEmail})` : ''} has created a special time capsule and added you as a recipient!
              </p>
              <div style="background-color: #f8f9fa; border-left: 4px solid #e63946; padding: 15px; margin: 20px 0;">
                <p style="margin: 0; font-size: 18px; font-weight: bold; color: #333;">"${capsule.title}"</p>
                <p style="margin: 10px 0 0 0; font-size: 14px; color: #666;">
                  Unlocks on: <strong>${unlockDateFormatted}</strong>
                </p>
              </div>
              <p style="font-size: 16px; line-height: 1.6; color: #333;">
                This capsule will remain locked until the unlock date. When it opens, you'll be able to view the memories and messages inside.
              </p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${link}" style="display: inline-block; background-color: #e63946; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                  View Capsule
                </a>
              </div>
              <p style="font-size: 14px; line-height: 1.6; color: #666; margin-top: 30px;">
                You can bookmark this link to access the capsule when it unlocks. We'll also send you a reminder when it's ready!
              </p>
              <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
              <p style="font-size: 12px; color: #999; text-align: center;">
                This email was sent by MemoryLane. If you have any questions, please contact ${creatorEmail || 'the capsule creator'}.
              </p>
            </div>
          `,
        });

        // Mark recipient as notified
        await prisma.recipient.update({
          where: { id: recipient.id },
          data: { notified: true },
        });
      } catch (emailError) {
        console.error("Failed to send email:", emailError);
        // Continue even if email fails
      }
    }

    return NextResponse.json({ message: "Recipient added", recipient });
  } catch (error) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Recipient creation error:", error);
    return NextResponse.json({ error: "Failed to add recipient" }, { status: 500 });
  }
}
