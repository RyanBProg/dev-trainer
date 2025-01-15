import { TShortcutForm } from "../_types/types";

export async function useUpdateShortcut(
  formData: TShortcutForm,
  shortcutId: string
) {
  try {
    const res = await fetch(
      `http://localhost:4040/api/shortcuts/admin/${shortcutId}`,
      {
        method: "PUT",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include",
      }
    );

    const resData = await res.json();

    if (!res.ok) {
      alert(resData.error || "Failed to update shortcut");
      return;
    }

    return resData;
  } catch (error) {
    console.log("useUpdateShortcut: ", error);
  }
}
