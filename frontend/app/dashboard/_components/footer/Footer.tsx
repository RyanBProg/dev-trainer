export default function Footer() {
  return (
    <footer className="footer bg-base-300 text-primary-content p-4">
      <p>Copyright © {new Date().getFullYear()} - All right reserved</p>
      <nav className="grid-flow-col gap-4 md:justify-self-end">
        <ul className="flex flex-wrap gap-3">
          <li>
            <a className="link link-hover">Terms of use</a>
          </li>
          <li>
            <a className="link link-hover">Privacy policy</a>
          </li>
          <li>
            <a className="link link-hover">Cookie policy</a>
          </li>
        </ul>
      </nav>
    </footer>
  );
}
