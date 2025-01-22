"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TShortcut } from "@/app/_types/types";
import UpdateShortcutForm from "./UpdateShortcutForm";
import ShortcutsModalButtonList from "../../_components/modals/ShortcutsModalButtonList";
import CategoriesDropdownList from "../../_components/dropdowns/CategoriesDropdownList";
import ShortcutsModal from "../../_components/modals/ShortcutsModal";
import LoadingSpinner from "../../_components/LoadingSpinner";
import { useCategoryDropdownMenu } from "../../_hooks/useCategoryDropdownMenu";
import { useShortcutCategories } from "../../_hooks/useShortcutCategories";

export default function EditShortcut() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [type, setType] = useState("");
  const [selectedShortcut, setSelectedShortcut] = useState<TShortcut>();
  const router = useRouter();
  const {
    dropdownMenuOpen,
    toggleDropdownMenu,
    menuButtonRef,
    dropdownMenuRef,
  } = useCategoryDropdownMenu();

  const { data, isError, isLoading } = useShortcutCategories();

  if (isError || (data && data.error)) {
    router.push("/login");
    return null;
  }

  const openModal = (category: string) => {
    toggleDropdownMenu();
    setType(category);
    setIsModalOpen(true);
  };

  return (
    <div className="my-10">
      <h2 className="mb-4 font-semibold text-lg">Update a Shortcut</h2>
      <div className="dropdown dropdown-bottom mb-4">
        <button
          ref={menuButtonRef}
          onClick={toggleDropdownMenu}
          className="btn btn-primary">
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
        </button>
        {dropdownMenuOpen && (
          <ul
            className="absolute left-0 translate-y-3 menu bg-primary capitalize font-medium z-[1] w-52 p-2"
            ref={dropdownMenuRef}>
            {isLoading ? (
              <LoadingSpinner size="md" />
            ) : (
              <CategoriesDropdownList categories={data} openModal={openModal} />
            )}
          </ul>
        )}
      </div>

      {isModalOpen && (
        <ShortcutsModal setIsModalOpen={setIsModalOpen} type={type}>
          <ShortcutsModalButtonList
            type={type}
            setSelectedShortcut={setSelectedShortcut}
            setIsModalOpen={setIsModalOpen}
          />
        </ShortcutsModal>
      )}

      {selectedShortcut && (
        <>
          <UpdateShortcutForm
            key={selectedShortcut._id}
            selectedShortcut={selectedShortcut}
            setSelectedShortcut={setSelectedShortcut}
          />
        </>
      )}
    </div>
  );
}
