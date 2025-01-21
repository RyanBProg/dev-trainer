"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { TShortcut } from "@/app/_types/types";
import UpdateShortcutForm from "./UpdateShortcutForm";
import ShortcutsModalButtonList from "../../_components/modals/ShortcutsModalButtonList";
import CategoriesDropdownList from "../../_components/dropdowns/CategoriesDropdownList";
import ShortcutsModal from "../../_components/modals/ShortcutsModal";

export default function EditShortcut() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownButtonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedShortcut, setSelectedShortcut] = useState<TShortcut>();
  const [categories, setCategories] = useState([]);
  const [type, setType] = useState("");
  const router = useRouter();

  const fetchCategories = async () => {
    try {
      const res = await fetch("http://localhost:4040/api/shortcuts/types", {
        method: "GET",
        credentials: "include",
      });

      const categories = await res.json();
      if (categories.error) router.push("/login");
      setCategories(categories);
      setIsCategoriesLoading(false);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const toggleNavMenu = () => {
    if (dropdownOpen) {
      setDropdownOpen(false);
    } else {
      fetchCategories();
      setDropdownOpen(true);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // check if the click is outside the menu dropdown and not the menu button
      if (
        dropdownOpen &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        dropdownButtonRef.current &&
        !dropdownButtonRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  const openModal = (category: string) => {
    toggleNavMenu();
    setType(category);
    setIsModalOpen(true);
  };

  return (
    <div className="my-10">
      <h2 className="mb-4 font-semibold text-lg">Update a Shortcut</h2>
      <div className="dropdown dropdown-bottom mb-4">
        <button
          ref={dropdownButtonRef}
          onClick={toggleNavMenu}
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
        {dropdownOpen && (
          <div
            className="absolute left-0 translate-y-3 menu bg-primary z-[1] w-52 p-2 shadow"
            ref={dropdownRef}>
            <CategoriesDropdownList
              isCategoriesLoading={isCategoriesLoading}
              categories={categories}
              openModal={openModal}
            />
          </div>
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
