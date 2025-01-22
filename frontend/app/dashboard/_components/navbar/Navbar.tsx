import AccountMenu from "./AccountMenu";
import NavMenu from "./NavMenu";

export default function Navbar() {
  return (
    <header className="relative flex justify-between items-center p-3 bg-base-300">
      <NavMenu />
      <span className="text-xl font-bold">Dev Trainer</span>
      <AccountMenu />
    </header>
  );
}
