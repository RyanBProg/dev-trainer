import mongoose from "mongoose";
const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    givenName: { type: String, default: null },
    familyName: { type: String, default: null },
    fullName: { type: String, default: null },
    googleId: { type: String, default: null },
    email: { type: String, required: true, unique: true },
    password: { type: String, default: null },
    oAuth_access_token: { type: String, default: null },
    oAuth_token_expiry: { type: Date, default: null },
    oAuth_refresh_token: { type: String, default: null },
    isAdmin: { type: Boolean, default: false },
    wasDeleted: { type: Boolean, default: false },
    profilePicture: {
      data: { type: Buffer, default: null },
      contentType: { type: String, default: null },
    },
    custom: {
      shortcuts: [
        { type: Schema.Types.ObjectId, ref: "shortcuts", default: [] },
      ],
    },
  },
  {
    timestamps: true,
    strict: true,
  }
);

const UserModel = model("user", userSchema);
export default UserModel;
