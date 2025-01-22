"use client";

type Props = {
  categories: string[];
  openModal: (category: string) => void;
};

export default function CategoriesDropdownList({
  categories,
  openModal,
}: Props) {
  if (categories.length === 0) {
    return <p>No Shortcuts Found</p>;
  }

  return (
    <>
      {categories.map((category) => (
        <li key={category}>
          <button className="capitalize" onClick={() => openModal(category)}>
            {category}
          </button>
        </li>
      ))}
    </>
  );
}
