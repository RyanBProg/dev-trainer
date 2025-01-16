export async function deleteUserShortcut(shortcutId: string) {
  try {
    const res = await fetch(
      `http://localhost:4040/api/user/shortcuts/${shortcutId}`,
      {
        method: "DELETE",
        credentials: "include",
      }
    );

    if (!res.ok) {
      throw new Error("Failed to delete the shortcut");
    }

    console.log("Shortcut deleted successfully!");
  } catch (error) {
    console.error("Error deleting shortcut:", error);
  }
}
