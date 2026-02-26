import { render, screen } from "@testing-library/react";
import { vi, describe, it, expect } from "vitest";
import React from "react";
import { ConcertCard } from "@/app/concerts/component/ConcertCard";

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

describe("ConcertCard", () => {
  it("affiche les informations principales et les fallbacks", () => {
    render(
      <ConcertCard
        slug="test-concert"
        title="Concert Test"
        imageUrl={null}
        artistName="The Testers"
        artistImageUrl={null}
        artistGenre="Rock"
        venueName="Salle Exemple"
        venueCity="Paris"
        venuePostalCode="75000"
        date={new Date("2025-06-10T12:00:00.000Z")}
        time={null}
        price={null}
        groupCount={0}
      />
    );

    expect(screen.getByRole("link")).toHaveAttribute(
      "href",
      "/concerts/test-concert"
    );
    expect(screen.getByText("Concert Test")).toBeInTheDocument();
    expect(screen.getByText("The Testers")).toBeInTheDocument();
    expect(screen.getByText("Gratuit")).toBeInTheDocument();
    expect(screen.getByText("Aucun groupe")).toBeInTheDocument();

    expect(screen.getAllByText("Image non disponible").length).toBeGreaterThan(0);
  });
});
