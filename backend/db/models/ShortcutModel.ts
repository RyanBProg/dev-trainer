import mongoose from "mongoose";
const { Schema, model } = mongoose;

export const shortcutSchema = new Schema(
  {
    shortDescription: { type: String, required: true, maxLength: 40 },
    description: { type: String, required: true },
    keys: {
      type: [String],
      required: true,
      validate: {
        validator: (arr: string[]) =>
          arr.length >= 1 && arr.every((key) => key.trim() !== ""),
        message: "Keys array must have at least one non-empty string.",
      },
    }, // requires a min of 1 element in the keys array
    type: { type: String, required: true },
  },
  { timestamps: true }
);

const ShortcutModel = model("shortcuts", shortcutSchema);
export default ShortcutModel;
