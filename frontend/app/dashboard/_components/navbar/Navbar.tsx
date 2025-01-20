import AccountMenu from "./AccountMenu";
import NavMenu from "./NavMenu";

export default function Navbar() {
  return (
    <header className="navbar bg-base-100">
      <nav className="navbar-start">
        <NavMenu />
      </nav>

      <div className="navbar-center">
        <span className="text-xl font-bold">Dev Trainer</span>
      </div>
      <div className="navbar-end">
        <AccountMenu />
      </div>
    </header>
  );
}
