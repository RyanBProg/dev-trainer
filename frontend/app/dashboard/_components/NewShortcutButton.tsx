"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { TShortcut } from "@/app/_types/types";

export default function NewShortcutButton({
  type,
  index,
}: {
  type: string;
  index: number;
}) {
  const [shortcuts, setShortcuts] = useState<TShortcut[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedShortcuts, setSelectedShortcuts] = useState<string[]>([]);
  const router = useRouter();

  const fetchShortcuts = async () => {
    try {
      setIsLoading(true);
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

      setShortcuts(data);
    } catch (error) {
      console.error("Failed to fetch shortcuts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
    fetchShortcuts();
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedShortcuts([]);
  };

  const handleCheckboxChange = (id: string) => {
    setSelectedShortcuts((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  async function handleSubmit(e: FormEvent) {
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

  return (
    <>
      <button className="btn btn-sm" onClick={openModal}>
        + Add Shortcut
      </button>

      {isModalOpen && (
        <dialog id={`my_modal_${index}`} className="modal" open>
          <form className="modal-box relative" onSubmit={handleSubmit}>
            <button
              type="button"
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={closeModal}>
              ✕
            </button>
            <h3 className="font-bold text-lg mb-4 capitalize">
              {type} Shortcuts
            </h3>
            <ul className="grid gap-2">
              {isLoading ? (
                <div className="flex justify-center items-center">
                  <span className="loading loading-spinner loading-lg"></span>
                </div>
              ) : shortcuts.length === 0 ? (
                <p>No shortcuts found.</p>
              ) : (
                shortcuts.map((shortcut) => (
                  <li
                    key={shortcut._id}
                    className="capitalize flex gap-2 items-center">
                    <input
                      type="checkbox"
                      className="checkbox"
                      checked={selectedShortcuts.includes(shortcut._id)}
                      onChange={() =>
                        handleCheckboxChange(shortcut._id)
                      }></input>
                    {shortcut.shortDescription}
                  </li>
                ))
              )}
            </ul>
            <button className="btn mt-4" type="submit">
              Add Shortcuts
            </button>
          </form>
        </dialog>
      )}
    </>
  );
}
