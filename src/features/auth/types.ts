export interface LoginPayload {
  username: string;
  password: string;
}

export interface LoginResponse {
  data: {
    token: string;
    expiry: string;
  };
}