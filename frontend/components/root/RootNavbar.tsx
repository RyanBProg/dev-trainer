import Link from "next/link";

export default function RootNavbar() {
  return (
    <header className="p-3 bg-base-300 flex justify-between items-center">
      <Link href="/" className="text-xl font-bold pl-4 hover:opacity-50">
        Dev Trainer
      </Link>
      <div className="flex gap-3">
        <Link href="/login" className="btn btn-primary">
          Login
        </Link>
        <Link href="/signup" className="btn btn-primary btn-outline">
          Sign Up
        </Link>
      </div>
    </header>
  );
}
