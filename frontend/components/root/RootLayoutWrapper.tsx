import RootFooter from "./RootFooter";
import RootNavbar from "./RootNavbar";

export default function RootLayoutWrapper({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen flex flex-col">
      <RootNavbar />
      <main className="flex-1">{children}</main>
      <RootFooter />
    </div>
  );
}
