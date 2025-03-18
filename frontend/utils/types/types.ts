// client request types

export type TUserData = {
  fullName: string;
  email: string;
  isAdmin: boolean;
  tokenVersion: string;
  createdAt: string;
  updatedAt: string;
};

export type TUserSignup = {
  fullName: string;
  email: string;
  confirmPassword: string;
  password: string;
};

// server response types

export type TUserContext = {
  fullName: string;
  isAdmin: boolean;
  custom: {
    shortcuts: TShortcut[];
  };
};

export type TShortcut = {
  _id: string;
  shortDescription: string;
  description: string;
  keys: string[];
  type: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export type TShortcutForm = {
  shortDescription: string;
  description: string;
  keys: string[];
  type: string;
};
