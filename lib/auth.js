import { cookies } from "next/headers";
import prisma from "./prisma";

export async function setSession(userId) {
  const cookieStore = await cookies();
  
  // Determine if secure should be true based on NODE_ENV
  // In production, this should ALWAYS be true for HTTPS
  const isProduction = process.env.NODE_ENV === "production";
  const isHttps = process.env.NEXT_PUBLIC_BASE_URL?.startsWith("https://");
  const shouldBeSecure = isProduction || isHttps;

  cookieStore.set("userId", userId.toString(), {
    httpOnly: true,
    secure: shouldBeSecure, // Only send over HTTPS in production
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/", // Ensure cookie is available across all routes
  });
}

export async function getSession() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId");
  if (!userId) return null;

  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId.value) },
      select: { id: true, name: true, email: true },
    });
    return user;
  } catch (error) {
    console.error("Session fetch error:", error);
    return null;
  }
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete("userId");
}

export async function requireAuth() {
  const user = await getSession();
  if (!user) {
    throw new Error("Unauthorized");
  }
  return user;
}

