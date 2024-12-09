export type TCreateShortcutRequestBody = {
  shortDescription: string;
  description: string;
  keys: string[];
  type: string;
};

export type TSignupRequestBody = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export type TLoginRequestBody = {
  email: string;
  password: string;
};
