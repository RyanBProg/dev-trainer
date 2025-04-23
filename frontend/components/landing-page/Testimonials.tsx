import Image from "next/image";
import React from "react";
import davePortait from "@/public/assets/images/dave-dover-portait.jpeg";

export default function Testimonials() {
  return (
    <section className="py-20 px-5 sm:px-10 bg-primary">
      <div className="max-w-screen-xl px-4 py-8 mx-auto text-center lg:py-16 lg:px-6">
        <figure className="max-w-screen-md mx-auto">
          <svg
            className="h-12 mx-auto mb-3 text-info"
            viewBox="0 0 24 27"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
              d="M14.017 18L14.017 10.609C14.017 4.905 17.748 1.039 23 0L23.995 2.151C21.563 3.068 20 5.789 20 8H24V18H14.017ZM0 18V10.609C0 4.905 3.748 1.038 9 0L9.996 2.151C7.563 3.068 6 5.789 6 8H9.983L9.983 18L0 18Z"
              fill="currentColor"
            />
          </svg>
          <blockquote>
            <p className="text-xl sm:text-2xl font-medium text-neutral-content">
              &quot;This tool has completely transformed how I work! I used to
              struggle remembering shortcuts, but now I can easily access my
              personalized list and focus on learning the ones I need most.
              It&apos;s a must-have for any developer.&quot;
            </p>
          </blockquote>
          <figcaption className="flex items-center justify-center mt-6 space-x-3">
            <Image
              className="w-6 h-6 rounded-full"
              src={davePortait}
              alt="kim dover portrait"
              height={24}
              width={24}
            />
            <div className="flex items-center divide-x-2 divide-gray-700">
              <div className="pr-3 font-medium text-white">Dave Dover</div>
              <div className="pl-3 text-sm font-light text-neutral-content">
                CEO at DevScope
              </div>
            </div>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
