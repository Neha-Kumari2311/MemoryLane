import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { sendEmail, isEmailConfigured } from "@/lib/email";

export async function GET() {
  try {
    const user = await requireAuth();
    // Get capsules where user is creator or collaborator
    const capsules = await prisma.capsule.findMany({
      where: {
        OR: [
          { creatorId: user.id },
          { collaborators: { some: { userId: user.id } } }
        ]
      },
      include: { 
        memories: true, 
        recipients: true,
        collaborators: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              }
            }
          }
        }
      },
      orderBy: { unlockDate: "desc" },
    });
    
    // requireAuth already returns user with name and email
    return NextResponse.json({ 
      capsules,
      user: {
        name: user.name,
        email: user.email,
      },
      userName: user.name 
    });
  } catch (error) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Failed to load capsules" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const user = await requireAuth();
    const { title, unlockDate, letter, theme, recipients, memories } = await req.json();

    if (!title || !unlockDate) {
      return NextResponse.json(
        { error: "Title and unlock date are required" },
        { status: 400 }
      );
    }

    // Create capsule with letter and theme
    const capsule = await prisma.capsule.create({
      data: {
        title,
        unlockDate: new Date(unlockDate),
        letter: letter || null,
        theme: theme || null,
        creatorId: user.id,
        memories: memories && memories.length > 0 ? {
          create: memories.map((m) => ({
            type: m.type,
            contentUrl: m.contentUrl,
            caption: m.caption || null,
            addedById: user.id,
          })),
        } : undefined,
        recipients: recipients && recipients.length > 0 ? {
          create: recipients.map((email) => ({
            email,
          })),
        } : undefined,
      },
      include: { 
        memories: true, 
        recipients: true,
        creator: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    // Send emails to recipients if configured
    if (capsule.recipients && capsule.recipients.length > 0 && isEmailConfigured()) {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

      for (const recipient of capsule.recipients) {
        const link = `${baseUrl}/recipient/${recipient.token}`;
        
        try {
          const creatorName = capsule.creator?.name || "Someone";
          const creatorEmail = capsule.creator?.email || "";
          const unlockDateFormatted = new Date(capsule.unlockDate).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          });

          await sendEmail({
            to: recipient.email,
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
          console.error(`Failed to send email to ${recipient.email}:`, emailError);
          // Continue even if email fails
        }
      }
    }

    return NextResponse.json({ message: "Capsule created", capsule });
  } catch (error) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Capsule creation error:", error);
    return NextResponse.json({ error: "Failed to create capsule" }, { status: 500 });
  }
}
