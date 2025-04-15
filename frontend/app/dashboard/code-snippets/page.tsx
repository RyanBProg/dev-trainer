"use client";

import LoadingSpinner from "@/components/dashboard/LoadingSpinner";
import { useState } from "react";
import toast from "react-hot-toast";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { a11yDark } from "react-syntax-highlighter/dist/esm/styles/prism";

const languageOptions = [
  "c",
  "csharp",
  "go",
  "java",
  "javascript",
  "python",
  "typescript",
];

export default function Page() {
  const [input, setInput] = useState("");
  const [sentMessage, setSentMessage] = useState("");
  const [reply, setReply] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState("javascript");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input) {
      toast.error("Please enter a message");
      return;
    }

    setIsLoading(true);
    setSentMessage(input);
    setReply("");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/snippets`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userInput: input, language: language }),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();

      setReply(data.query);

      setInput("");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto flex flex-col gap-5 h-[calc(100vh-72px)]">
      <div className="grow p-4 overflow-auto">
        {sentMessage ? (
          <div className="relative max-w-4xl mx-auto mt-8 p-6 bg-neutral-900/20 rounded-lg">
            <span className="text-white/50 absolute bottom-2 right-2 text-xs">
              Sent
            </span>
            <div className="text-emerald-100 leading-relaxed prose prose-invert prose-emerald max-w-none">
              {sentMessage}
            </div>
          </div>
        ) : (
          <div className="text-center mt-32 text-xl">
            <h1 className="font-semibold text-3xl sm:text-4xl">
              AI Code Snippet Generator
            </h1>
            <p className="text-sm text-white/80 mt-4">
              Ask for help with common programming tasks
            </p>
            <p className="text-sm sm:text-lg text-accent mt-10">
              <span className="font-semibold">Try</span>
              <br /> &quot;How do I implement merge sort?&quot;
              <br /> or <br />
              &quot;Write function to check if a number is prime&quot;
            </p>
          </div>
        )}
        {reply && (
          <div className="mockup-code w-full mt-10">
            <SyntaxHighlighter language={language} style={a11yDark}>
              {reply}
            </SyntaxHighlighter>
          </div>
        )}
      </div>
      <form
        onSubmit={handleSubmit}
        className="bg-accent/40 pt-2 px-2 rounded-t-lg mx-auto max-w-4xl w-full">
        <div className="bg-accent shadow p-4 rounded-t-md flex flex-col gap-2">
          <label htmlFor="user-input" className="sr-only">
            Message
          </label>
          <textarea
            className="block text-white placeholder:text-white/80 w-full textarea textarea-bordered bg-transparent resize-none"
            id="user-input"
            name="user-input"
            rows={4}
            placeholder="Describe the code snippet you need..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <div className="flex gap-4 justify-end items-end">
            <div className="w-min">
              <label htmlFor="language" className="text-white text-sm">
                Pick a language
              </label>
              <select
                name="language"
                id="language"
                className="select w-44 mt-1"
                value={language}
                onChange={(e) => setLanguage(e.currentTarget.value)}>
                {languageOptions.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <button className="btn btn-md btn-square" disabled={isLoading}>
              {isLoading ? (
                <LoadingSpinner size="22" />
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-arrow-up-icon lucide-arrow-up">
                  <path d="m5 12 7-7 7 7" />
                  <path d="M12 19V5" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
