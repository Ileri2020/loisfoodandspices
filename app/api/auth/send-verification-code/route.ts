"use server";
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import nodemailer from "nodemailer";

const prisma = new PrismaClient();

// Configure nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail", // or your preferred email service
  auth: {
    user: process.env.GMAIL,
    pass: process.env.GOOGLE_APP_PASSWORD, // The 16-character App Password
  },
});

// Generate a 6-digit code
function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Check if user exists with this email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if user has a password (if they have one, they don't need this flow)
    if (user.password) {
      return NextResponse.json(
        { error: "User already has a password. Please use regular login." },
        { status: 400 }
      );
    }

    // Check if user signed up via OAuth (Google/Facebook)
    if (!user.providerid) {
      return NextResponse.json(
        { error: "This account was not created via Google or Facebook" },
        { status: 400 }
      );
    }

    // Delete any existing unverified codes for this email
    await prisma.emailVerificationCode.deleteMany({
      where: {
        email,
        verified: false,
      },
    });

    // Generate new verification code
    const code = generateVerificationCode();
    const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes expiry

    // Save the code to database
    await prisma.emailVerificationCode.create({
      data: {
        email,
        code,
        expires,
      },
    });

    // Send email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Verify Your Email - Lois Food and Spices",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #22c55e;">Verify Your Email</h2>
          <p>Hi ${user.name || "there"},</p>
          <p>You requested to set a password for your Lois Food and Spices account.</p>
          <p>Your verification code is:</p>
          <div style="background: #f3f4f6; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
            <h1 style="color: #22c55e; font-size: 32px; letter-spacing: 8px; margin: 0;">${code}</h1>
          </div>
          <p>This code will expire in 15 minutes.</p>
          <p>If you didn't request this, please ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
          <p style="color: #6b7280; font-size: 12px;">© 2026 Lois Food and Spices. All rights reserved.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      {
        message: "Verification code sent to your email",
        requiresVerification: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending verification code:", error);
    return NextResponse.json(
      { error: "Failed to send verification code" },
      { status: 500 }
    );
  }
}
