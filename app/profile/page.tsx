import Link from "next/link";
import { Settings } from "lucide-react";


export default function ProfilePage() {
       return (
        <div className="min-h-screen flex flex-col bg-gris-fonce">
            {/* Header fixe en haut */}
            <header className="fixed top-0 left-0 right-0 bg-gris-fonce z-10 border-b border-gray-700">
                <div className="flex items-center justify-between px-4 py-4">
                    <h1 className="text-2xl font-bold text-white">Profil</h1>
                    <Link 
                        href="/settings" 
                        className="p-2 hover:bg-gray-700 rounded-full transition-colors"
                        aria-label="Paramètres"
                    >
                        <Settings className="w-6 h-6 text-white" />
                    </Link>
                </div>
            </header>
            {/* Contenu principal avec marge pour le header */}
            <main className="flex-grow pt-20 px-4">
                <div className="text-white">
                    <h2 className="text-xl font-semibold mb-2">Bienvenue sur votre profil !</h2>
                    <p className="mb-6">Gérez vos informations personnelles et vos préférences ici.</p>
                    <h2 className="text-xl font-semibold mb-2">Historique de concerts</h2>
                    <p className="mb-6">Vos concerts passés apparaîtront ici.</p>
                    <h2 className="text-xl font-semibold mb-2">Tes artistes préférés</h2>
                    <p className="mb-6">Vos artistes favoris apparaîtront ici.</p>
                </div>
            </main>
        </div>
    );
            
}