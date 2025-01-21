"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { TShortcut } from "@/app/_types/types";
import ShortcutsModalSelectList from "./modals/ShortcutsModalSelectList";
import ShortcutsModal from "./modals/ShortcutsModal";
import CategoriesDropdownList from "./dropdowns/CategoriesDropdownList";

type NewCategoryButtonProps = {
  userShortcuts: TShortcut[];
};

export default function NewCategoryButton({
  userShortcuts,
}: NewCategoryButtonProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownButtonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
    <>
      <div className="relative mb-10">
        <button
          ref={dropdownButtonRef}
          onClick={toggleNavMenu}
          className="btn btn-primary">
          + Add New Category
        </button>
        {dropdownOpen && (
          <div
            className="absolute left-0 translate-y-3 menu bg-primary capitalize font-medium z-[1] w-52 p-2"
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
          <ShortcutsModalSelectList
            type={type}
            userShortcuts={userShortcuts}
            setIsModalOpen={setIsModalOpen}
          />
        </ShortcutsModal>
      )}
    </>
  );
}
