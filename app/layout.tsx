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
      <body className={inter.className}>
        <main className="pb-16 md:pb-0 md:pt-16 bg-black" >
        {children}
        </main>
        <Navbar />
      </body>
    </html>
  );
}
