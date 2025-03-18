import roadworkImage from "@/public/assets/images/roadwork-sign.png";
import Image from "next/image";

export default function page() {
  return (
    <div className="px-8 mt-32">
      <div className="container mx-auto flex flex-col gap-20 items-center">
        <Image src={roadworkImage} alt="roadworks icon" />
        <div className="flex flex-col gap-4 items-center">
          <span className="badge badge-outline badge-lg">Coming Soon</span>
          <h1 className="font-bold text-4xl">Code Snippets</h1>
        </div>
      </div>
    </div>
  );
}
