// services/authService.ts
import axios from "axios";

const API_URL = "https://interview.yoursadvisors.co.id/api/v1/auth/login";

type LoginCredentials = {
  email: string;
  password: string;
};

type UserResponse = {
  name: string;
  email: string;
  accessToken: string;
};

export const loginApi = async (credentials: LoginCredentials): Promise<UserResponse> => {
  const response = await axios.post(API_URL, credentials);
  return response.data.user;
};
