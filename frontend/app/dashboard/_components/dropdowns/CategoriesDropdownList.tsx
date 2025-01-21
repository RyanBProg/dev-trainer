"use client";

type Props = {
  isCategoriesLoading: boolean;
  categories: string[];
  openModal: (category: string) => void;
};

export default function CategoriesDropdownList({
  isCategoriesLoading,
  categories,
  openModal,
}: Props) {
  if (isCategoriesLoading) {
    return (
      <div className="flex justify-center items-center py-2">
        <span className="loading loading-spinner loading-md"></span>
      </div>
    );
  }

  if (categories.length === 0) {
    return <p>No More Shortcuts</p>;
  }

  return (
    <ul>
      {categories.map((category) => (
        <li key={category}>
          <button className="capitalize" onClick={() => openModal(category)}>
            {category}
          </button>
        </li>
      ))}
    </ul>
  );
}
