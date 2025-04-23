import RootLayoutWrapper from "@/components/root/RootLayoutWrapper";
import Image from "next/image";
import dashboardImage from "@/public/assets/images/dashboard-screenshot.png";
import snippetImage from "@/public/assets/images/snippets-screenshot.png";
import adminImage from "@/public/assets/images/admin-screenshot.png";
import CTABanner from "@/components/landing-page/CTABanner";
import Testimonials from "@/components/landing-page/Testimonials";

export default function Home() {
  return (
    <RootLayoutWrapper>
      <section className="px-5 sm:px-10">
        <h1 className="font-semibold text-2xl tracking-tight mt-64 text-accent">
          Custom Cheatsheets
        </h1>
        <p className="font-bold text-white text-[4rem] sm:text-[5rem] tracking-tight capitalize leading-none">
          Your Shortcuts,
          <br />
          in <span className="text-info">one place</span>
        </p>
      </section>
      <section className="relative w-full px-5">
        <div className="container mx-auto mt-44">
          <div className="mockup-window border-white/20 border mx-auto max-w-[700px] relative z-0">
            <div className="border-white/20 border-t">
              <Image src={dashboardImage} alt="dashboard" className="z-0" />
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-b from-transparent to-base-300 h-20 "></div>
      </section>
      <CTABanner />
      <section className="px-5 sm:px-10">
        <span className="badge badge-success mb-5 mt-64">New Feature</span>
        <h2 className="font-bold text-white text-[4rem] sm:text-[5rem] tracking-tight capitalize leading-none">
          <span className="text-accent">AI</span> Code
          <br />
          Snippets
        </h2>
      </section>
      <section className="relative w-full px-5">
        <div className="container mx-auto mt-44">
          <div className="mockup-window border-white/20 border mx-auto max-w-[700px] relative z-0">
            <div className="border-white/20 border-t">
              <Image src={snippetImage} alt="code snippets" className="z-0" />
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-b from-transparent to-base-300 h-20 "></div>
      </section>
      <Testimonials />
      <section className="px-5 sm:px-10">
        <h2 className="font-bold text-white text-[4rem] sm:text-[5rem] tracking-tight capitalize leading-none mt-64">
          Admin <span className="text-info">Control</span>
        </h2>
        <p className="font-semibold text-2xl tracking-tight text-accent">
          Features an admin panel for managing our extensive shortcut library
        </p>
      </section>
      <section className="relative w-full px-5">
        <div className="container mx-auto mt-44">
          <div className="mockup-window border-white/20 border mx-auto max-w-[700px] relative z-0">
            <div className="border-white/20 border-t">
              <Image src={adminImage} alt="admin panel" className="z-0" />
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-b from-transparent to-base-300 h-20 "></div>
      </section>
    </RootLayoutWrapper>
  );
}
