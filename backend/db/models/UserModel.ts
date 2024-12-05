import mongoose from "mongoose";
const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minLength: 8 },
    custom: {
      shortcuts: [
        { type: [Schema.Types.ObjectId], ref: "shortcuts", default: [] },
      ],
    },
  },
  { timestamps: true }
);

const UserModel = model("user", userSchema);
export default UserModel;