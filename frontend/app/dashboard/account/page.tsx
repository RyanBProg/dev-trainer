import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default async function Account() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  if (!accessToken) redirect("/login");

  const res = await fetch("http://localhost:4040/api/user", {
    method: "GET",
    headers: { Cookie: cookieStore.toString() },
  });

  const userInfo = await res.json();
  if (userInfo.error) redirect("/login");

  return (
    <div>
      <h1>My Account</h1>
      <span>Name: {userInfo.fullName}</span>
      <span>Email: {userInfo.email}</span>
      <span>Admin: {userInfo.isAdmin.toString()}</span>
    </div>
  );
}
