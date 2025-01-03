import { cookies } from "next/headers";

export async function fetchUserShortcuts() {
  try {
    const cookieStore = await cookies();

    const res = await fetch("http://localhost:4040/api/user/shortcuts", {
      method: "GET",
      headers: { Cookie: cookieStore.toString() },
    });
    const userData = await res.json();
    if (userData.error) {
      throw new Error(userData.error);
    }
    return userData;
  } catch (error) {
    console.log(error);
    return;
  }
}
