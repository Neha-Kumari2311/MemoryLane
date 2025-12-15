export const runtime = "nodejs";
export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { sendEmail, isEmailConfigured, getEmailStatus } from "@/lib/email";

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
        memories: {
          orderBy: { createdAt: 'asc' }
        },
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
    console.error("❌ Failed to load capsules:", error);
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

    console.log(`📦 Creating new capsule "${title}" by user ${user.id}`);

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

    console.log(`✅ Capsule ${capsule.id} created successfully`);
    console.log(`📧 Email configuration status:`, getEmailStatus());

    // Send emails to recipients if configured
    if (capsule.recipients && capsule.recipients.length > 0) {
      console.log(`📨 Attempting to send emails to ${capsule.recipients.length} recipients`);
      
      if (!isEmailConfigured()) {
        console.error("❌ Email service not configured!");
        console.error("Configuration status:", getEmailStatus());
        // Still return success for capsule creation, but warn about emails
        return NextResponse.json({ 
          message: "Capsule created but email service not configured", 
          capsule,
          emailWarning: "Emails could not be sent - service not configured"
        });
      }

      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
      console.log(`🌐 Base URL: ${baseUrl}`);

      const emailResults = [];

      for (const recipient of capsule.recipients) {
        const link = `${baseUrl}/recipient/${recipient.token}`;
        let emailSent = false;
        
        try {
          const creatorName = capsule.creator?.name || "Someone";
          const creatorEmail = capsule.creator?.email || "";
          const unlockDateFormatted = new Date(capsule.unlockDate).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          });

          console.log(`📧 Sending email to: ${recipient.email}`);
          console.log(`📧 From: ${process.env.RESEND_FROM_EMAIL}`);

          const emailResult = await sendEmail({
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

          // Check if email was actually sent successfully
          if (emailResult && emailResult.success) {
            emailSent = true;
            console.log(`✅ Email sent successfully to ${recipient.email}`);
            emailResults.push({ 
              email: recipient.email, 
              success: true, 
              service: emailResult.service 
            });
          } else {
            console.warn(`⚠️ Email sending returned but success was false for ${recipient.email}`);
            emailResults.push({ 
              email: recipient.email, 
              success: false, 
              error: "Email sending returned unsuccessful status" 
            });
          }
        } catch (emailError) {
          console.error(`❌ Failed to send email to ${recipient.email}`);
          console.error("Error message:", emailError.message);
          
          emailResults.push({ 
            email: recipient.email, 
            success: false, 
            error: emailError.message 
          });
        }
        
        // Update database ONLY if email was actually sent
        try {
          await prisma.recipient.update({
            where: { id: recipient.id },
            data: { notified: emailSent },
          });
          
          if (emailSent) {
            console.log(`✅ Marked ${recipient.email} as notified in database`);
          } else {
            console.log(`❌ Marked ${recipient.email} as NOT notified in database (email failed)`);
          }
        } catch (dbError) {
          console.error(`❌ Failed to update notification status for ${recipient.email}:`, dbError);
        }
      }

      console.log("📊 Email sending summary:", {
        total: emailResults.length,
        successful: emailResults.filter(r => r.success).length,
        failed: emailResults.filter(r => !r.success).length,
      });

      // Return success with email status
      return NextResponse.json({ 
        message: "Capsule created", 
        capsule,
        emailStatus: {
          sent: emailResults.filter(r => r.success).length,
          failed: emailResults.filter(r => !r.success).length,
          details: emailResults
        }
      });
    }

    console.log(`✅ Capsule created with no recipients`);
    return NextResponse.json({ message: "Capsule created", capsule });
  } catch (error) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("❌ Capsule creation error:", error);
    console.error("Error details:", error.message);
    return NextResponse.json({ 
      error: "Failed to create capsule",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
}