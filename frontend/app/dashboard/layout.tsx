import Footer from "./_components/footer/Footer";
import Navbar from "./_components/navbar/Navbar";
import { UserContextProvider } from "@/app/_context/userContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <UserContextProvider>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </UserContextProvider>
  );
}
