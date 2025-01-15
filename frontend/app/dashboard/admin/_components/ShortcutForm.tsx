"use client";

import { Dispatch, FormEvent, ReactNode, SetStateAction } from "react";
import { getKeyDownValue } from "../../_utils/getKeyDownValue";
import { TShortcut, TShortcutForm } from "@/app/_types/types";

type Props = {
  handleSubmit: (e: FormEvent) => Promise<void>;
  formData: TShortcut | TShortcutForm;
  setFormData: Dispatch<SetStateAction<TShortcut | TShortcutForm>>;
  children: ReactNode;
};

export default function ShortcutForm({
  handleSubmit,
  formData,
  setFormData,
  children,
}: Props) {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    const key = getKeyDownValue(event);

    // Deduplicate and update the keys in the state
    const uniqueKeys = [...new Set([...formData.keys, key])];
    setFormData((prev) => ({
      ...prev,
      keys: uniqueKeys,
    }));
  };

  const handleClearKeys = () => {
    setFormData((prev) => ({ ...prev, keys: [] }));
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
      {children}
    </form>
  );
}
