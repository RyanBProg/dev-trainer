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
    <>
      <div className="card bg-base-300 shadow-xl max-w-[600px] mx-auto mt-20 p-10">
        <h1 className="font-bold text-3xl text-white">My Account</h1>
        <div className="grid gap-4 mt-10">
          <div className="grid">
            <span className="font-semibold">Full Name</span>
            <span className="text-xl capitalize">{userInfo.fullName}</span>
          </div>
          <div className="grid">
            <span className="font-semibold">Email</span>
            <span className="text-xl">{userInfo.email}</span>
          </div>
          <div className="grid">
            <span className="font-semibold">Member Since</span>
            <span className="text-xl">{userInfo.createdAt.split("T")[0]}</span>
          </div>
          <div className="grid gap-2">
            <span className="font-semibold">Admin</span>
            <input
              type="checkbox"
              checked={userInfo.isAdmin}
              className="checkbox"
              disabled={true}
            />
          </div>
        </div>
        <div className="mt-10 flex gap-4">
          <button className="btn btn-accent">Logout</button>
          <button className="btn btn-outline">Admin Request</button>
          <button className="btn btn-outline btn-error">Delete Account</button>
        </div>
      </div>
    </>
  );
}
