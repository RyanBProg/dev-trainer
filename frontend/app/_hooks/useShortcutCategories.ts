"use client";

import { useState } from "react";

export async function useShortcutCategories() {
  const [categories, setCategories] = useState<string[]>([]);

  try {
    const res = await fetch("http://localhost:4040/api/shortcuts/types", {
      method: "GET",
      credentials: "include",
    });

    const resData = await res.json();

    if (!res.ok) {
      alert(resData.error || "Failed to update shortcut");
      return;
    }

    setCategories(resData);
  } catch (error) {
    console.log("useShortcutCategories: ", error);
  }

  return { categories, setCategories };
}
