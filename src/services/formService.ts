import axios from "axios";

export interface CreateFormPayload {
  name: string;
  slug: string;
  allowed_domains: string[];
  description?: string;
  limit_one_response?: boolean;
}

export const createForm = async (data: CreateFormPayload, token: string) => {
  const response = await axios.post(
    "https://interview.yoursadvisors.co.id/api/v1/forms",
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};
