"use client";

import { useState } from "react";
import { joinGroup } from "@/app/actions/groups.actions";
import { useRouter } from "next/navigation";

type JoinGroupButtonProps = {
  groupId: number;
  isFull: boolean;
};

export function JoinGroupButton({ groupId, isFull }: JoinGroupButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleJoin = async () => {
    setLoading(true);
    setError("");

    const result = await joinGroup(groupId);

    if (result.success) {
      router.refresh();
    } else {
      setError(result.error || "Erreur");
    }

    setLoading(false);
  };

  return (
    <div className="flex-1">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm mb-3">
          {error}
        </div>
      )}
      
      <button
        onClick={handleJoin}
        disabled={loading || isFull}
        className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-colors"
      >
        {loading ? "Inscription..." : isFull ? "Groupe complet" : "👥 Rejoindre le groupe"}
      </button>
    </div>
  );
}