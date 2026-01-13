"use client";

import { useState } from "react";
import { leaveGroup } from "@/app/actions/groups.actions";
import { useRouter } from "next/navigation";

type LeaveGroupButtonProps = {
  groupId: number;
};

export function LeaveGroupButton({ groupId }: LeaveGroupButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleLeave = async () => {
    setLoading(true);

    const result = await leaveGroup(groupId);

    if (result.success) {
      router.push("/concerts");
      router.refresh();
    }

    setLoading(false);
  };

  if (showConfirm) {
    return (
      <div className="flex-1 space-y-2">
        <p className="text-sm text-red-600 font-medium text-center">
          Êtes-vous sûr de vouloir quitter ?
        </p>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowConfirm(false)}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 rounded-lg transition-colors text-sm"
          >
            Annuler
          </button>
          <button
            onClick={handleLeave}
            disabled={loading}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-lg transition-colors text-sm"
          >
            {loading ? "..." : "Confirmer"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => setShowConfirm(true)}
      className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-lg transition-colors"
    >
      Quitter le groupe
    </button>
  );
}