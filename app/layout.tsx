import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "./components/ui/Navbar";

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
    <html lang="fr">
      <body className={inter.className}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
