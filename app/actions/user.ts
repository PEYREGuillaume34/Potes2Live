"use server";

import { auth } from "@/app/lib/auth";
import { db } from "@/app/lib/db/drizzle";
import { user } from "@/app/lib/db/schema";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";


// Mettre à jour le profil utilisateur
export async function updateUserProfile(formData: FormData) {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session) {
    throw new Error("Non authentifié");
  }

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const bio = formData.get("bio") as string;
  const currentPassword = formData.get("currentPassword") as string;
  const newPassword = formData.get("newPassword") as string;

  // Si on veut changer le mot de passe
  if (newPassword && newPassword.trim() !== "") {
    if (!currentPassword) {
      throw new Error("Le mot de passe actuel est requis");
    }

    try {
      // ✅ Utiliser l'API Better-Auth pour changer le mot de passe
      // Better-Auth vérifie automatiquement l'ancien mot de passe
      await auth.api.changePassword({
        body: {
          newPassword: newPassword,
          currentPassword: currentPassword,
        },
        headers: await headers(),
      });
    } catch (error: any) {
      // Better-Auth retourne une erreur si le mot de passe actuel est incorrect
      console.error("Erreur changement mot de passe:", error);
      throw new Error("Mot de passe actuel incorrect");
    }
  }

  // Mise à jour du nom, email et bio
  await db
    .update(user)
    .set({ 
      name, 
      email,
      bio,
      updatedAt: new Date() 
    })
    .where(eq(user.id, session.user.id));

  revalidatePath("/edit-profile");
  return { success: true };
}