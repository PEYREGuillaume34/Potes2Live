"use client";

import Link from "next/link";
import { useSession, signOut } from "@/app/lib/auth-client";
import { useState } from "react";
import { CircleUserRound, Globe, House, MessageCircleMore } from "lucide-react";

export function Navbar() {
  const { data: session, isPending } = useSession();

  return (
    <nav className="fixed bottom-3 left-0 right-0 bg-orange-fonce">
      <div className="flex w-full h-16">
        {/* Logo */}
        <Link
          href="/"
          className="flex flex-1 items-center justify-center text-white"
        >
          <House />
        </Link>
        <Link
          href="/messages"
          className="flex flex-1 items-center justify-center text-white"
        >
          <MessageCircleMore />
        </Link>
        <Link
          href="/event"
          className="flex flex-1 items-center justify-center text-white"
        >
          <Globe />
        </Link>
        <Link
          href="/profile"
          className="flex flex-1 items-center justify-center text-white"
        >
          <CircleUserRound />
        </Link>
      </div>
    </nav>
  );
}
