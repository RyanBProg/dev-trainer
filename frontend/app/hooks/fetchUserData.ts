export async function fetchUserData() {
  try {
    const res = await fetch("http://localhost:4040/api/user", {
      credentials: "include",
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
