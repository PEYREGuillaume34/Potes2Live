"use client";

import Link from "next/link";
import { useSession, signOut } from "@/app/lib/auth-client";
import { useState } from "react";

export function Navbar() {
  const { data: session, isPending } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-lg sm:text-xl font-bold">
              Potes2Live
            </span>
          </Link>

          {/* Burger Menu Button - Mobile */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            aria-label="Menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>

          {/* Navigation - Desktop */}
          <div className="hidden md:flex items-center space-x-6">
            {!isPending && (
              <>
                {session ? (
                  <>
                    <Link
                      href="/concerts"
                      className="text-gray-700 hover:text-purple-600 font-medium transition-colors"
                    >
                      Concerts
                    </Link>
                    <Link
                      href="/profile"
                      className="text-gray-700 hover:text-purple-600 font-medium transition-colors"
                    >
                      Profil
                    </Link>
                    <div className="flex items-center space-x-3">
                      <span className="text-sm text-gray-600">
                        {session.user.name}
                      </span>
                      <button
                        onClick={() => signOut()}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        Déconnexion
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="text-gray-700 hover:text-purple-600 font-medium transition-colors"
                    >
                      Connexion
                    </Link>
                    <Link
                      href="/register"
                      className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      S'inscrire
                    </Link>
                  </>
                )}
              </>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            {!isPending && (
              <>
                {session ? (
                  <div className="flex flex-col space-y-3">
                    <span className="text-sm text-gray-600 px-4">
                      {session.user.name}
                    </span>
                    <Link
                      href="/concerts"
                      className="px-4 py-2 text-gray-700 hover:bg-purple-50 hover:text-purple-600 font-medium transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Concerts
                    </Link>
                    <Link
                      href="/profile"
                      className="px-4 py-2 text-gray-700 hover:bg-purple-50 hover:text-purple-600 font-medium transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Profil
                    </Link>
                    <button
                      onClick={() => {
                        signOut();
                        setMobileMenuOpen(false);
                      }}
                      className="mx-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      Déconnexion
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-3">
                    <Link
                      href="/login"
                      className="px-4 py-2 text-gray-700 hover:bg-purple-50 hover:text-purple-600 font-medium transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Connexion
                    </Link>
                    <Link
                      href="/register"
                      className="mx-4 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors text-center"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      S'inscrire
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}