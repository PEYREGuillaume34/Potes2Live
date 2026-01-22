"use server";

import { db } from "../lib/db/drizzle";
import { groups, groupMembers, user, events } from "@/app/lib/db/schema";
import { eq, and, count, sql } from "drizzle-orm";
import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";

// ========================================
// RÉCUPÉRER LES GROUPES D'UN ÉVÉNEMENT
// ========================================
export async function getGroupsByEvent(eventId: number) {
  try {
    const groupswithMembers = await db
      .select({
        id: groups.id,
        name: groups.name,
        description: groups.description,
        maxMembers: groups.maxMembers,
        createdAt: groups.createdAt,
        ownerId: groups.ownerId,
        owner: {
          id: user.id,
          name: user.name,
          image: user.image,
        },
        memberCount: count(groupMembers.id),
      })
      .from(groups)
      .innerJoin(user, eq(groups.ownerId, user.id))
      .leftJoin(
        groupMembers,
        and(
          eq(groups.id, groupMembers.groupId),
          eq(groupMembers.status, "active")
        )
      )
      .where(and(eq(groups.eventId, eventId), eq(groups.isActive, true)))
      .groupBy(groups.id, user.id);

    return { success: true, data: groupswithMembers };
  } catch (error) {
    console.error("Erreur récupération groupes:", error);
    return {
      success: false,
      error: "Erreur lors de la récupération des groupes",
    };
  }
}

// ========================================
// VÉRIFIER SI L'USER A DÉJÀ UN GROUPE POUR CET EVENT
// ========================================
export async function checkUserGroupForEvent(eventId: number) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return { success: false, error: "Non authentifié" };
    }

    const [existingGroup] = await db
      .select()
      .from(groups)
      .where(
        and(
          eq(groups.eventId, eventId),
          eq(groups.ownerId, session.user.id),
          eq(groups.isActive, true)
        )
      )
      .limit(1);

    return { success: true, hasGroup: !!existingGroup, group: existingGroup };
  } catch (error) {
    console.error("Erreur vérification groupe existant:", error);
    return {
      success: false,
      error: "Erreur lors de la vérification du groupe",
    };
  }
}

// ========================================
// CRÉER UN GROUPE
// ========================================
export async function createGroup(
  eventId: number,
  name: string,
  description: string,
  maxMembers: number = 10
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return { success: false, error: "Non authentifié" };
    }

    // Vérifier que l'utilisateur n'a pas déjà créé un groupe pour cet event
    const checkResult = await checkUserGroupForEvent(eventId);
    if (checkResult.hasGroup) {
      return {
        success: false,
        error: "Vous avez déjà créé un groupe pour cet événement",
      };
    }

    // Validation des données
    if (!name || name.trim().length < 3) {
      return {
        success: false,
        error: "Le nom du groupe doit contenir au moins 3 caractères",
      };
    }

    if (maxMembers < 2 || maxMembers > 50) {
      return {
        success: false,
        error: "Le nombre de membres doit être entre 2 et 50",
      };
    }

    // Créer le groupe
    const [newGroup] = await db
      .insert(groups)
      .values({
        eventId,
        ownerId: session.user.id,
        name: name.trim(),
        description: description?.trim() || null,
        maxMembers,
        isActive: true,
      })
      .returning();

    // Ajouter le créateur en tant que membre actif du groupe
    await db.insert(groupMembers).values({
      groupId: newGroup.id,
      userId: session.user.id,
      role: "owner",
      status: "active",
    });

    return { success: true, data: newGroup };
  } catch (error) {
    console.error("Erreur création groupe:", error);
    return { success: false, error: "Erreur lors de la création du groupe" };
  }
}

// ========================================
// REJOINDRE UN GROUPE
// ========================================
export async function joinGroup(groupId: number) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return { success: false, error: "Non authentifié" };
    }

    // Vérifier si le groupe existe et est actif
    const [group] = await db
      .select()
      .from(groups)
      .where(and(eq(groups.id, groupId), eq(groups.isActive, true)))
      .limit(1);

    if (!group) {
      return { success: false, error: "Groupe introuvable ou inactif" };
    }

    // Vérifier si l'utilisateur est déjà membre du groupe
    const [existingMember] = await db
      .select()
      .from(groupMembers)
      .where(
        and(
          eq(groupMembers.groupId, groupId),
          eq(groupMembers.userId, session.user.id)
        )
      )
      .limit(1);

    // Si déjà membre et actif
    if (existingMember && existingMember.status === "active") {
      return { success: false, error: "Vous êtes déjà membre de ce groupe" };
    }

    // Si membre mais a quitté (left) -> réactiver
    if (existingMember && existingMember.status === "left") {
      // Vérifier si le groupe n'est pas plein
      const memberCount = await db
        .select({ count: count() })
        .from(groupMembers)
        .where(
          and(
            eq(groupMembers.groupId, groupId),
            eq(groupMembers.status, "active")
          )
        );

      if (memberCount[0].count >= group.maxMembers) {
        return { success: false, error: "Le groupe est complet" };
      }

      // Réactiver le membre
      await db
        .update(groupMembers)
        .set({ status: "active" })
        .where(
          and(
            eq(groupMembers.groupId, groupId),
            eq(groupMembers.userId, session.user.id)
          )
        );

      return { success: true, message: "Vous avez rejoint à nouveau le groupe" };
    }

    // Vérifier si le groupe est déjà plein
    const memberCount = await db
      .select({ count: count() })
      .from(groupMembers)
      .where(
        and(
          eq(groupMembers.groupId, groupId),
          eq(groupMembers.status, "active")
        )
      );

    if (memberCount[0].count >= group.maxMembers) {
      return { success: false, error: "Le groupe est complet" };
    }

    // Rejoindre le groupe (nouveau membre)
    await db.insert(groupMembers).values({
      groupId: groupId,
      userId: session.user.id,
      role: "member",
      status: "active",
    });

    return { success: true, message: "Vous avez rejoint le groupe" };
  } catch (error) {
    console.error("Erreur rejoindre groupe:", error);
    return {
      success: false,
      error: "Erreur lors de la tentative de rejoindre le groupe",
    };
  }
}

// ========================================
// QUITTER UN GROUPE
// ========================================
export async function leaveGroup(groupId: number) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return { success: false, error: "Non authentifié" };
    }

    // Vérifier que l'utilisateur est membre du groupe
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

    if (!member) {
      return { success: false, error: "Vous n'êtes pas membre de ce groupe" };
    }

    // Mettre à jour le statut du membre à "left"
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
    console.error("Erreur quitter groupe:", error);
    return {
      success: false,
      error: "Erreur lors de la tentative de quitter le groupe",
    };
  }
}

// ========================================
// SUPPRIMER UN GROUPE (Owner uniquement)
// ========================================
export async function deleteGroup(groupId: number) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return { success: false, error: "Non authentifié" };
    }

    // Vérifier si l'utilisateur est le propriétaire du groupe
    const [group] = await db
      .select()
      .from(groups)
      .where(eq(groups.id, groupId))
      .limit(1);

    if (!group) {
      return { success: false, error: "Groupe introuvable" };
    }

    if (group.ownerId !== session.user.id) {
      return {
        success: false,
        error: "Seul le créateur peut supprimer le groupe",
      };
    }

    // Désactiver le groupe (soft delete)
    await db
      .update(groups)
      .set({ isActive: false })
      .where(eq(groups.id, groupId));

    return { success: true, message: "Le groupe a été supprimé" };
  } catch (error) {
    console.error("Erreur suppression groupe:", error);
    return { success: false, error: "Erreur lors de la suppression du groupe" };
  }
}

// ========================================
// RÉCUPÉRER TOUS LES GROUPES DE L'UTILISATEUR CONNECTÉ
// ========================================
export async function getMyGroups() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return { success: false, error: "Non authentifié" };
    }

    const myGroups = await db
      .select({
        id: groups.id,
        name: groups.name,
        description: groups.description,
        maxMembers: groups.maxMembers,
        createdAt: groups.createdAt,
        isOwner: sql<boolean>`${groups.ownerId} = ${session.user.id}`,
        memberRole: groupMembers.role,
        event: {
          id: events.id,
          slug: events.slug,
          title: events.title,
          imageUrl: events.imageUrl,
          eventDate: events.eventDate,
          eventTime: events.eventTime,
        },
        memberCount: sql<number>`(
          SELECT COUNT(*)::int 
          FROM ${groupMembers} gm 
          WHERE gm.group_id = ${groups.id} 
          AND gm.status = 'active'
        )`,
      })
      .from(groupMembers)
      .innerJoin(groups, eq(groupMembers.groupId, groups.id))
      .innerJoin(events, eq(groups.eventId, events.id))
      .where(
        and(
          eq(groupMembers.userId, session.user.id),
          eq(groupMembers.status, "active"),
          eq(groups.isActive, true)
        )
      )
      .orderBy(events.eventDate);

    return { success: true, data: myGroups };
  } catch (error) {
    console.error("Erreur récupération mes groupes:", error);
    return {
      success: false,
      error: "Erreur lors de la récupération de vos groupes",
    };
  }
}

// ========================================
// RÉCUPÉRER LES MEMBRES D'UN GROUPE
// ========================================
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
    console.error("Erreur récupération membres du groupe:", error);
    return {
      success: false,
      error: "Erreur lors de la récupération des membres du groupe",
    };
  }
}

// ========================================
// VÉRIFIER LE STATUT DE L'UTILISATEUR DANS UN GROUPE
// ========================================
export async function getUserGroupStatus(groupId: number) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return { 
        success: true, 
        isMember: false, 
        role: null,
        status: null 
      };
    }

    const [member] = await db
      .select({
        role: groupMembers.role,
        status: groupMembers.status,
      })
      .from(groupMembers)
      .where(
        and(
          eq(groupMembers.groupId, groupId),
          eq(groupMembers.userId, session.user.id)
        )
      )
      .limit(1);

    return {
      success: true,
      isMember: member?.status === "active",
      role: member?.role || null,
      status: member?.status || null,
    };
  } catch (error) {
    console.error("Erreur vérification statut utilisateur:", error);
    return {
      success: false,
      error: "Erreur lors de la vérification du statut",
    };
  }
}