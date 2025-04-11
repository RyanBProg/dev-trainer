import mongoose from "mongoose";
const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    givenName: { type: String },
    familyName: { type: String },
    fullName: { type: String },
    googleId: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    oAuth_access_token: { type: String },
    oAuth_token_expiry: { type: String },
    oAuth_refresh_token: { type: String },
    isAdmin: { type: Boolean, default: false },
    profilePicture: {
      data: { type: Buffer },
      contentType: { type: String },
    },
    custom: {
      shortcuts: [
        { type: Schema.Types.ObjectId, ref: "shortcuts", default: [] },
      ],
    },
  },
  { timestamps: true }
);

const UserModel = model("user", userSchema);
export default UserModel;
