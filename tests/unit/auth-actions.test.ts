import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock Better-Auth et Next headers
vi.mock("@/app/lib/auth", () => ({
  auth: {
    api: {
      getSession: vi.fn(),
    },
  },
}));

vi.mock("next/headers", () => ({
  headers: vi.fn(async () => new Headers()),
}));

describe("Auth Actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("getCurrentUser retourne l'utilisateur si authentifié", async () => {
    const { auth } = await import("@/app/lib/auth");
    const mockUser = {
      id: "user-123",
      name: "Test User",
      email: "test@example.com",
      createdAt: new Date(),
      updatedAt: new Date(),
      emailVerified: true,
      bio: null,
    };

    // Mock de la session
    vi.mocked(auth.api.getSession).mockResolvedValue({
      user: mockUser,
      session: {
        id: "session-123",
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: "user-123",
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        token: "test-token",
      },
    });

    const { getCurrentUser } = await import("@/app/actions/auth.actions");
    const result = await getCurrentUser();

    expect(result.success).toBe(true);
    expect(result.data).toEqual(mockUser);
  });

  it("getCurrentUser retourne une erreur si non authentifié", async () => {
    const { auth } = await import("@/app/lib/auth");

    // Mock session null (non connecté)
    vi.mocked(auth.api.getSession).mockResolvedValue(null);

    const { getCurrentUser } = await import("@/app/actions/auth.actions");
    const result = await getCurrentUser();

    expect(result.success).toBe(false);
    expect(result.error).toBe("Non authentifié");
  });

  it("getCurrentUser gère les erreurs serveur", async () => {
    const { auth } = await import("@/app/lib/auth");

    // Mock erreur réseau ou serveur
    vi.mocked(auth.api.getSession).mockRejectedValue(
      new Error("Database error")
    );

    const { getCurrentUser } = await import("@/app/actions/auth.actions");
    const result = await getCurrentUser();

    expect(result.success).toBe(false);
    expect(result.error).toBe("Erreur serveur");
  });
});