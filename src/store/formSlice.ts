// store/userSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { createFormApi, createQuestionApi, createResponsesApi, deleteQuestionApi, getFormApi, getFormByIdApi, getResponseApi } from "../services/formService";
import { choiceTypes } from "../constants/form";

export interface UserFormData {
  name: string;
  slug: string;
  allowed_domains: string[];
  description?: string;
  limit_one_response: boolean;
  id?: string;
}

export interface SelectedFormmData  extends UserFormData {
  questions: any
  creator_id: string;
}

interface UserState {
  loading: boolean;
  successMessage: string | null;
  errorMessage: string | null;
  fieldErrors: Record<string, string[]>;
  selectedForm: SelectedFormmData | null;
  responses: any,
  errorCode: number
}

const initialState: UserState = {
  loading: false,
  successMessage: null,
  errorMessage: null,
  selectedForm: null,
  responses:null,
  errorCode:200,
  fieldErrors: {},
};

export interface CreateQuestionForm {
  name: string;
  choice_type: (typeof choiceTypes)[number];
  is_required: boolean;
  choices?: any;
}

export interface CreateResponsesForm {
   answers: any[]
}

export const createFormAsync = createAsyncThunk(
  "user/createUser",
  async (formData: UserFormData, { rejectWithValue }) => {
    try {
       const token = JSON.parse(localStorage.getItem("user") || "{}").accessToken || "";
      const response = await createFormApi(formData, token);
      return response.message;
    } catch (error: any) {
      if (error.response?.status === 422) {
        return rejectWithValue({ type: "fields", errors: error.response.data.errors });
      }
      if (error.response?.status === 401) {
        return rejectWithValue({ type: "auth", message: "You are not authorized." });
      }
      return rejectWithValue({ type: "general", message: "Something went wrong." });
    }
  }
);
export const getFormAsync = createAsyncThunk(
  "user/getForms",
  async (_, { rejectWithValue }) => {
    try {
      const token = JSON.parse(localStorage.getItem("user") || "{}").accessToken || "";
      const data = await getFormApi(token);
      return data;
    } catch (error: any) {
      return rejectWithValue("Failed to fetch forms.");
    }
  }
);

export const getFormByIdAsync = createAsyncThunk(
  "user/getForms/id",
  async ({
      formSlug,
    }: {formSlug: string }, { rejectWithValue }) => {
    try {
      const token = JSON.parse(localStorage.getItem("user") || "{}").accessToken || "";
      const data = await getFormByIdApi(token, formSlug);
      return data;
    } catch (error: any) {
      return rejectWithValue({
        message: "Failed to fetch forms.",
        code: error?.response?.status || 500,
      });
    }
  }
);

export const getResponsesAsync = createAsyncThunk(
  "user/getResponses/id",
  async ({
      formSlug,
    }: {formSlug: string }, { rejectWithValue }) => {
    try {
      const token = JSON.parse(localStorage.getItem("user") || "{}").accessToken || "";
      const data = await getResponseApi(token, formSlug);
      return data.responses;
    } catch (error: any) {
      return rejectWithValue({
        message: "Failed to fetch forms.",
        code: error?.response?.status || 500,
      });
    }
  }
);

export const createQuestionAsync = createAsyncThunk(
  "user/createQuestion",
  async ({
      formData,
      formSlug,
    }: { formData: CreateQuestionForm; formSlug: string }, 
    { rejectWithValue }
  ) => {
    try {
       const token = JSON.parse(localStorage.getItem("user") || "{}").accessToken || "";
      const response = await createQuestionApi(formData, token, formSlug);
      return response
    } catch (error: any) {
      if (error.response?.status === 422) {
        return rejectWithValue({ type: "fields", errors: error.response.data.errors });
      }
      if (error.response?.status === 401) {
        return rejectWithValue({ type: "auth", message: "You are not authorized." });
      }
      return rejectWithValue({ type: "general", message: "Something went wrong." });
    }
  }
);
export const createResponsesAsync = createAsyncThunk(
  "user/createResponses",
  async ({
      formData,
      formSlug,
    }: { formData: CreateResponsesForm; formSlug: string }, 
    { rejectWithValue }
  ) => {
    try {
       const token = JSON.parse(localStorage.getItem("user") || "{}").accessToken || "";
      const response = await createResponsesApi(formData, token, formSlug);
      return response.message;
    } catch (error: any) {
      if (error.response?.status === 422) {
        return rejectWithValue({ type: "fields", errors: error.response.data.errors });
      }
      if (error.response?.status === 401) {
        return rejectWithValue({ type: "auth", message: "You are not authorized." });
      }
      return rejectWithValue({ type: "general", message: "Something went wrong." });
    }
  }
);

export const deleteQuestionAsync = createAsyncThunk(
  "user/delete/id",
  async ({
      id,
      formSlug,
    }: {id: number, formSlug: string }, { rejectWithValue }) => {
    try {
      const token = JSON.parse(localStorage.getItem("user") || "{}").accessToken || "";
      const data = await deleteQuestionApi(id, token, formSlug);
      return data;
    } catch (error: any) {
      return rejectWithValue({
        message: "Failed to fetch forms.",
        code: error?.response?.status || 500,
      });
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearUserState: (state) => {
      state.loading = false;
      state.successMessage = null;
      state.errorMessage = null;
      state.fieldErrors = {};
      state.selectedForm = null;
    },
    setSelectedForm: (state, action) => {
      state.selectedForm = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createFormAsync.pending, (state) => {
        state.loading = true;
        state.successMessage = null;
        state.errorMessage = null;
        state.fieldErrors = {};
        state.errorCode =0
      })
      .addCase(createFormAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload;
      })
      .addCase(createFormAsync.rejected, (state, action: any) => {
        state.loading = false;
        if (action.payload?.type === "fields") {
          state.fieldErrors = action.payload.errors;
        } else {
          state.errorMessage = action.payload?.message || "Failed to submit.";
        }
      });

       builder
      .addCase(createQuestionAsync.pending, (state) => {
        state.loading = true;
        state.errorMessage = null;
        state.successMessage = null;
        state.fieldErrors = {};
        state.selectedForm = null;
        state.errorCode =0
      })
      .addCase(createQuestionAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
      })
      .addCase(createQuestionAsync.rejected, (state, action: any) => {
        console.log(" action.payload.code",  action.payload.code)
        state.loading = false;
        state.errorMessage = action.payload.message || "Failed to fetch form.";
        state.errorCode = action.payload?.code;
      });

    builder
      .addCase(getFormByIdAsync.pending, (state) => {
        state.loading = true;
        state.errorMessage = null;
        state.successMessage = null;
        state.fieldErrors = {};
        state.selectedForm = null;
        state.errorCode =0
      })
      .addCase(getFormByIdAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedForm = action.payload; // simpan ke selectedForm
      })
      .addCase(getFormByIdAsync.rejected, (state, action: any) => {
        console.log(" action.payload.code",  action.payload.code)
        state.loading = false;
        state.errorMessage = action.payload.message || "Failed to fetch form.";
        state.errorCode = action.payload?.code;
      });

    builder
      .addCase(getResponsesAsync.pending, (state) => {
        state.loading = true;
        state.errorMessage = null;
        state.successMessage = null;
        state.fieldErrors = {};
        state.selectedForm = null;
        state.errorCode =0
      })
      .addCase(getResponsesAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.responses = action.payload; // simpan ke selectedForm
      })
      .addCase(getResponsesAsync.rejected, (state, action: any) => {
        console.log(" action.payload.code",  action.payload.code)
        state.loading = false;
        state.errorMessage = action.payload.message || "Failed to fetch form.";
        state.errorCode = action.payload?.code;
      });

    builder
      .addCase(deleteQuestionAsync.pending, (state) => {
        state.loading = true;
        state.errorMessage = null;
        state.successMessage = null;
        state.fieldErrors = {};
        state.selectedForm = null;
        state.errorCode =0
      })
      .addCase(deleteQuestionAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
      })
      .addCase(deleteQuestionAsync.rejected, (state, action: any) => {
        console.log(" action.payload.code",  action.payload.code)
        state.loading = false;
        state.errorMessage = action.payload.message || "Failed to fetch form.";
        state.errorCode = action.payload?.code;
      });
      
  },
});

export const { clearUserState, setSelectedForm  } = userSlice.actions;
export default userSlice.reducer;
