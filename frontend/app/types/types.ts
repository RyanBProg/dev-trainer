// client request types

export type TUserSignup = {
  fullName: string;
  email: string;
  confirmPassword: string;
  password: string;
};

// server response types

type TUserBasicData = {
  fullName: string;
  isAdmin: boolean;
};

type TUserPersonalData = {
  fullName: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  isAdmin: boolean;
};

type TUserShortcutsData = {
  shortcuts: string[];
};

export type TShortcut = {
  id: string;
  shortDescription: string;
  description: string;
  keys: string[];
  type: string;
};
