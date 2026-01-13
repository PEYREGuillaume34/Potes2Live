"use server"

import { db } from "@/app/lib/db/drizzle";
import { groupMessages, user, groupMembers } from "@/app/lib/db/schema";
import { eq, and, asc } from "drizzle-orm";
import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";

// Récupérer les messages
// 1. Vérifier l'authentification
// 2. Vérifier que l'utilisateur est membre
// 3. Faire une query SELECT avec JOIN sur user
// 4. Retourner les données

export async function getGroupMessages(groupId: number) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return { success: false, error: "Non authentifié" };
    }

    // Vérifier que l'utilisateur est membre
    const [membership] = await db
      .select()
      .from(groupMembers)
      .where(
        and(
          eq(groupMembers.groupId, groupId),
          eq(groupMembers.userId, session.user.id),
          eq(groupMembers.status, "active")
        )
      )
      .limit(1);

    if (!membership) {
      return { success: false, error: "Vous n'êtes pas membre de ce groupe" };
    }

    // Récupérer les messages
    const messages = await db
      .select({
        id: groupMessages.id,
        content: groupMessages.content,
        createdAt: groupMessages.createdAt,
        user: {
          id: user.id,
          name: user.name,
          image: user.image,
        },
      })
      .from(groupMessages)
      .innerJoin(user, eq(groupMessages.userId, user.id))
      .where(eq(groupMessages.groupId, groupId))
      .orderBy(asc(groupMessages.createdAt));

    return { success: true, data: messages };
  } catch (error) {
    console.error("Error fetching messages:", error);
    return { success: false, error: "Erreur lors de la récupération des messages" };
  }
}

export async function sendGroupMessage(groupId: number, content: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return { success: false, error: "Non authentifié" };
    }

    // Vérifier que l'utilisateur est membre
    const [membership] = await db
      .select()
      .from(groupMembers)
      .where(
        and(
          eq(groupMembers.groupId, groupId),
          eq(groupMembers.userId, session.user.id),
          eq(groupMembers.status, "active")
        )
      )
      .limit(1);

    if (!membership) {
      return { success: false, error: "Vous devez être membre du groupe" };
    }

    // Valider le contenu
    if (!content.trim()) {
      return { success: false, error: "Le message ne peut pas être vide" };
    }

    // Insérer le message
    await db.insert(groupMessages).values({
      groupId,
      userId: session.user.id,
      content: content.trim(),
    });

    return { success: true, message: "Message envoyé" };
  } catch (error) {
    console.error("Error sending message:", error);
    return { success: false, error: "Erreur lors de l'envoi" };
  }
}