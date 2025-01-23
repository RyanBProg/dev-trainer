"use client";

import { TShortcut } from "@/app/_types/types";
import { useRouter } from "next/navigation";
import { Dispatch, FormEvent, SetStateAction, useState } from "react";
import { useShortcutsOfType } from "../../_hooks/useShortcutsOfType";
import LoadingSpinner from "../LoadingSpinner";
import toast from "react-hot-toast";
import { useAddUserShortcuts } from "../../_hooks/useAddUserShortcuts";

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
  const { data, isError, isLoading } = useShortcutsOfType(type);
  const addShortcutsMutation = useAddUserShortcuts();

  if (isError || (data && data.error)) {
    router.push("/login");
    return null;
  }

  if (isLoading) {
    return <LoadingSpinner size="md" />;
  }

  // filter the list by what the user already has saved to get unsaved shortcuts only
  const unsavedShortcuts: TShortcut[] = data.filter(
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
              onChange={() => handleCheckboxChange(shortcut._id)}></input>
            {shortcut.shortDescription}
          </li>
        ))}
      </ul>
      <button className="btn btn-success mt-10" type="submit">
        Add Shortcuts
      </button>
    </form>
  );
}
