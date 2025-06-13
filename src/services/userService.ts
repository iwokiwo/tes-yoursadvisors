import axios from "axios";
import { baseUrl, choiceTypes } from "../constants/form";

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

export interface SelectedFormmData extends CreateUserPayload {
  id: string;
  questions: any
  creator_id: string;
}

export interface CreateQuestionPayload {
  name: string;
  choice_type: (typeof choiceTypes)[number];
  is_required: boolean;
  choices?: any;
   id?: string;
}

export const createUserApi = async (
  payload: CreateUserPayload,
  token: string
) => {
  const response = await axios.post(
    `${baseUrl}/api/v1/forms`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const createQuestionApi = async (
  payload: CreateQuestionPayload,
  token: string,
  formSlug: string
) => {
  const response = await axios.post(
    `${baseUrl}/api/v1/forms/${formSlug}/questions`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const deleteQuestionApi = async (
  id: number,
  token: string,
  formSlug: string
) => {
  const response = await axios.delete(
    `${baseUrl}/api/v1/forms/${formSlug}/questions/${id}`,
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
    ? `${baseUrl}/api/v1/forms/${id}`
    : `${baseUrl}/api/v1/forms`;
  const response = await axios.get(
    url,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return id ? response.data.form : response.data.forms;
};

export const getFormByIdApi = async (token: string, id?: string): Promise<SelectedFormmData> => {
    const url =`${baseUrl}/api/v1/forms/${id}`
  const response = await axios.get(
    url,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data.form;
};


