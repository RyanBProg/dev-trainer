"use client";

import { Dispatch, FormEvent, SetStateAction, useState } from "react";
import { TShortcut, TShortcutForm } from "@/app/_types/types";
import { shortcutSchema } from "@/app/_zod/formSchemas";
import ShortcutForm from "./ShortcutForm";
import toast from "react-hot-toast";
import { useUpdateShortcut } from "../../_hooks/useUpdateShortcut";
import { useDeleteShortcut } from "../../_hooks/useDeleteShortcut";

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
  const updateShortcutMutation = useUpdateShortcut();
  const deleteShortcutMutation = useDeleteShortcut();

  const handleDelete = async () => {
    try {
      await deleteShortcutMutation.mutateAsync(selectedShortcut._id);
      toast.success("Shortcut Deleted");
      setSelectedShortcut(undefined);
    } catch (error) {
      toast.error("Failed to Delete Shortcut");
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const result = shortcutSchema.safeParse(formData);
    if (!result.success) {
      toast.error(result.error.errors[0].message || "Something went wrong");
      return;
    }

    try {
      await updateShortcutMutation.mutateAsync({
        formData,
        shortcutId: selectedShortcut._id,
      });
      toast.success("Shortcut Updated");
      setSelectedShortcut(undefined);
    } catch (error) {
      toast.error("Failed to Update Shortcut");
    }
  };

  return (
    <ShortcutForm
      handleSubmit={handleSubmit}
      formData={formData}
      setFormData={setFormData}>
      <FormButtons
        isLoading={updateShortcutMutation.isPending}
        handleDelete={handleDelete}
      />
    </ShortcutForm>
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
