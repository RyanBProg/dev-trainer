import { TSignupRequestBody } from "../../types/types";

export const normaliseRequestBody = (body: TSignupRequestBody) => {
  return {
    fullName: body.fullName.toLowerCase(),
    email: body.email.toLowerCase(),
    password: body.password,
    confirmPassword: body.confirmPassword,
  };
};
