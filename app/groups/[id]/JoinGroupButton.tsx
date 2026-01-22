"use client";

import { joinGroup } from "@/app/actions/groups.actions";
import { useRouter } from "next/navigation";
import { useState } from "react";

type JoinGroupButtonProps = {
  groupId: number;
  isFull: boolean;
};

export function JoinGroupButton({ groupId, isFull }: JoinGroupButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleJoin = async () => {
    setIsLoading(true);
    const result = await joinGroup(groupId);

    if (result.success) {
      router.refresh();
    } else {
      alert(result.error || "Erreur lors de la tentative de rejoindre le groupe");
    }
    setIsLoading(false);
  };

  return (
    <button
      onClick={handleJoin}
      disabled={isFull || isLoading}
      className={`px-6 py-3 rounded-lg font-medium transition-colors ${
        isFull
          ? "bg-gray-300 text-gray-600 cursor-not-allowed"
          : "bg-purple-600 hover:bg-purple-700 text-white"
      }`}
    >
      {isLoading ? "..." : isFull ? "Groupe complet" : "Rejoindre le groupe"}
    </button>
  );
}
