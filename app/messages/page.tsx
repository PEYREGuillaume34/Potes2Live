import { MessageCircleMore } from "lucide-react";

export default function MessagesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 pb-24 md:py-20">
      <div className="mb-8">
      <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <MessageCircleMore className="w-8 h-8 text-orange-clair" />
          Messages
        </h1>
      <p className="text-gray-400">Consultez vos messages et discutez avec d&apos;autres fans de concerts!</p>
    </div>
    </div>
  );
}
