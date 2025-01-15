"use client";

import { useState } from "react";
import { TShortcut } from "../_types/types";

export async function useShortcutsofType(type: string) {
  const [shortcuts, setShortcuts] = useState<TShortcut[]>([]);

  try {
    const encodedType = encodeURIComponent(type);

    const res = await fetch(
      `http://localhost:4040/api/shortcuts/type/${encodedType}`,
      {
        method: "GET",
        credentials: "include",
      }
    );

    const resData = await res.json();

    if (!res.ok) {
      alert(resData.error || "Failed to update shortcut");
      return;
    }

    setShortcuts(resData);
  } catch (error) {
    console.log("useShortcutsofType: ", error);
  }

  return { shortcuts, setShortcuts };
}
