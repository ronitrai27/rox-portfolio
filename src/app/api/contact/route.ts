import { Resend } from "resend";
import { z } from "zod";

const RESEND_API_KEY = process.env.RESEND_API_KEY || "";
const resend = new Resend(RESEND_API_KEY);

const ROXY_PRIMARY_EMAIL = process.env.ROXY_EMAIL || "ronitrai1237@gmail.com";
const SENDER_EMAIL =
  process.env.RESEND_FROM_EMAIL || "Roxy Portfolio <roxy@wekraft.xyz>";

const contactSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  message: z.string().min(5, "Message must be at least 5 characters long"),
  name: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    let body: any;
    try {
      body = await req.json();
    } catch {
      return new Response(
        JSON.stringify({ error: "Invalid JSON payload" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const validation = contactSchema.safeParse(body);
    if (!validation.success) {
      const errorMsg =
        validation.error.errors[0]?.message || "Invalid input data";
      return new Response(JSON.stringify({ error: errorMsg }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { email, message, name } = validation.data;

    if (!RESEND_API_KEY) {
      console.warn(
        "[Contact API] RESEND_API_KEY not set. Logging message:",
        { email, name, message }
      );
      return new Response(
        JSON.stringify({
          success: true,
          message: "Message received (mock mode - RESEND_API_KEY unset)",
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    const emailSubject = name
      ? `Portfolio Contact: Message from ${name} (${email})`
      : `Portfolio Contact: Message from ${email}`;

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f7f7f7; color: #1a1a1a; margin: 0; padding: 24px; }
    .container { max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e5e5e5; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.04); }
    .header { background: #123826; color: #ffffff; padding: 24px 28px; }
    .header h1 { margin: 0; font-size: 20px; font-weight: 600; }
    .content { padding: 28px; }
    .label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #666666; font-weight: 600; margin-bottom: 6px; }
    .value { font-size: 15px; color: #111111; margin-bottom: 20px; font-weight: 500; }
    .message-box { background: #f9f9f8; border-left: 4px solid #c5eb35; padding: 16px 20px; border-radius: 6px; font-size: 15px; line-height: 1.6; color: #222222; white-space: pre-wrap; }
    .footer { padding: 18px 28px; background: #fbfbfb; border-top: 1px solid #f0f0f0; font-size: 12px; color: #888888; text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>New Portfolio Inquiry</h1>
    </div>
    <div class="content">
      ${name ? `<div class="label">Sender Name</div><div class="value">${name}</div>` : ""}
      <div class="label">Sender Email</div>
      <div class="value"><a href="mailto:${email}" style="color: #123826; text-decoration: underline;">${email}</a></div>
      <div class="label">Message</div>
      <div class="message-box">${message.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</div>
    </div>
    <div class="footer">
      Dispatched automatically from Ronit Rai's Portfolio Website
    </div>
  </div>
</body>
</html>
    `.trim();

    const response = await resend.emails.send({
      from: SENDER_EMAIL,
      to: [ROXY_PRIMARY_EMAIL],
      replyTo: email,
      subject: emailSubject,
      html: htmlContent,
    });

    if (response.error) {
      console.error("[Contact API] Resend error:", response.error);
      return new Response(
        JSON.stringify({ error: response.error.message }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Your message has been dispatched directly to Ronit!",
        emailId: response.data?.id,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("[Contact API] Exception:", error);
    return new Response(
      JSON.stringify({ error: error?.message || "Internal Server Error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
