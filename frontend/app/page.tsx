import RootLayoutWrapper from "./_components/RootLayoutWrapper";
import Image from "next/image";
import dashboardImage from "@/app/_assets/images/dashboard-screenshot.png";
import CTABanner from "./_components/home/CTABanner";
import Testimonials from "./_components/home/Testimonials";

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
      <Testimonials />
    </RootLayoutWrapper>
  );
}
