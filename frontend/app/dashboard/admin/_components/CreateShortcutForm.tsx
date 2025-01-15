"use client";

import { useCreateShortcut } from "@/app/_hooks/useCreateShortcut";
import ShortcutForm from "./ShortcutForm";
import { FormEvent, useState } from "react";
import { shortcutSchema } from "@/app/_zod/shortcutSchema";

const blankFormData = {
  shortDescription: "",
  description: "",
  keys: [] as string[],
  type: "",
};

export default function CreateShortcutForm() {
  const [formData, setFormData] = useState(blankFormData);
  const [isLoading, setIsLoading] = useState(false);

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

      const result = await useCreateShortcut(formData);
      if (!result) {
        throw new Error("Failed to create shortcut");
      }

      setFormData(blankFormData);
      setIsLoading(false);
      alert("Shortcut Created");
    } catch (error) {
      console.log("handleSubmit: ", error);
      alert("Failed to create shortcut");
      setIsLoading(false);
    }
  };

  return (
    <div>
      <ShortcutForm
        handleSubmit={handleSubmit}
        formData={formData}
        setFormData={setFormData}
        isLoading={isLoading}
      />
    </div>
  );
}
