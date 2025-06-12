// store/userSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { createUserApi, getUserApi } from "../services/userService";

export interface UserFormData {
  name: string;
  slug: string;
  allowed_domains: string[];
  description?: string;
  limit_one_response: boolean;
  id?: string;
}

interface UserState {
  loading: boolean;
  successMessage: string | null;
  errorMessage: string | null;
  fieldErrors: Record<string, string[]>;
  selectedForm: UserFormData | null;
}

const initialState: UserState = {
  loading: false,
  successMessage: null,
  errorMessage: null,
  selectedForm: null,
  fieldErrors: {},
};

export const createUserAsync = createAsyncThunk(
  "user/createUser",
  async (formData: UserFormData, { rejectWithValue }) => {
    try {
       const token = JSON.parse(localStorage.getItem("user") || "{}").accessToken || "";
      const response = await createUserApi(formData, token);
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
export const getUseAsync = createAsyncThunk(
  "user/getForms",
  async (_, { rejectWithValue }) => {
    try {
      const token = JSON.parse(localStorage.getItem("user") || "{}").accessToken || "";
      const data = await getUserApi(token);
      return data;
    } catch (error: any) {
      return rejectWithValue("Failed to fetch forms.");
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
      .addCase(createUserAsync.pending, (state) => {
        state.loading = true;
        state.successMessage = null;
        state.errorMessage = null;
        state.fieldErrors = {};
      })
      .addCase(createUserAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload;
      })
      .addCase(createUserAsync.rejected, (state, action: any) => {
        state.loading = false;
        if (action.payload?.type === "fields") {
          state.fieldErrors = action.payload.errors;
        } else {
          state.errorMessage = action.payload?.message || "Failed to submit.";
        }
      });
  },
});

export const { clearUserState, setSelectedForm  } = userSlice.actions;
export default userSlice.reducer;
