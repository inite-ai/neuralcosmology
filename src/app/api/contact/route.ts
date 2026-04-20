import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

const SMTP_CONFIG = {
  host: process.env.MAILGUN_SMTP_HOST || "smtp.mailgun.org",
  port: parseInt(process.env.MAILGUN_SMTP_PORT || "2525"),
  secure: false,
  auth: {
    user: process.env.MAILGUN_SMTP_USERNAME,
    pass: process.env.MAILGUN_SMTP_PASSWORD,
  },
};

const MAILGUN_FROM_EMAIL =
  process.env.MAILGUN_FROM_EMAIL || "info@neuralcosmology.com";
const CONTACT_EMAIL = process.env.CONTACT_EMAIL || "info@neuralcosmology.com";

interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: ContactFormData = await request.json();
    const { name, email, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 },
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 },
      );
    }

    if (!SMTP_CONFIG.auth.user || !SMTP_CONFIG.auth.pass) {
      console.error(
        "SMTP not configured. Set MAILGUN_SMTP_USERNAME and MAILGUN_SMTP_PASSWORD.",
      );
      return NextResponse.json(
        { error: "Email service not configured" },
        { status: 500 },
      );
    }

    const emailSubject = `Neural Cosmology — contact from ${name}`;
    const emailText = `
Name: ${name}
Email: ${email}

Message:
${message}

---
Sent from neuralcosmology.com contact form
    `.trim();

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #0a1026; color: #e2e8f0;">
        <h2 style="color: #818cf8; border-bottom: 2px solid #818cf8; padding-bottom: 10px;">
          Neural Cosmology — new contact
        </h2>

        <div style="background: rgba(255,255,255,0.05); padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid rgba(255,255,255,0.1);">
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}" style="color: #a5b4fc;">${email}</a></p>
        </div>

        <div style="margin: 20px 0;">
          <h3 style="color: #c4b5fd;">Message</h3>
          <div style="background: rgba(255,255,255,0.03); padding: 20px; border-left: 4px solid #818cf8; border-radius: 4px;">
            ${message.replace(/\n/g, "<br>")}
          </div>
        </div>

        <hr style="margin: 30px 0; border: none; border-top: 1px solid rgba(255,255,255,0.1);">
        <p style="color: rgba(255,255,255,0.5); font-size: 14px;">
          Sent from <a href="https://neuralcosmology.com" style="color: #818cf8;">neuralcosmology.com</a>
        </p>
      </div>
    `;

    const transporter = nodemailer.createTransport(SMTP_CONFIG);

    const mailOptions = {
      from: `"${name} via neuralcosmology.com" <${MAILGUN_FROM_EMAIL}>`,
      to: CONTACT_EMAIL,
      replyTo: email,
      subject: emailSubject,
      text: emailText,
      html: emailHtml,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log("Contact email sent:", result.messageId);

    return NextResponse.json(
      { success: true, messageId: result.messageId },
      { status: 200 },
    );
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      {
        error: "Failed to send message. Please try again later or write to info@neuralcosmology.com directly.",
        details: process.env.NODE_ENV === "development" ? String(error) : undefined,
      },
      { status: 500 },
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
