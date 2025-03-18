import Link from "next/link";

export default function RootFooter() {
  return (
    <footer className="footer bg-base-300 text-primary-content p-4">
      <p>Copyright © {new Date().getFullYear()} - All Rights Reserved</p>
      <nav className="grid-flow-col gap-4 md:justify-self-end">
        <Link href="/" className="link link-hover">
          Home
        </Link>
        <Link href="/policy" className="link link-hover">
          Our Policies
        </Link>
      </nav>
    </footer>
  );
}
