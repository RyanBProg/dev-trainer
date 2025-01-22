"use client";

import { FormEvent, useState } from "react";
import ShortcutForm from "./ShortcutForm";
import { shortcutSchema } from "@/app/_zod/formSchemas";
import toast from "react-hot-toast";
import { useCreateShortcut } from "../../_hooks/useCreateShortcut";

const blankFormData = {
  shortDescription: "",
  description: "",
  keys: [] as string[],
  type: "",
};

export default function CreateShortcutForm() {
  const [formData, setFormData] = useState(blankFormData);
  const createShortcutMutation = useCreateShortcut();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const result = shortcutSchema.safeParse(formData);
    if (!result.success) {
      toast.error(result.error.errors[0].message || "Something went wrong");
      return;
    }

    try {
      await createShortcutMutation.mutateAsync(formData);
      toast.success("Shortcut Created");
      setFormData(blankFormData);
    } catch (error) {
      toast.error("Failed to create shortcut");
    }
  };

  return (
    <div>
      <ShortcutForm
        handleSubmit={handleSubmit}
        formData={formData}
        setFormData={setFormData}>
        <FormButtons isLoading={createShortcutMutation.isPending} />
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
