"use server";

import { db } from "@/app/lib/db/drizzle";
import { groups, groupMembers, user } from "@/app/lib/db/schema";
import { eq, and, count } from "drizzle-orm";
import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";

export async function getGroupsByEventId(eventId: number) {
  try {
    const groupsWithMembers = await db
      .select({
        id: groups.id,
        name: groups.name,
        description: groups.description,
        maxMembers: groups.maxMembers,
        isActive: groups.isActive,
        createdAt: groups.createdAt,
        owner: {
          id: user.id,
          name: user.name,
          image: user.image,
        },
        memberCount: count(groupMembers.id),
      })
      .from(groups)
      .leftJoin(user, eq(groups.ownerId, user.id))
      .leftJoin(groupMembers, and(
        eq(groups.id, groupMembers.groupId),
        eq(groupMembers.status, "active")
      ))
      .where(and(
        eq(groups.eventId, eventId),
        eq(groups.isActive, true)
      ))
      .groupBy(groups.id, user.id);

    return { success: true, data: groupsWithMembers };
  } catch (error) {
    console.error("Error fetching groups:", error);
    return { success: false, error: "Erreur lors de la récupération des groupes" };
  }
}

export async function createGroup(eventId: number, name: string, description?: string, maxMembers: number = 10) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return { success: false, error: "Non authentifié" };
    }

    const [newGroup] = await db
      .insert(groups)
      .values({
        eventId,
        ownerId: session.user.id,
        name,
        description,
        maxMembers,
        isActive: true,
      })
      .returning();

    // Ajouter le créateur comme membre
    await db.insert(groupMembers).values({
      groupId: newGroup.id,
      userId: session.user.id,
      role: "owner",
      status: "active",
    });

    return { success: true, data: newGroup };
  } catch (error) {
    console.error("Error creating group:", error);
    return { success: false, error: "Erreur lors de la création du groupe" };
  }
}

export async function joinGroup(groupId: number) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return { success: false, error: "Non authentifié" };
    }

    // Vérifier si déjà membre
    const existingMember = await db
      .select()
      .from(groupMembers)
      .where(
        and(
          eq(groupMembers.groupId, groupId),
          eq(groupMembers.userId, session.user.id)
        )
      )
      .limit(1);

    if (existingMember.length > 0) {
      return { success: false, error: "Vous êtes déjà membre de ce groupe" };
    }

    // Vérifier si le groupe est plein
    const memberCount = await db
      .select({ count: count() })
      .from(groupMembers)
      .where(
        and(
          eq(groupMembers.groupId, groupId),
          eq(groupMembers.status, "active")
        )
      );

    const [group] = await db
      .select()
      .from(groups)
      .where(eq(groups.id, groupId))
      .limit(1);

    if (memberCount[0].count >= group.maxMembers) {
      return { success: false, error: "Ce groupe est complet" };
    }

    // Rejoindre le groupe
    await db.insert(groupMembers).values({
      groupId,
      userId: session.user.id,
      role: "member",
      status: "active",
    });

    return { success: true, message: "Vous avez rejoint le groupe" };
  } catch (error) {
    console.error("Error joining group:", error);
    return { success: false, error: "Erreur lors de l'adhésion au groupe" };
  }
}

export async function leaveGroup(groupId: number) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return { success: false, error: "Non authentifié" };
    }

    // Mettre à jour le statut à "left"
    await db
      .update(groupMembers)
      .set({ status: "left" })
      .where(
        and(
          eq(groupMembers.groupId, groupId),
          eq(groupMembers.userId, session.user.id)
        )
      );

    return { success: true, message: "Vous avez quitté le groupe" };
  } catch (error) {
    console.error("Error leaving group:", error);
    return { success: false, error: "Erreur lors de la sortie du groupe" };
  }
}

export async function getGroupById(groupId: number) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return { success: false, error: "Non authentifié" };
    }

    const [group] = await db
      .select({
        id: groups.id,
        name: groups.name,
        description: groups.description,
        maxMembers: groups.maxMembers,
        isActive: groups.isActive,
        createdAt: groups.createdAt,
        eventId: groups.eventId,
        owner: {
          id: user.id,
          name: user.name,
          image: user.image,
        },
      })
      .from(groups)
      .leftJoin(user, eq(groups.ownerId, user.id))
      .where(eq(groups.id, groupId))
      .limit(1);

    if (!group) {
      return { success: false, error: "Groupe introuvable" };
    }

    return { success: true, data: group };
  } catch (error) {
    console.error("Error fetching group:", error);
    return { success: false, error: "Erreur lors de la récupération du groupe" };
  }
}

export async function getGroupMembers(groupId: number) {
  try {
    const members = await db
      .select({
        id: groupMembers.id,
        role: groupMembers.role,
        status: groupMembers.status,
        joinedAt: groupMembers.joinedAt,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        },
      })
      .from(groupMembers)
      .innerJoin(user, eq(groupMembers.userId, user.id))
      .where(
        and(
          eq(groupMembers.groupId, groupId),
          eq(groupMembers.status, "active")
        )
      )
      .orderBy(groupMembers.joinedAt);

    return { success: true, data: members };
  } catch (error) {
    console.error("Error fetching members:", error);
    return { success: false, error: "Erreur lors de la récupération des membres" };
  }
}

export async function isUserMemberOfGroup(groupId: number) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return { success: false, isMember: false };
    }

    const [member] = await db
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

    return { success: true, isMember: !!member, role: member?.role };
  } catch (error) {
    return { success: false, isMember: false };
  }
}