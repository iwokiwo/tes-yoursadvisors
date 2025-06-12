import axios from "axios";

export interface CreateUserPayload {
  name: string;
  slug: string;
  allowed_domains: string[];
  description?: string;
  limit_one_response: boolean;
}

export interface UserData extends CreateUserPayload {
  id: string;
}

export const createUserApi = async (
  payload: CreateUserPayload,
  token: string
) => {
  const response = await axios.post(
    "https://interview.yoursadvisors.co.id/api/v1/forms",
    payload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const getUserApi = async (token: string, id?: string): Promise<UserData[]> => {
    const url = id
    ? `https://interview.yoursadvisors.co.id/api/v1/forms/${id}`
    : "https://interview.yoursadvisors.co.id/api/v1/forms";
  const response = await axios.get(
    url,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data.forms;
};

