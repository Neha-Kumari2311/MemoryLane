import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendEmail, isEmailConfigured } from "@/lib/email";

export async function GET() {
  try {
    const now = new Date();

    // Find capsules that should unlock today and are not yet unlocked
    const capsules = await prisma.capsule.findMany({
      where: {
        unlockDate: { lte: now },
        unlocked: false,
      },
      include: { 
        recipients: true, 
        memories: true,
        creator: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    if (capsules.length === 0) {
      return NextResponse.json({ message: "No capsules to unlock today" });
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    for (const capsule of capsules) {
      // Send email to each recipient if email service is configured
      if (isEmailConfigured() && capsule.recipients.length > 0) {
        for (const recipient of capsule.recipients) {
          try {
            const link = `${baseUrl}/recipient/${recipient.token}`;

            const creatorName = capsule.creator?.name || "Someone";
            const creatorEmail = capsule.creator?.email || "";

            await sendEmail({
              to: recipient.email,
              subject: `Your MemoryLane capsule "${capsule.title}" is unlocked! 🎉`,
              html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                  <h2 style="color: #e63946; margin-bottom: 20px;">Your capsule is ready! 🎉</h2>
                  <p style="font-size: 16px; line-height: 1.6; color: #333;">
                    Hi there,
                  </p>
                  <p style="font-size: 16px; line-height: 1.6; color: #333;">
                    Great news! The time capsule that <strong>${creatorName}</strong>${creatorEmail ? ` (${creatorEmail})` : ''} created for you has unlocked today!
                  </p>
                  <div style="background-color: #f8f9fa; border-left: 4px solid #e63946; padding: 15px; margin: 20px 0;">
                    <p style="margin: 0; font-size: 18px; font-weight: bold; color: #333;">"${capsule.title}"</p>
                    <p style="margin: 10px 0 0 0; font-size: 14px; color: #666;">
                      Created by: <strong>${creatorName}</strong>
                    </p>
                  </div>
                  <p style="font-size: 16px; line-height: 1.6; color: #333;">
                    You can now view all the memories, messages, and special content that ${creatorName} has shared with you.
                  </p>
                  <div style="text-align: center; margin: 30px 0;">
                    <a href="${link}" style="display: inline-block; background-color: #e63946; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                      Open Capsule
                    </a>
                  </div>
                  <p style="font-size: 14px; line-height: 1.6; color: #666; margin-top: 30px;">
                    We hope you enjoy this special moment! 💝
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
            console.error(`Failed to send email to ${recipient.email}:`, emailError);
          }
        }
      }

      // Mark capsule as unlocked
      await prisma.capsule.update({
        where: { id: capsule.id },
        data: { unlocked: true },
      });
    }

    return NextResponse.json({ 
      message: "Capsules unlocked and recipients notified",
      unlockedCount: capsules.length 
    });
  } catch (error) {
    console.error("Unlock error:", error);
    return NextResponse.json({ error: "Failed to unlock capsules" }, { status: 500 });
  }
}
