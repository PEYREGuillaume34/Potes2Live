import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "./components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Potes2Live - Concerts et groupes de fans",
  description: "Trouvez des concerts et formez des groupes pour y aller ensemble",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="bg-black">
      <body className={`${inter.className} bg-black min-h-screen w-full`}>
        <main className="w-full bg-black min-h-screen pb-[calc(4rem+env(safe-area-inset-bottom))] md:pb-0">
          <div className="max-w-8xl mx-auto px-1">
            {children}
          </div>
        </main>
        <Navbar />
      </body>
    </html>
  );
}
