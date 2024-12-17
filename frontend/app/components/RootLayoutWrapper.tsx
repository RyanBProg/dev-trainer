export default function RootLayoutWrapper({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen flex flex-col">
      <header>
        <nav>put navbar here</nav>
      </header>
      <main className="flex-1">{children}</main>
      <footer>put footer here</footer>
    </div>
  );
}
