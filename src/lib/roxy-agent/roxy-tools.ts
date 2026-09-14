// src/lib/roxy-agent/roxy-tools.ts
import fs from "node:fs";
import path from "node:path";
import { tool } from "ai";
import { Resend } from "resend";
import { z } from "zod";
import { ROXY_PROFILE } from "./roxy-knowledge";

const RESEND_API_KEY = process.env.RESEND_API_KEY || "";
const resend = new Resend(RESEND_API_KEY);

const ROXY_PRIMARY_EMAIL = process.env.ROXY_EMAIL || ROXY_PROFILE.email;
const SENDER_EMAIL =
  process.env.RESEND_FROM_EMAIL || "Roxy Agent <roxy@wekraft.xyz>";

export const roxyTools = {
  contactRoxy: tool({
    description:
      "Send a message and contact details from a portfolio visitor directly to Ronit Rai (ROX) via email.",
    inputSchema: z.object({
      visitorEmail: z
        .string()
        .email()
        .describe("The email address of the visitor wanting to reach Ronit"),
      visitorName: z
        .string()
        .optional()
        .describe("The name of the visitor or organization reaching out"),
      subject: z
        .string()
        .optional()
        .describe("Short topic or subject of the message"),
      message: z
        .string()
        .describe(
          "The detailed message, inquiry, project proposal, or query for Ronit"
        ),
    }),
    execute: async ({ visitorEmail, visitorName, subject, message }) => {
      console.log("[Roxy Tool] contactRoxy invoked:", {
        visitorEmail,
        visitorName,
        subject,
      });

      const senderDisplayName = visitorName || "A Portfolio Visitor";
      const emailSubject =
        subject || `New Portfolio Inquiry from ${senderDisplayName}`;

      try {
        const emailHtml = `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background-color: #fcfcfc; border: 1px solid #eaeaea; border-radius: 12px;">
            <div style="border-bottom: 2px solid #123826; padding-bottom: 12px; margin-bottom: 20px;">
              <h2 style="color: #123826; margin: 0; font-size: 20px;">⚡ New Message from Roxy Agent</h2>
            </div>
            
            <p style="font-size: 15px; color: #333; line-height: 1.6;">
              You received a new inquiry from your portfolio's AI Agent:
            </p>
            
            <div style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 16px 0;">
              <p style="margin: 0 0 8px 0; font-size: 14px; color: #64748b;"><strong>Sender Name:</strong> ${senderDisplayName}</p>
              <p style="margin: 0 0 8px 0; font-size: 14px; color: #64748b;"><strong>Sender Email:</strong> <a href="mailto:${visitorEmail}" style="color: #059669; text-decoration: none;">${visitorEmail}</a></p>
              <p style="margin: 0; font-size: 14px; color: #64748b;"><strong>Received At:</strong> ${new Date().toLocaleString()}</p>
            </div>

            <div style="background-color: #f8fafc; border-left: 4px solid #123826; padding: 16px; border-radius: 4px; margin: 16px 0;">
              <h4 style="margin: 0 0 8px 0; color: #1e293b; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em;">Message</h4>
              <p style="margin: 0; font-size: 15px; color: #0f172a; line-height: 1.6; white-space: pre-wrap;">${message}</p>
            </div>

            <p style="font-size: 13px; color: #94a3b8; margin-top: 24px; text-align: center;">
              Sent via Roxy AI Agent • Portfolio System
            </p>
          </div>
        `;

        const response = await resend.emails.send({
          from: SENDER_EMAIL,
          to: [ROXY_PRIMARY_EMAIL],
          replyTo: visitorEmail,
          subject: emailSubject,
          html: emailHtml,
        });

        if (response.error) {
          console.error(
            "[Roxy Tool] Resend error in contactRoxy:",
            response.error
          );
          return {
            success: false,
            message: `Failed to send email: ${response.error.message}`,
          };
        }

        return {
          success: true,
          message: `Your message has been delivered directly to Ronit Rai's inbox (${ROXY_PRIMARY_EMAIL}). He will get back to you at ${visitorEmail} soon!`,
          emailId: response.data?.id,
        };
      } catch (err: any) {
        console.error("[Roxy Tool] Exception in contactRoxy:", err);
        return {
          success: false,
          message: `Error sending message: ${err?.message || "Unknown error"}`,
        };
      }
    },
  }),

  sendRoxyDetails: tool({
    description:
      "Email Ronit Rai's (ROX) complete portfolio dossier, resume PDF attachment, social profiles, and contact details to a visitor's specified email address.",
    inputSchema: z.object({
      recipientEmail: z
        .string()
        .email()
        .describe("The email address of the person who wants to receive Roxy's complete details and resume"),
      recipientName: z
        .string()
        .optional()
        .describe("The recipient's name or company name"),
      note: z
        .string()
        .optional()
        .describe("Optional custom note or context to include in the email"),
    }),
    execute: async ({ recipientEmail, recipientName, note }) => {
      console.log("[Roxy Tool] sendRoxyDetails invoked:", {
        recipientEmail,
        recipientName,
      });

      const greetingName = recipientName ? ` ${recipientName}` : "";

      // Load resume PDF buffer if present
      const attachments: any[] = [];
      try {
        const resumePath = path.join(process.cwd(), "public", "resume.pdf");
        if (fs.existsSync(resumePath)) {
          const resumeBuffer = fs.readFileSync(resumePath);
          attachments.push({
            filename: "Ronit_Rai_Resume.pdf",
            content: resumeBuffer,
          });
        }
      } catch (attachErr) {
        console.warn("[Roxy Tool] Could not read resume.pdf for attachment:", attachErr);
      }

      try {
        const emailHtml = `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 28px; background-color: #123826; color: #ffffff; border-radius: 16px;">
            <div style="text-align: center; padding-bottom: 20px; border-bottom: 1px solid rgba(255,255,255,0.15);">
              <span style="background-color: #c5eb35; color: #141b16; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.15em; padding: 4px 12px; border-radius: 9999px;">
                AI Engineer Dossier &amp; Resume
              </span>
              <h1 style="color: #ffffff; margin: 16px 0 6px 0; font-size: 26px; letter-spacing: -0.02em;">
                Ronit Rai (ROX)
              </h1>
              <p style="color: #c5eb35; margin: 0; font-size: 14px; font-weight: 500;">
                Founder @ VRSA Analytics • Full-Stack AI Engineer
              </p>
            </div>

            <div style="padding: 20px 0;">
              <p style="font-size: 15px; line-height: 1.6; color: #e2e8f0; margin: 0 0 16px 0;">
                Hello${greetingName},
              </p>
              <p style="font-size: 14px; line-height: 1.6; color: #cbd5e1; margin: 0 0 16px 0;">
                Thank you for your interest! Attached to this email is <strong>Ronit Rai's official Resume PDF (Ronit_Rai_Resume.pdf)</strong> along with his complete profile, direct links, and engineering dossier.
              </p>

              ${
                note
                  ? `<div style="background: rgba(255,255,255,0.08); border-left: 3px solid #c5eb35; padding: 12px 16px; border-radius: 6px; margin: 16px 0;">
                      <p style="margin: 0; font-size: 13px; color: #e2e8f0;"><em>"${note}"</em></p>
                    </div>`
                  : ""
              }

              <div style="background-color: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 18px; margin: 20px 0;">
                <h3 style="margin: 0 0 12px 0; font-size: 13px; text-transform: uppercase; letter-spacing: 0.1em; color: #c5eb35;">
                  ⚡ Direct Links &amp; Resume
                </h3>
                <ul style="list-style: none; padding: 0; margin: 0; font-size: 14px; line-height: 2;">
                  <li>📎 <strong>Resume Attachment:</strong> <em>Ronit_Rai_Resume.pdf</em> (attached below)</li>
                  <li>📧 <strong>Email:</strong> <a href="mailto:${ROXY_PRIMARY_EMAIL}" style="color: #c5eb35; text-decoration: none;">${ROXY_PRIMARY_EMAIL}</a></li>
                  <li>💼 <strong>LinkedIn:</strong> <a href="${ROXY_PROFILE.socials.linkedin}" style="color: #90caff; text-decoration: none;">${ROXY_PROFILE.socials.linkedin}</a></li>
                  <li>🐙 <strong>GitHub:</strong> <a href="${ROXY_PROFILE.socials.github}" style="color: #90caff; text-decoration: none;">${ROXY_PROFILE.socials.github}</a></li>
                  <li>𝕏 <strong>Twitter / X:</strong> <a href="${ROXY_PROFILE.socials.x}" style="color: #90caff; text-decoration: none;">${ROXY_PROFILE.socials.x}</a></li>
                </ul>
              </div>

              <div style="background-color: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 18px; margin: 20px 0;">
                <h3 style="margin: 0 0 10px 0; font-size: 13px; text-transform: uppercase; letter-spacing: 0.1em; color: #c5eb35;">
                  🛠️ Core Stack &amp; Focus
                </h3>
                <p style="font-size: 13px; line-height: 1.6; color: #cbd5e1; margin: 0;">
                  Multi-Agent Systems (LangGraph), Temporal.io Durable Execution, Vercel AI SDK, Voice AI (Vapi), Next.js 16, React 19, TypeScript, PostgreSQL, Upstash Redis, and Scalable Cloud Architectures.
                </p>
              </div>

              <div style="text-align: center; margin-top: 28px;">
                <a href="mailto:${ROXY_PRIMARY_EMAIL}" style="display: inline-block; background-color: #c5eb35; color: #141b16; font-weight: 600; font-size: 14px; text-decoration: none; padding: 12px 28px; border-radius: 9999px;">
                  Reply or Schedule a Call
                </a>
              </div>
            </div>

            <div style="text-align: center; border-top: 1px solid rgba(255,255,255,0.15); padding-top: 16px; margin-top: 20px;">
              <p style="font-size: 12px; color: #94a3b8; margin: 0;">
                Sent automatically by Roxy • Ronit Rai's Portfolio Agent
              </p>
            </div>
          </div>
        `;

        const response = await resend.emails.send({
          from: SENDER_EMAIL,
          to: [recipientEmail],
          replyTo: ROXY_PRIMARY_EMAIL,
          subject: "Ronit Rai (ROX) — Resume PDF & Portfolio Dossier",
          html: emailHtml,
          attachments: attachments.length > 0 ? attachments : undefined,
        });

        if (response.error) {
          console.error(
            "[Roxy Tool] Resend error in sendRoxyDetails:",
            response.error
          );
          return {
            success: false,
            message: `Resend notice: ${response.error.message}`,
          };
        }

        return {
          success: true,
          message: `Ronit's complete details, resume PDF attachment, and social profiles have been dispatched to ${recipientEmail}!`,
          emailId: response.data?.id,
        };
      } catch (err: any) {
        console.error("[Roxy Tool] Exception in sendRoxyDetails:", err);
        return {
          success: false,
          message: `Error dispatching details: ${err?.message || "Unknown error"}`,
        };
      }
    },
  }),
};

