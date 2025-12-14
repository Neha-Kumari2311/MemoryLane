import { cookies } from "next/headers";
import prisma from "./prisma";

export async function setSession(userId) {
  const cookieStore = await cookies();
  cookieStore.set("userId", userId.toString(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
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

