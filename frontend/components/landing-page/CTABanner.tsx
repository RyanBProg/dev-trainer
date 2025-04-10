import githubIcon from "@/public/assets/icons/github-icon-60x60.svg";
import linkedinIcon from "@/public/assets/icons/linkedin-icon-60x60.svg";
import Image from "next/image";
import Link from "next/link";

export default function CTABanner() {
  return (
    <section className="bg-accent py-20 sm:py-44 px-5 sm:px-10">
      <div className="text-center flex flex-col items-center max-w-screen-md mx-auto">
        <span className="badge badge-success mb-5">New Features Added</span>
        <h1 className="text-4xl sm:text-7xl text-black font-bold tracking-tight leading-none mb-10">
          Master Your Shortcuts with Ease
        </h1>
        <p className="text-base sm:text-lg text-neutral-content">
          Streamline your workflow by curating and organizing the shortcuts you
          want to learn. Access a comprehensive database, create a personalized
          list, and boost your productivity.
        </p>
        <div className="flex gap-5 mt-5">
          <Link href="/login" className="btn btn-primary">
            Login
          </Link>
          <Link href="/signup" className="btn btn-primary btn-outline">
            Sign Up
          </Link>
        </div>
        <div className="mt-20">
          <span className="font-semibold text-neutral-content uppercase">
            FEATURED IN
          </span>
          <div className="flex flex-wrap gap-8 justify-center items-center text-black mt-5">
            <Link
              href="https://github.com/RyanBProg"
              target="_blank"
              className="btn btn-ghost inline-flex items-center gap-2 h-fit w-fit">
              <Image src={githubIcon} alt="github icon" />
              <span className="font-semibold text-2xl">GitHub</span>
            </Link>
            <Link
              href="https://www.linkedin.com/in/ryan-bowler-601919170/"
              target="_blank"
              className="btn btn-ghost flex items-center gap-2 h-fit w-fit">
              <Image src={linkedinIcon} alt="linkedin icon" />
              <span className="font-semibold text-2xl">LinkedIn</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
