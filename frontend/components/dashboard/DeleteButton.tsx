"use client";

import { useDeleteUserShortcut } from "@/hooks/useDeleteUserShortcut";
import toast from "react-hot-toast";

export default function DeleteButton({ shortcutId }: { shortcutId: string }) {
  const deleteShortcutsMutation = useDeleteUserShortcut();

  const handleDelete = async () => {
    try {
      await deleteShortcutsMutation.mutateAsync(shortcutId);
    } catch (error) {
      toast.error("Failed to delete shortcut");
      console.log(error);
    }
  };

  return (
    <button onClick={handleDelete} className="btn btn-square btn-xs bg-red-700">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </button>
  );
}
