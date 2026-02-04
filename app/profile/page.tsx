import Link from "next/link";
import { Settings } from "lucide-react";


export default function ProfilePage() {
       return (
        <div className="flex flex-col bg-black">
            {/* Header fixe en haut - mobile uniquement */}
            <header className="md:hidden fixed top-0 left-0 right-0 bg-black z-10 border-b border-gray-700">
                <div className="flex items-center justify-between px-4 py-4">
                    <h1 className="text-2xl font-bold text-white">Profil</h1>
                    <Link 
                        href="/profile-edit" 
                        className="p-2 hover:bg-gray-800 rounded-full transition-colors"
                        aria-label="Paramètres"
                    >
                        <Settings className="w-6 h-6 text-white" />
                    </Link>
                </div>
            </header>

{/* Header desktop - dans le flux normal */}
<div className="hidden md:flex items-center justify-between px-4 py-6 border-b border-gray-700">
    <h1 className="text-2xl font-bold text-white">Profil</h1>
    <Link
        href="/profile-edit"
        className="p-2 hover:bg-gray-800 rounded-full transition-colors"
        aria-label="Paramètres"
    >
        <Settings className="w-6 h-6 text-white" />
    </Link>
</div>


            {/* Contenu principal avec marge pour le header */}
            <main className="flex-grow pt-20 px-4">
                <div className="text-white">
                    <h2 className="text-xl font-semibold mb-2">Bienvenue sur votre profil !</h2>
                    <p className="mb-6">Gérez vos informations personnelles et vos préférences ici.</p>
                    <h2 className="text-xl font-semibold mb-2 mt-4">Historique de concerts</h2>
                    <p className="bg-gray-800 border border-gray-700 text-gray-400 rounded-lg p-4 w-full">Vos concerts passés apparaîtront ici.</p>
                    <h2 className="text-xl font-semibold mb-2 mt-4">Tes artistes préférés</h2>
                    <p className="bg-gray-800 border border-gray-700 text-gray-400 rounded-lg p-4 w-full">Vos artistes favoris apparaîtront ici.</p>
                </div>
            </main>
        </div>
    );
            
}