import { describe, it, expect } from "vitest";

// Mock pour les helper response
export function mockActionSuccess<T>(data: T) {
  return { success: true, data };
}

export function mockActionError(error: string) {
  return { success: false, error };
}

describe("Action Response Utility", () => {
  it("mockActionSuccess retourne un objet reussi", () => {
    const data = { id: 1, name: "Test" };
    const result = mockActionSuccess(data);

    expect(result.success).toBe(true);
    expect(result.data).toEqual(data);
  });

  it("mockActionError retourne un objet d'erreur", () => {
    const error = "Une erreur est survenue";
    const result = mockActionError(error);

    expect(result.success).toBe(false);
    expect(result.error).toBe(error);
  });
});
