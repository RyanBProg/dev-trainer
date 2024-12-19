"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function NewCategoryButton() {
  const [categories, setCategories] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await fetch("http://localhost:4040/api/shortcuts/types", {
        method: "GET",
        credentials: "include",
      });

      const categories = await res.json();
      if (categories.error) router.push("/login");
      setCategories(categories);
    };

    fetchCategories();
  }, []);

  if (categories.length === 0) return <>Loading...</>;

  return (
    <>
      <button
        className="btn btn-sm"
        onClick={() => document.getElementById("my_modal_3").showModal()}>
        + Add New Category
      </button>
      <dialog id="my_modal_3" className="modal">
        <div className="modal-box">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg">Categories</h3>
          <ul>
            {categories.length === 0 ? (
              <>Loading...</>
            ) : (
              categories.map((categorie) => (
                <li key={categorie}>{categorie}</li>
              ))
            )}
          </ul>
        </div>
      </dialog>
    </>
  );
}
