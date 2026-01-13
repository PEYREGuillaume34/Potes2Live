"use server";

import { db } from "@/app/lib/db/drizzle";
import { events, artists, venues } from "@/app/lib/db/schema";
import { eq, desc, and } from "drizzle-orm";

export async function getUpcomingConcerts() {
  try {
    const concerts = await db
      .select({
        id: events.id,
        slug: events.slug,
        title: events.title,
        description: events.description,
        imageUrl: events.imageUrl,
        eventDate: events.eventDate,
        eventTime: events.eventTime,
        price: events.price,
        ticketUrl: events.ticketUrl,
        artist: {
          id: artists.id,
          name: artists.name,
          genre: artists.genre,
          imageUrl: artists.imageUrl,
        },
        venue: {
          id: venues.id,
          name: venues.name,
          city: venues.city,
          address: venues.address,
        },
      })
      .from(events)
      .innerJoin(artists, eq(events.artistId, artists.id))
      .innerJoin(venues, eq(events.venueId, venues.id))
      .where(eq(events.status, "upcoming"))
      .orderBy(desc(events.eventDate));

    return { success: true, data: concerts };
  } catch (error) {
    console.error("Error fetching concerts:", error);
    return { success: false, error: "Erreur lors de la récupération des concerts" };
  }
}

export async function getConcertBySlug(slug: string) {
  try {
    const concert = await db
      .select({
        id: events.id,
        slug: events.slug,
        title: events.title,
        description: events.description,
        imageUrl: events.imageUrl,
        eventDate: events.eventDate,
        eventTime: events.eventTime,
        price: events.price,
        ticketUrl: events.ticketUrl,
        status: events.status,
        artist: {
          id: artists.id,
          name: artists.name,
          genre: artists.genre,
          imageUrl: artists.imageUrl,
          spotifyUrl: artists.spotifyUrl,
          instagramUrl: artists.instagramUrl,
          bio: artists.bio,
        },
        venue: {
          id: venues.id,
          name: venues.name,
          city: venues.city,
          address: venues.address,
          latitude: venues.latitude,
          longitude: venues.longitude,
          capacity: venues.capacity,
        },
      })
      .from(events)
      .innerJoin(artists, eq(events.artistId, artists.id))
      .innerJoin(venues, eq(events.venueId, venues.id))
      .where(eq(events.slug, slug))
      .limit(1);

    if (concert.length === 0) {
      return { success: false, error: "Concert introuvable" };
    }

    return { success: true, data: concert[0] };
  } catch (error) {
    console.error("Error fetching concert:", error);
    return { success: false, error: "Erreur lors de la récupération du concert" };
  }
}

export async function getConcertsByCity(city: string) {
  try {
    const concerts = await db
      .select({
        id: events.id,
        slug: events.slug,
        title: events.title,
        imageUrl: events.imageUrl,
        eventDate: events.eventDate,
        price: events.price,
        artist: {
          name: artists.name,
          genre: artists.genre,
        },
        venue: {
          name: venues.name,
          city: venues.city,
        },
      })
      .from(events)
      .innerJoin(artists, eq(events.artistId, artists.id))
      .innerJoin(venues, eq(events.venueId, venues.id))
      .where(
        and(
          eq(events.status, "upcoming"),
          eq(venues.city, city)
        )
      )
      .orderBy(desc(events.eventDate));

    return { success: true, data: concerts };
  } catch (error) {
    return { success: false, error: "Erreur lors du filtrage" };
  }
}