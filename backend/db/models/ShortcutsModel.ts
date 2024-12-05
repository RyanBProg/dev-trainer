import mongoose from "mongoose";
const { Schema, model } = mongoose;

const shortcutsSchema = new Schema(
  {
    shortDescription: { type: String, required: true, maxLength: 40 },
    description: { type: String, required: true },
    keys: {
      type: [String],
      required: true,
      validate: {
        validator: (arr: string[]) => arr.length >= 1,
        message: "At least one key is required in the keys array.",
      },
    }, // requires a min of 1 element in the keys array
    type: { type: String, required: true },
  },
  { timestamps: true }
);

const ShortcutsModel = model("shortcuts", shortcutsSchema);
export default ShortcutsModel;
