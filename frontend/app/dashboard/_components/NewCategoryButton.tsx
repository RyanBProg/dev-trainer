"use client";

import { Dispatch, FormEvent, SetStateAction, useState } from "react";
import { useRouter } from "next/navigation";
import { TShortcut } from "@/app/_types/types";

type NewCategoryButtonProps = {
  userShortcuts: TShortcut[];
};

export default function NewCategoryButton({
  userShortcuts,
}: NewCategoryButtonProps) {
  const [shortcuts, setShortcuts] = useState<TShortcut[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedShortcuts, setSelectedShortcuts] = useState<string[]>([]);
  const [categories, setCategories] = useState([]);
  const router = useRouter();

  const fetchCategories = async () => {
    const res = await fetch("http://localhost:4040/api/shortcuts/types", {
      method: "GET",
      credentials: "include",
    });

    const categories = await res.json();
    if (categories.error) router.push("/login");
    setCategories(categories);
  };

  const fetchShortcuts = async (type: string) => {
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

      // filter the list by what the user already has saved to get unsaved shortcuts only
      const newShortcuts = data.filter(
        (shortcut: TShortcut) =>
          !userShortcuts.some(
            (userShortcut) => userShortcut._id === shortcut._id
          )
      );

      setShortcuts(newShortcuts);
    } catch (error) {
      console.error("Failed to fetch shortcuts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleDropdown = () => {
    if (!isDropdownOpen) {
      setIsDropdownOpen(true);
      fetchCategories();
    } else {
      setIsDropdownOpen(false);
    }
  };

  const openModal = (category: string) => {
    setIsDropdownOpen(false);
    setIsModalOpen(true);
    fetchShortcuts(category);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedShortcuts([]);
  };

  return (
    <>
      <div className="dropdown dropdown-bottom">
        <div
          tabIndex={0}
          onClick={toggleDropdown}
          role="button"
          className="btn m-1">
          + Add New Category
        </div>
        <ul
          tabIndex={0}
          className="dropdown-content menu bg-base-200 rounded-box z-[1] w-52 p-2 shadow">
          {categories.length === 0 ? (
            <div className="flex justify-center items-center py-2">
              <span className="loading loading-spinner loading-md"></span>
            </div>
          ) : (
            categories.map((category) => (
              <li key={category}>
                <button onClick={() => openModal(category)}>{category}</button>
              </li>
            ))
          )}
        </ul>
      </div>

      {isModalOpen && (
        <div className="z-50">
          <div className="fixed inset-0 bg-white/10 backdrop-blur-sm"></div>
          <dialog id={`my_modal_dropdown`} className="modal" open>
            <div className="modal-box relative bg-neutral-900">
              <button
                type="button"
                className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                onClick={closeModal}>
                ✕
              </button>
              {isLoading ? (
                <div className="flex justify-center items-center">
                  <span className="loading loading-spinner loading-lg"></span>
                </div>
              ) : (
                <FormModal
                  shortcuts={shortcuts}
                  selectedShortcuts={selectedShortcuts}
                  setSelectedShortcuts={setSelectedShortcuts}
                  isLoading={isLoading}
                  setIsModalOpen={setIsModalOpen}
                />
              )}
            </div>
          </dialog>
        </div>
      )}
    </>
  );
}

type FormModalProps = {
  shortcuts: TShortcut[];
  selectedShortcuts: string[];
  setSelectedShortcuts: Dispatch<SetStateAction<string[]>>;
  isLoading: boolean;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
};

function FormModal({
  shortcuts,
  selectedShortcuts,
  setSelectedShortcuts,
  isLoading,
  setIsModalOpen,
}: FormModalProps) {
  const router = useRouter();

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

  if (shortcuts.length === 0) {
    return <p>No More Shortcuts</p>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <h3 className="font-bold text-lg mb-4 capitalize">Shortcut List</h3>
      {isLoading ? (
        <div className="flex justify-center items-center">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : (
        <ul className="grid gap-3">
          {shortcuts.map((shortcut) => (
            <li
              key={shortcut._id}
              className="capitalize flex gap-2 items-center">
              <input
                type="checkbox"
                className="checkbox"
                checked={selectedShortcuts.includes(shortcut._id)}
                onChange={() => handleCheckboxChange(shortcut._id)}></input>
              {shortcut.shortDescription}
            </li>
          ))}
        </ul>
      )}
      <button className="btn mt-8" type="submit">
        Add Shortcuts
      </button>
    </form>
  );
}
