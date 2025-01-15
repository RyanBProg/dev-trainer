"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { useRouter } from "next/navigation";
import { TShortcut } from "@/app/_types/types";
import UpdateShortcutForm from "./UpdateShortcutForm";

export default function EditShortcut() {
  const [shortcuts, setShortcuts] = useState<TShortcut[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedShortcut, setSelectedShortcut] = useState<TShortcut>();
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

      setShortcuts(data);
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
  };

  return (
    <div className="my-10">
      <h2 className="mb-4 font-semibold text-lg">Update a Shortcut</h2>
      <div className="dropdown dropdown-bottom mb-4">
        <div
          tabIndex={0}
          onClick={toggleDropdown}
          role="button"
          className="btn">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="h-4 w-4 opacity-70">
            <path
              fillRule="evenodd"
              d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
              clipRule="evenodd"
            />
          </svg>
          Find a Shortcut
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
                  setSelectedShortcut={setSelectedShortcut}
                  isLoading={isLoading}
                  setIsModalOpen={setIsModalOpen}
                />
              )}
            </div>
          </dialog>
        </div>
      )}
      {selectedShortcut && (
        <>
          <UpdateShortcutForm
            selectedShortcut={selectedShortcut}
            setSelectedShortcut={setSelectedShortcut}
          />
        </>
      )}
    </div>
  );
}

type FormModalProps = {
  shortcuts: TShortcut[];
  setSelectedShortcut: Dispatch<SetStateAction<TShortcut | undefined>>;
  isLoading: boolean;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
};

function FormModal({
  shortcuts,
  setSelectedShortcut,
  isLoading,
  setIsModalOpen,
}: FormModalProps) {
  async function handleSubmit(eValue: string) {
    if (eValue === "") {
      alert("No shortcut selected");
      return;
    }

    try {
      const res = await fetch(`http://localhost:4040/api/shortcuts/${eValue}`, {
        method: "GET",
        credentials: "include",
      });

      const fetchedShortcut = await res.json();
      setSelectedShortcut(fetchedShortcut);
    } catch (error) {
      console.error("Failed to add shortcut:", error);
    }

    setIsModalOpen(false);
  }

  return (
    <div>
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
      )}
    </div>
  );
}
