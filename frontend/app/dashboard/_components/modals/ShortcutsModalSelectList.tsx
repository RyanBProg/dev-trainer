"use client";

import { TShortcut } from "@/app/_types/types";
import { useRouter } from "next/navigation";
import {
  Dispatch,
  FormEvent,
  SetStateAction,
  useEffect,
  useState,
} from "react";

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
  const [shortcuts, setShortcuts] = useState<TShortcut[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedShortcuts, setSelectedShortcuts] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchShortcuts = async () => {
      try {
        const encodedType = encodeURIComponent(type);
        const res = await fetch(
          `http://localhost:4040/api/shortcuts/type/${encodedType}`,
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

        // filter the list by what the user already has saved to get unsaved shortcuts only
        const newShortcuts = data.filter(
          (shortcut: TShortcut) =>
            !userShortcuts.some(
              (userShortcut) => userShortcut._id === shortcut._id
            )
        );

        setShortcuts(newShortcuts);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch shortcuts:", error);
      }
    };

    fetchShortcuts();
  }, []);

  const handleCheckboxChange = (id: string) => {
    setSelectedShortcuts((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  async function handleAddShortcuts(e: FormEvent) {
    e.preventDefault();
    if (selectedShortcuts.length === 0) {
      alert("No shortcut selected");
      return;
    }

    try {
      await fetch("http://localhost:4040/api/user/shortcuts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shortcutIds: selectedShortcuts }),
        credentials: "include",
      });
    } catch (error) {
      console.error("Failed to add shortcut:", error);
    }

    setIsModalOpen(false);
    router.refresh();
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
    <form onSubmit={handleAddShortcuts}>
      <ul className="grid gap-3">
        {shortcuts.map((shortcut) => (
          <li key={shortcut._id} className="capitalize flex gap-2 items-center">
            <input
              type="checkbox"
              className="checkbox"
              checked={selectedShortcuts.includes(shortcut._id)}
              onChange={() => handleCheckboxChange(shortcut._id)}></input>
            {shortcut.shortDescription}
          </li>
        ))}
      </ul>
      <button className="btn mt-8" type="submit">
        Add Shortcuts
      </button>
    </form>
  );
}
