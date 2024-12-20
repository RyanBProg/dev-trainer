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
      <div className="dropdown dropdown-bottom">
        <div tabIndex={0} role="button" className="btn m-1">
          + Add New Category
        </div>
        <ul
          tabIndex={0}
          className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
          {categories.length === 0 ? (
            <>Loading...</>
          ) : (
            categories.map((categorie) => (
              <li key={categorie}>
                <button>{categorie}</button>
              </li>
            ))
          )}
        </ul>
      </div>
    </>
  );
}
