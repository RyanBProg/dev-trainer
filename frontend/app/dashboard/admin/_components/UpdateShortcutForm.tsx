"use client";

import { useUpdateShortcut } from "@/app/_hooks/useUpdateShortcut";
import { TShortcut, TShortcutForm } from "@/app/_types/types";
import { Dispatch, FormEvent, SetStateAction, useState } from "react";
import { shortcutSchema } from "@/app/_zod/shortcutSchema";
import ShortcutForm from "./ShortcutForm";
import { useDeleteShortcut } from "@/app/_hooks/useDeleteShortcut";

type Props = {
  selectedShortcut: TShortcut;
  setSelectedShortcut: Dispatch<SetStateAction<TShortcut | undefined>>;
};

export default function UpdateShortcutForm({
  selectedShortcut,
  setSelectedShortcut,
}: Props) {
  const [formData, setFormData] = useState<TShortcut | TShortcutForm>(
    selectedShortcut
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    try {
      const result = await useDeleteShortcut(selectedShortcut._id);
      if (!result) {
        throw new Error("Failed to delete shortcut");
      }

      setSelectedShortcut(undefined);
      alert("Shortcut Deleted");
      setIsLoading(false);
    } catch (error) {
      console.log("handleDelete: ", error);
      alert("Failed to delete shortcut");
      setIsLoading(false);
    }
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

      const result = await useUpdateShortcut(formData, selectedShortcut._id);
      if (!result) {
        throw new Error("Failed to update shortcut");
      }

      setIsLoading(false);
      setSelectedShortcut(undefined);
      alert("Shortcut Updated");
    } catch (error) {
      console.log("handleSubmit: ", error);
      alert("Failed to update shortcut");
      setIsLoading(false);
    }
  };

  return (
    <div>
      <ShortcutForm
        handleSubmit={handleSubmit}
        formData={formData}
        setFormData={setFormData}>
        <FormButtons isLoading={isLoading} handleDelete={handleDelete} />
      </ShortcutForm>
    </div>
  );
}

type FormButtonsProps = {
  isLoading: boolean;
  handleDelete: () => Promise<void>;
};

function FormButtons({ isLoading, handleDelete }: FormButtonsProps) {
  return (
    <div className="mt-6 flex gap-4">
      <button type="submit" className="btn btn-success">
        {isLoading ? (
          <div className="flex justify-center items-center">
            <span className="loading loading-spinner loading-sm"></span>
          </div>
        ) : (
          "Update Shortcut"
        )}
      </button>
      <button onClick={handleDelete} type="button" className="btn btn-error">
        {isLoading ? (
          <div className="flex justify-center items-center">
            <span className="loading loading-spinner loading-sm"></span>
          </div>
        ) : (
          "Delete Shortcut"
        )}
      </button>
    </div>
  );
}
