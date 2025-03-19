"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TShortcut } from "@/utils/types/types";
import ShortcutsModalSelectList from "@/components/dashboard/modals/ShortcutsModalSelectList";
import ShortcutsModal from "@/components/dashboard/modals/ShortcutsModal";
import CategoriesDropdownList from "@/components/dashboard/CategoriesDropdownList";
import { useShortcutCategories } from "@/hooks/useShortcutCategories";
import LoadingSpinner from "@/components/dashboard/LoadingSpinner";
import { useCategoryDropdownMenu } from "@/hooks/useCategoryDropdownMenu";

type NewCategoryButtonProps = {
  userShortcuts: TShortcut[];
};

export default function NewCategoryButton({
  userShortcuts,
}: NewCategoryButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [type, setType] = useState("");
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
    <>
      <div className="relative mb-10">
        <button
          ref={menuButtonRef}
          onClick={toggleDropdownMenu}
          className="btn btn-primary">
          + Add New Category
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
