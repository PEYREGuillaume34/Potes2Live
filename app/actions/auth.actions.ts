"use server";

import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";

export async function getCurrentUser() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return { success: false, error: "Non authentifié" };
    }

    return { success: true, data: session.user };
  } catch (error) {
    return { success: false, error: "Erreur serveur" };
  }
}