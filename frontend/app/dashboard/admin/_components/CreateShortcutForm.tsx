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
        setFormData={setFormData}>
        <FormButtons isLoading={isLoading} />
      </ShortcutForm>
    </div>
  );
}

function FormButtons({ isLoading }: { isLoading: boolean }) {
  return (
    <div className="mt-6 flex gap-4">
      <button type="submit" className="btn btn-success">
        {isLoading ? (
          <div className="flex justify-center items-center">
            <span className="loading loading-spinner loading-sm"></span>
          </div>
        ) : (
          "Create Shortcut"
        )}
      </button>
    </div>
  );
}
