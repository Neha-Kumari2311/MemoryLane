import { Resend } from "resend";
import nodemailer from "nodemailer";

/**
 * Unified email sending utility
 * Supports Resend (recommended) and Gmail (fallback)
 */

// Check which email service to use (Resend is preferred)
const useResend = !!process.env.RESEND_API_KEY;
const useGmail = !useResend && process.env.EMAIL_USER && process.env.EMAIL_PASS;

let resendClient = null;
let gmailTransporter = null;

// Initialize Resend if API key is available
if (useResend) {
  if (!process.env.RESEND_FROM_EMAIL) {
    console.warn("⚠️  RESEND_FROM_EMAIL is not configured. Emails may fail to send.");
  }
  resendClient = new Resend(process.env.RESEND_API_KEY);
}

// Initialize Gmail transporter if credentials are available
if (useGmail) {
  gmailTransporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
}

/**
 * Send an email using the configured email service
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email address
 * @param {string} options.subject - Email subject
 * @param {string} options.html - HTML email content
 * @param {string} [options.from] - Sender email (optional, uses default)
 * @returns {Promise<Object>} - Result object with success status
 */
export async function sendEmail({ to, subject, html, from }) {
  if (!useResend && !useGmail) {
    throw new Error(
      "No email service configured. Please set RESEND_API_KEY and RESEND_FROM_EMAIL, or EMAIL_USER and EMAIL_PASS in environment variables."
    );
  }

  try {
    if (useResend) {
      // Use Resend (recommended)
      const fromEmail = from || process.env.RESEND_FROM_EMAIL;
      
      if (!fromEmail) {
        throw new Error(
          "RESEND_FROM_EMAIL is required for Resend email service. Please set it in your environment variables."
        );
      }

      const result = await resendClient.emails.send({
        from: fromEmail,
        to,
        subject,
        html,
      });

      return { success: true, service: "resend", data: result.data };
    } else {
      // Fallback to Gmail
      const fromEmail = from || `"MemoryLane" <${process.env.EMAIL_USER}>`;

      const result = await gmailTransporter.sendMail({
        from: fromEmail,
        to,
        subject,
        html,
      });

      return { success: true, service: "gmail", data: result };
    }
  } catch (error) {
    console.error("Email sending error:", error);
    throw error;
  }
}

/**
 * Check if email service is configured
 */
export function isEmailConfigured() {
  if (useResend) {
    return !!process.env.RESEND_FROM_EMAIL;
  }
  return useGmail;
}

/**
 * Get email service status for debugging
 */
export function getEmailStatus() {
  return {
    resendConfigured: useResend && !!process.env.RESEND_FROM_EMAIL,
    gmailConfigured: useGmail,
    activeService: useResend ? "resend" : useGmail ? "gmail" : "none",
    issues: {
      resendApiKeyMissing: !process.env.RESEND_API_KEY,
      resendFromEmailMissing: useResend && !process.env.RESEND_FROM_EMAIL,
      gmailUserMissing: !process.env.EMAIL_USER,
      gmailPasswordMissing: !process.env.EMAIL_PASS,
    },
  };
}
