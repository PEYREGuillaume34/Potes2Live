"use client";

import Link from "next/link";
import { CircleUserRound, House, MessageCircleMore, Speaker, Users } from "lucide-react";

export function Navbar() {

  return (
    <nav className="fixed bottom-0 md:top-0 md:bottom-auto left-0 right-0 bg-orange-fonce z-50">
      <div className="flex w-full h-16 md:justify-center md:gap-8">
        
        <Link
          href="/"
          className="flex flex-1 md:flex-none items-center justify-center md:gap-2 text-white md:px-6 hover:bg-orange-clair"
        >
          <House />
          <span className="hidden md:block">Accueil</span>
        </Link>
        
        <Link
          href="/groups"
          className="flex flex-1 md:flex-none items-center justify-center md:gap-2 text-white md:px-6 hover:bg-orange-clair"
        >
          <Users />
          <span className="hidden md:block">Groupes</span>
        </Link>
        
        <Link
          href="/messages"
          className="flex flex-1 md:flex-none items-center justify-center md:gap-2 text-white md:px-6 hover:bg-orange-clair"
        >
          <MessageCircleMore />
          <span className="hidden md:block">Messages</span>
        </Link>
        
        <Link
          href="/concerts"
          className="flex flex-1 md:flex-none items-center justify-center md:gap-2 text-white md:px-6 hover:bg-orange-clair"
        >
          <Speaker />
          <span className="hidden md:block">Concerts</span>
        </Link>
        
        <Link
          href="/profile"
          className="flex flex-1 md:flex-none items-center justify-center md:gap-2 text-white md:px-6 hover:bg-orange-clair"
        >
          <CircleUserRound />
          <span className="hidden md:block">Profil</span>
        </Link>
      </div>
    </nav>
  );
}
