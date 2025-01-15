import { TShortcutForm } from "@/app/_types/types";

export async function createShortcut(formData: TShortcutForm) {
  try {
    const res = await fetch("http://localhost:4040/api/shortcuts/admin", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(formData),
      credentials: "include",
    });

    const resData = await res.json();

    if (!res.ok) {
      console.log(resData.error || "Failed to create shortcut");
      return;
    }

    return resData;
  } catch (error) {
    console.log("createShortcut: ", error);
  }
}
