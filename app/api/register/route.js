import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { validateEmail, validatePassword, validateName } from "@/lib/validation";
import { authLimiter } from "@/lib/rateLimiter";

export async function POST(request) {
  try {
    // Rate limiting - prevent spam registrations
    const limiter = authLimiter(request);
    if (limiter.limited) {
      return NextResponse.json(
        { error: "Too many registration attempts. Please try again later." },
        { 
          status: 429,
          headers: { "Retry-After": limiter.retryAfter },
        }
      );
    }

    const body = await request.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Validate inputs
    const nameValidation = validateName(name);
    if (!nameValidation.valid) {
      return NextResponse.json({ error: nameValidation.error }, { status: 400 });
    }

    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
      return NextResponse.json({ error: emailValidation.error }, { status: 400 });
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      return NextResponse.json({ error: passwordValidation.error }, { status: 400 });
    }

    // Check if user already exists (case-insensitive email)
    const existingUser = await prisma.user.findUnique({ 
      where: { email: email.toLowerCase() } 
    });
    
    if (existingUser) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { 
        name: name.trim(), 
        email: email.toLowerCase(), 
        password: hashedPassword 
      },
    });

    return NextResponse.json(
      { user: { id: user.id, name: user.name, email: user.email } },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Failed to create user" }, 
      { status: 500 }
    );
  }
}