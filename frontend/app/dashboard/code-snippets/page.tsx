"use client";

import LoadingSpinner from "@/components/dashboard/LoadingSpinner";
import { useState } from "react";
import toast from "react-hot-toast";

export default function page() {
  const [input, setInput] = useState("");
  const [sentMessage, setSentMessage] = useState("");
  const [reply, setReply] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userInput: input, language: "python" }),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error("No reader available");
      }

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const rawData = line.slice(6);
            if (rawData.trim() === "[DONE]") {
              break;
            }
            try {
              const data = JSON.parse(rawData);
              setReply((prev) => prev + data.word);
            } catch (error) {
              console.error("Error parsing JSON:", error);
            }
          }
        }
      }

      setInput("");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto flex flex-col flex-1">
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
          <h1 className="text-center mt-44 text-xl">
            What can I do for you today?
          </h1>
        )}
        {reply && (
          <div className="relative max-w-4xl mx-auto mt-8 p-6 bg-emerald-900/20 rounded-lg">
            <span className="text-emerald-300/50 absolute bottom-2 right-2 text-xs">
              AI Agent
            </span>
            <div
              className="text-emerald-100 leading-relaxed prose prose-invert prose-emerald max-w-none"
              dangerouslySetInnerHTML={{ __html: reply }}
            />
          </div>
        )}
      </div>
      <form
        onSubmit={handleSubmit}
        className="bg-emerald-900/40 pt-2 px-2 rounded-t-lg mx-auto max-w-4xl w-full">
        <div className="bg-emerald-700 shadow p-4 rounded-t-md flex items-start justify-between gap-4">
          <div className="grow">
            <label htmlFor="user-input" className="sr-only"></label>
            <textarea
              className="block text-white placeholder:text-emerald-300 w-full bg-transparent focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-8 focus:ring-offset-emerald-700 rounded-xs transition-all duration-300 resize-none"
              id="user-input"
              name="user-input"
              rows={4}
              placeholder="Type your message here..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </div>
          {isLoading ? (
            <LoadingSpinner size="22" />
          ) : (
            <button className=" text-emerald-100 p-4 rounded-md bg-black/70 transition-colors duration-300 hover:cursor-pointer hover:bg-black">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                className="lucide lucide-arrow-up-icon lucide-arrow-up">
                <path d="m5 12 7-7 7 7" />
                <path d="M12 19V5" />
              </svg>
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
