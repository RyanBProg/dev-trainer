"use client";

import { useState } from "react";
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

  const openModal = (category: string) => {
    setType(category);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="dropdown dropdown-bottom">
        <div
          tabIndex={0}
          onClick={() => fetchCategories()}
          role="button"
          className="btn m-1">
          + Add New Category
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
