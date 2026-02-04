"use client";

import Link from "next/link";
import { useSession, signOut } from "@/app/lib/auth-client";
import { useState } from "react";
import {
  CircleUserRound,
  House,
  MessageCircleMore,
  Speaker,
  Users,
} from "lucide-react";

export function Navbar() {
  const { data: session, isPending } = useSession();

  return (
    <nav className="fixed md:top-0 md:bottom-auto left-0 right-0 bg-orange-fonce">
      <div className="flex w-full h-16 md:justify-center md:gap-8">
        {/* Logo */}

        <Link
          href="/"
          className="flex flex-1 md:flex-none items-center justify-center md:gap-2 md:px-6 hover:bg-orange-clair text-white">
          <House />
          <span className="hidden md:inline-block font-semibold">Accueil</span>
        </Link>

        <Link
          href="/groups"
          className="flex flex-1 md:flex-none items-center justify-center md:gap-2 md:px-6 hover:bg-orange-clair text-white">
          <Users />
          <span className="hidden md:inline-block font-semibold">Groupes</span>
        </Link>

        <Link
          href="/messages"
          className="flex flex-1 md:flex-none items-center justify-center md:gap-2 md:px-6 hover:bg-orange-clair text-white">
          <MessageCircleMore />
          <span className="hidden md:inline-block font-semibold">Messages</span>
        </Link>

        <Link
          href="/concerts"
          className="flex flex-1 md:flex-none items-center justify-center md:gap-2 md:px-6 hover:bg-orange-clair text-white">
          <Speaker />
          <span className="hidden md:inline-block font-semibold">Concerts</span>
        </Link>

        <Link
          href="/profile"
          className="flex flex-1 md:flex-none items-center justify-center md:gap-2 md:px-6 hover:bg-orange-clair text-white">
          <CircleUserRound />
          <span className="hidden md:inline-block font-semibold">Profil</span>
        </Link>
      </div>
    </nav>
  );
}
