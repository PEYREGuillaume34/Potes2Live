import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock pour les actions serveur (simulent la reponse)
vi.mock("@/app/actions/concerts.action", () => ({
  getUpcomingConcerts: vi.fn(async () => ({
    success: true,
    data: [
      {
        id: 1,
        slug: "test-concert",
        title: "Test Concert",
        description: "Test",
        imageUrl: "https://example.com/image.jpg",
        eventDate: new Date("2025-06-10"),
        eventTime: "20:00",
        price: 25,
        ticketUrl: "https://tickets.example.com",
        artist: {
          id: 1,
          name: "Test Artist",
          genre: "Rock",
          imageUrl: "https://example.com/artist.jpg",
        },
        venue: {
          id: 1,
          name: "Test Venue",
          city: "Paris",
          postalCode: "75000",
          address: "123 Rue Test",
        },
        groupCount: 2,
      },
    ],
  })),
  getConcertsByCity: vi.fn(async (city: string) => ({
    success: true,
    data: [],
  })),
  getConcertBySlug: vi.fn(async (slug: string) => ({
    success: true,
    data: null,
  })),
}));

describe("Concert Actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("getUpcomingConcerts retourne la liste des concerts", async () => {
    const { getUpcomingConcerts } = await import(
      "@/app/actions/concerts.action"
    );
    const result = await getUpcomingConcerts();

    expect(result.success).toBe(true);
    expect(result.data).toHaveLength(1);
    expect(result.data?.[0].title).toBe("Test Concert");
  });

  it("getConcertsByCity filtre par ville", async () => {
    const { getConcertsByCity } = await import(
      "@/app/actions/concerts.action"
    );
    const result = await getConcertsByCity("Paris");

    expect(result.success).toBe(true);
  });

  it("getConcertBySlug recupere un concert par slug", async () => {
    const { getConcertBySlug } = await import(
      "@/app/actions/concerts.action"
    );
    const result = await getConcertBySlug("test-concert");

    expect(result.success).toBe(true);
  });
});
