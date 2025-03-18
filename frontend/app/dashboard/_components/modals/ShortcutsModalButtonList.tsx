"use client";

import { TShortcut } from "@/utils/types/types";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

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
  const [shortcuts, setShortcuts] = useState<TShortcut[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchShortcuts = async () => {
      try {
        const encodedType = encodeURIComponent(type);
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/shortcuts/type/${encodedType}`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        const data = await res.json();

        if (data.error) {
          router.push("/login");
          return;
        }

        setShortcuts(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch shortcuts:", error);
      }
    };

    fetchShortcuts();
  }, [type, router]);

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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (shortcuts.length === 0) {
    return <p>No More Shortcuts</p>;
  }

  return (
    <ul className="grid gap-3">
      {shortcuts.map((shortcut) => (
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
  );
}
