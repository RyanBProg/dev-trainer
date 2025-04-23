"use client";

import { TShortcut } from "@/utils/types/types";
import { useRouter } from "next/navigation";
import { Dispatch, FormEvent, SetStateAction, useState } from "react";
import { useShortcutsOfType } from "@/hooks/useShortcutsOfType";
import LoadingSpinner from "@/components/dashboard/LoadingSpinner";
import toast from "react-hot-toast";
import { useAddUserShortcuts } from "@/hooks/useAddUserShortcuts";

type Props = {
  type: string;
  userShortcuts: TShortcut[];
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
};

export default function ShortcutsModalSelectList({
  type,
  userShortcuts,
  setIsModalOpen,
}: Props) {
  const [selectedShortcuts, setSelectedShortcuts] = useState<string[]>([]);
  const router = useRouter();
  const [page, setPage] = useState(1);
  const limit = 15;
  const { data, isError, isLoading } = useShortcutsOfType(type, {
    page,
    limit,
  });
  const addShortcutsMutation = useAddUserShortcuts();

  if (isError || (data && data.error)) {
    router.push("/login");
    return null;
  }

  if (isLoading) {
    return <LoadingSpinner size="md" />;
  }

  // filter the list by what the user already has saved to get unsaved shortcuts only
  const unsavedShortcuts: TShortcut[] = data.shortcuts.filter(
    (shortcut: TShortcut) =>
      !userShortcuts.some((userShortcut) => userShortcut._id === shortcut._id)
  );

  if (unsavedShortcuts.length === 0) {
    return <p>No Shortcuts Found</p>;
  }

  const handleCheckboxChange = (id: string) => {
    setSelectedShortcuts((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  async function handleAddShortcuts(e: FormEvent) {
    e.preventDefault();
    if (selectedShortcuts.length === 0) {
      toast.error("No shortcut selected");
      return;
    }

    try {
      await addShortcutsMutation.mutateAsync(selectedShortcuts);
      setIsModalOpen(false);
    } catch (error) {
      toast.error("Failed to add shortcuts");
      console.log(error);
    }
  }

  return (
    <form onSubmit={handleAddShortcuts}>
      <ul className="grid gap-5">
        {unsavedShortcuts.map((shortcut) => (
          <li key={shortcut._id} className="capitalize flex gap-5 items-center">
            <input
              type="checkbox"
              className="checkbox"
              checked={selectedShortcuts.includes(shortcut._id)}
              onChange={() => handleCheckboxChange(shortcut._id)}
            />
            {shortcut.shortDescription}
          </li>
        ))}
      </ul>

      {/* Pagination Controls */}
      {data?.pagination && (
        <div className="flex justify-center gap-2 mt-10">
          <button
            className="btn btn-sm"
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-arrow-left-icon lucide-arrow-left">
              <path d="m12 19-7-7 7-7" />
              <path d="M19 12H5" />
            </svg>
          </button>
          <span className="flex items-center">
            Page {page} of {data.pagination.totalPages}
          </span>
          <button
            className="btn btn-sm"
            type="button"
            onClick={() =>
              setPage((p) => Math.min(data.pagination.totalPages, p + 1))
            }
            disabled={page === data.pagination.totalPages}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-arrow-right-icon lucide-arrow-right">
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </button>
        </div>
      )}

      <button className="btn btn-success mt-10" type="submit">
        Add Shortcuts
      </button>
    </form>
  );
}
