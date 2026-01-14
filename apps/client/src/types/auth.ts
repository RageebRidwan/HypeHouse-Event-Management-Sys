export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: string;
  verified: boolean;
  emailVerified: boolean;
  acceptedHostTerms?: boolean;
  createdAt: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  data: {
    token: string;
    user: User;
  };
}

export interface RegisterInput {
  email: string;
  password: string;
  name: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface ErrorResponse {
  success: false;
  error: string;
}
