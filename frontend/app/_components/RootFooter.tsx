export default function RootFooter() {
  return (
    <footer className="footer bg-base-300 text-primary-content p-4">
      <p>Copyright © {new Date().getFullYear()} - All Rights Reserved</p>
      <nav className="grid-flow-col gap-4 md:justify-self-end">
        <ul className="flex flex-wrap gap-3">
          <li>
            <a className="link link-hover">Terms of Use</a>
          </li>
          <li>
            <a className="link link-hover">Privacy Policy</a>
          </li>
          <li>
            <a className="link link-hover">Cookie Policy</a>
          </li>
        </ul>
      </nav>
    </footer>
  );
}
