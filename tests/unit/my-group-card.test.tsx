import { render, screen } from "@testing-library/react";
import { vi, describe, it, expect } from "vitest";
import React from "react";
import { MyGroupCard } from "@/app/groups/components/MyGroupCard";

vi.mock("next/link", () => {
  return {
    __esModule: true,
    default: ({
      href,
      children,
      ...rest
    }: {
      href: string;
      children: React.ReactNode;
    }) => (
      <a href={href} {...rest}>
        {children}
      </a>
    ),
  };
});

describe("MyGroupCard", () => {
  it("affiche les informations du groupe", () => {
    const mockGroup = {
      id: 1,
      name: "Mon Groupe Rock",
      description: "Un groupe sympa pour les concerts rock",
      maxMembers: 10,
      createdAt: new Date("2025-01-01"),
      isOwner: true,
      memberRole: "owner" as const,
      memberCount: 5,
      event: {
        id: 1,
        slug: "test-concert",
        title: "Concert Test",
        imageUrl: null,
        eventDate: new Date("2025-06-10"),
        eventTime: "20:00",
      },
    };

    render(<MyGroupCard group={mockGroup} />);

    expect(screen.getByText("Mon Groupe Rock")).toBeInTheDocument();
    expect(
      screen.getByText("Un groupe sympa pour les concerts rock")
    ).toBeInTheDocument();
    expect(screen.getByText("Créateur")).toBeInTheDocument();
    expect(screen.getByText("Concert Test")).toBeInTheDocument();
    expect(screen.getByText(/5 \/ 10 membres/)).toBeInTheDocument();
  });

  it("n'affiche pas le badge Créateur si pas owner", () => {
    const mockGroup = {
      id: 1,
      name: "Groupe Test",
      description: "Description",
      maxMembers: 10,
      createdAt: new Date("2025-01-01"),
      isOwner: false,
      memberRole: "member" as const,
      memberCount: 3,
      event: {
        id: 1,
        slug: "test-concert",
        title: "Concert Test",
        imageUrl: null,
        eventDate: new Date("2025-06-10"),
        eventTime: "20:00",
      },
    };

    render(<MyGroupCard group={mockGroup} />);

    expect(screen.queryByText("Créateur")).not.toBeInTheDocument();
    expect(screen.getByText("Groupe Test")).toBeInTheDocument();
  });
});
