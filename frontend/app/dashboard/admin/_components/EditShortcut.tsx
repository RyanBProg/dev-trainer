"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TShortcut } from "@/app/_types/types";
import UpdateShortcutForm from "./UpdateShortcutForm";
import ShortcutsModalButtonList from "../../_components/modals/ShortcutsModalButtonList";
import CategoriesDropdownList from "../../_components/dropdowns/CategoriesDropdownList";
import ShortcutsModal from "../../_components/modals/ShortcutsModal";

export default function EditShortcut() {
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

  const openModal = (category: string) => {
    setType(category);
    setIsModalOpen(true);
  };

  return (
    <div className="my-10">
      <h2 className="mb-4 font-semibold text-lg">Update a Shortcut</h2>
      <div className="dropdown dropdown-bottom mb-4">
        <div
          tabIndex={0}
          onClick={() => fetchCategories()}
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
        <div
          tabIndex={0}
          className="dropdown-content menu bg-base-200 rounded-box z-[1] w-52 p-2 shadow">
          <CategoriesDropdownList
            isCategoriesLoading={isCategoriesLoading}
            categories={categories}
            openModal={openModal}
          />
        </div>
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
