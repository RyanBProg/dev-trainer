"use client";

import { shortcutSchema } from "@/app/_zod/shortcutSchema";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

type Props = {
  method: "POST" | "PUT";
  url: string;
  initalFormData: {
    shortDescription: string;
    description: string;
    keys: string[];
    type: string;
  };
};

export default function ShortcutForm({ method, url, initalFormData }: Props) {
  const [formData, setFormData] = useState(initalFormData);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    event.preventDefault();

    // Initialize an array to hold the key combination
    const keyCombination: string[] = [];

    // Check for macOS-specific modifier keys
    if (event.metaKey) keyCombination.push("cmd");
    if (event.altKey) keyCombination.push("option");
    if (event.shiftKey) keyCombination.push("shift");
    if (event.ctrlKey) keyCombination.push("ctrl");

    // Add the main key (e.g., "a", "Enter") if it's not a modifier
    const key = event.key.toLowerCase();
    if (key === " ") {
      keyCombination.push("space"); // Explicitly handle the spacebar
    } else if (!["meta", "alt", "shift", "control"].includes(key)) {
      keyCombination.push(key);
    }

    // Deduplicate and update the keys in the state
    const uniqueKeys = [...new Set([...formData.keys, ...keyCombination])];
    setFormData((prev) => ({
      ...prev,
      keys: uniqueKeys,
    }));
  };

  const handleClearKeys = () => {
    setFormData((prev) => ({ ...prev, keys: [] }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (formData.type === "") {
        alert("A type must be selected");
        setIsLoading(false);
        return;
      }
      shortcutSchema.parse(formData);

      const res = await fetch(url, {
        method: method,
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ ...formData }),
        credentials: "include",
      });

      if (!res.ok) {
        const resData = await res.json();
        alert(resData.error || "Failed to create shortcut");
        setIsLoading(false);
        return;
      }

      router.refresh();
      alert("Shortcut Submitted");
    } catch (error) {
      console.log("handleSubmit: ", error);
      alert("Form submisson failed");
    }

    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4 items-start sm:grid-cols-2">
        <label htmlFor="title" className="grid gap-1">
          Shortcut Title
          <input
            type="text"
            id="title"
            placeholder="Type here"
            required
            className="input input-bordered w-full text-base"
            value={formData.shortDescription}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                shortDescription: e.target.value,
              }))
            }
          />
        </label>
        <label
          htmlFor="description"
          className="sm:col-start-1 sm:row-start-2 grid gap-1">
          Shortcut Description
          <textarea
            id="description"
            placeholder="Type here"
            required
            className="textarea textarea-bordered w-full text-base"
            value={formData.description}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                description: e.target.value,
              }))
            }
          />
        </label>
        <label htmlFor="keys" className="grid gap-1 relative">
          Keys
          <input
            type="text"
            id="keys"
            placeholder="Press keys here"
            className="input input-bordered w-full text-base"
            onKeyDown={handleKeyDown}
            readOnly
            required
            value={formData.keys.join(" + ")}
          />
          {formData.keys.length > 0 && (
            <button
              type="button"
              onClick={handleClearKeys}
              className="btn btn-circle btn-xs btn-error absolute bottom-3 right-2">
              X
            </button>
          )}
        </label>
        <label htmlFor="type" className="grid gap-1">
          Type
          <select
            className="select select-bordered w-full text-base"
            id="type"
            value={formData.type}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                type: e.target.value,
              }))
            }>
            <option value="">Select an option</option>
            <option value="mac">Mac</option>
            <option value="vs code">VS Code</option>
            <option value="git">Git</option>
            <option value="terminal">Terminal</option>
          </select>
        </label>
      </div>
      <button type="submit" className="btn mt-6">
        {isLoading ? (
          <div className="flex justify-center items-center">
            <span className="loading loading-spinner loading-sm"></span>
          </div>
        ) : (
          "Submit Shortcut"
        )}
      </button>
    </form>
  );
}
