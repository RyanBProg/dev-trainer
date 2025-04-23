"use client";

import { useAddUserShortcuts } from "@/hooks/useAddUserShortcuts";
import { useShortcutsOfType } from "@/hooks/useShortcutsOfType";
import { TShortcut } from "@/utils/types/types";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import LoadingSpinner from "../LoadingSpinner";

type Props = {
  type: string;
  setSelectedShortcut: Dispatch<SetStateAction<TShortcut | undefined>>;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
};

export default function ShortcutsModalButtonList({
  type,
  setSelectedShortcut,
  setIsModalOpen,
}: Props) {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const limit = 15;
  const { data, isError, isLoading } = useShortcutsOfType(type, {
    page,
    limit,
  });

  if (isError || (data && data.error)) {
    router.push("/login");
    return null;
  }

  if (isLoading) {
    return <LoadingSpinner size="md" />;
  }

  if (data.shortcuts.length < 1) {
    return <p>No Shortcuts Found</p>;
  }

  async function handleSubmit(eValue: string) {
    if (eValue === "") {
      alert("No shortcut selected");
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/shortcuts/${eValue}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const fetchedShortcut = await res.json();
      setSelectedShortcut(fetchedShortcut);
    } catch (error) {
      console.error("Failed to add shortcut:", error);
    }

    setIsModalOpen(false);
  }

  return (
    <>
      <ul className="grid gap-3">
        {data.shortcuts.map((shortcut: TShortcut) => (
          <li key={shortcut._id} className="capitalize flex gap-2 items-center">
            <button
              className="btn capitalize"
              value={shortcut._id}
              onClick={(e) => handleSubmit(e.currentTarget.value)}
              type="button">
              {shortcut.shortDescription}
            </button>
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
    </>
  );
}
