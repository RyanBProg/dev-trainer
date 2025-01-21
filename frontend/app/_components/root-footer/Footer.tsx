export default function Footer() {
  return (
    <footer className="bg-base-300 text-base-content p-10 flex flex-col sm:flex-row justify-between gap-10">
      <span className="text-xl font-bold pr-4">Dev Trainer</span>
      <div className="flex gap-10">
        <nav className="grid gap-1">
          <h6 className="footer-title">Company</h6>
          <a href="/about" className="link link-hover">
            About us
          </a>
          <a href="/contact" className="link link-hover">
            Contact
          </a>
          <a href="/pricing" className="link link-hover">
            Pricing
          </a>
        </nav>
        <nav className="grid gap-1">
          <h6 className="footer-title">Legal</h6>
          <a href="/terms" className="link link-hover">
            Terms of use
          </a>
          <a href="/privacy-policy" className="link link-hover">
            Privacy policy
          </a>
          <a href="/cookie-policy" className="link link-hover">
            Cookie policy
          </a>
        </nav>
      </div>
    </footer>
  );
}
