import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { setSession } from "@/lib/auth";
import { validateEmail, validatePassword } from "@/lib/validation";
import { authLimiter } from "@/lib/rateLimiter";

export async function POST(request) {
  try {
    // Rate limiting - prevent brute force attacks
    const limiter = authLimiter(request);
    if (limiter.limited) {
      return NextResponse.json(
        { error: "Too many login attempts. Please try again later." },
        { 
          status: 429,
          headers: { "Retry-After": limiter.retryAfter },
        }
      );
    }

    const body = await request.json();
    const { email, password } = body;

    // Input validation
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
      return NextResponse.json(
        { error: emailValidation.error },
        { status: 400 }
      );
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      return NextResponse.json(
        { error: passwordValidation.error },
        { status: 400 }
      );
    }

    // Find user by email (case-insensitive)
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Set session cookie
    await setSession(user.id);

    // Don't send password back to client
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json(
      {
        message: "Login successful",
        user: userWithoutPassword,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Failed to login" },
      { status: 500 }
    );
  }
}