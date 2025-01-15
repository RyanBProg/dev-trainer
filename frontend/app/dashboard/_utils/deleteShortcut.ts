export async function deleteShortcut(shortcutId: string) {
  try {
    const res = await fetch(
      `http://localhost:4040/api/shortcuts/admin/${shortcutId}`,
      {
        method: "DELETE",
        credentials: "include",
      }
    );

    const resData = await res.json();

    if (!res.ok) {
      alert(resData.error || "Failed to delete shortcut");
      return;
    }

    return resData;
  } catch (error) {
    console.log("useDeleteShortcut: ", error);
  }
}
