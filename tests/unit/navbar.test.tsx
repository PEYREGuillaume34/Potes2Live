import { render, screen } from "@testing-library/react";
import { vi, describe, it, expect } from "vitest";
import React from "react";
import { Navbar } from "@/app/components/Navbar";

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

describe("Navbar", () => {
  it("affiche les liens principaux", () => {
    render(<Navbar />);

    expect(screen.getByRole("link", { name: /Accueil/i })).toHaveAttribute(
      "href",
      "/"
    );
    expect(screen.getByRole("link", { name: /Groupes/i })).toHaveAttribute(
      "href",
      "/groups"
    );
    expect(screen.getByRole("link", { name: /Messages/i })).toHaveAttribute(
      "href",
      "/messages"
    );
    expect(screen.getByRole("link", { name: /Concerts/i })).toHaveAttribute(
      "href",
      "/concerts"
    );
    expect(screen.getByRole("link", { name: /Profil/i })).toHaveAttribute(
      "href",
      "/profile"
    );
  });
});
