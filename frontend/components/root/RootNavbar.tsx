import Link from "next/link";
import Image from "next/image";
import googleIcon from "@/public/assets/icons/googel-icon.png";

export default function RootNavbar() {
  return (
    <header className="p-3 bg-base-300 flex justify-between items-center">
      <Link href="/" className="text-xl font-bold pl-4 hover:opacity-50">
        Dev Trainer
      </Link>
      <div className="flex gap-3">
        <Link
          href={`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/auth/oauth-signin`}
          className="btn btn-primary flex gap-4">
          <Image src={googleIcon} alt="google icon" height={24} width={24} />
          <span>Sign In</span>
        </Link>
      </div>
    </header>
  );
}
