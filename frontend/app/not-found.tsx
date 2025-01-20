import Link from "next/link";

export default function Custom404() {
  return (
    <div className="fixed inset-0 flex flex-col justify-center items-center gap-10">
      <h1 className="font-bold text-3xl">404 - Page Not Found</h1>
      <div className="flex flex-col gap-5 sm:flex-row">
        <Link href={"/dashboard"} className="btn btn-outline">
          Return To Dashboard
        </Link>
        <Link href={"/"} className="btn btn-outline">
          Return To Home
        </Link>
      </div>
    </div>
  );
}
