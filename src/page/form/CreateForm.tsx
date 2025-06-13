import React from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import {
  TextField,
  Button,
  Box,
  Alert,
  Typography,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { createFormAsync } from "../../store/formSlice";
import { useNavigate } from "react-router-dom";

const schema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  slug: Yup.string()
    .matches(/^[a-z0-9.-]+$/, "Only lowercase, numbers, dash (-) and dot (.) allowed")
    .required("Slug is required"),
  allowed_domains: Yup.string().required("Allowed domains is required"),
  limit_one_response: Yup.boolean().required(),
});

type FormValues = {
  name: string;
  slug: string;
  allowed_domains: string;
  description?: string;
  limit_one_response: boolean;
};

const CreateForm: React.FC = () => {
   const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { errorMessage, fieldErrors, successMessage, selectedForm } = useSelector(
    (state: RootState) => state.user
  );
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      slug: "",
      allowed_domains: "",
      description: "",
      limit_one_response: false,
    },
  });

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    dispatch(
      createFormAsync({
        ...data,
        allowed_domains: data.allowed_domains.split(",").map((d) => d.trim()),
      })
    );
    reset();
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{ display: "flex", flexDirection: "column", gap: 2 }}
    >
      <Typography variant="h5">Create User Form</Typography>

      {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
      {successMessage && <Alert severity="success">{successMessage}</Alert>}

      <Controller
        name="name"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Name"
            error={!!errors.name || !!fieldErrors?.name}
            helperText={errors.name?.message || fieldErrors?.name?.[0]}
          />
        )}
      />

      <Controller
        name="slug"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Slug"
            error={!!errors.slug || !!fieldErrors?.slug}
            helperText={errors.slug?.message || fieldErrors?.slug?.[0]}
          />
        )}
      />

      <Controller
        name="allowed_domains"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Allowed Domains (comma-separated)"
            error={!!errors.allowed_domains || !!fieldErrors?.allowed_domains}
            helperText={
              errors.allowed_domains?.message || fieldErrors?.allowed_domains?.[0]
            }
          />
        )}
      />

      <Controller
        name="description"
        control={control}
        render={({ field }) => (
          <TextField {...field} label="Description" multiline rows={3} />
        )}
      />

      <Controller
        name="limit_one_response"
        control={control}
        render={({ field }) => (
          <FormControlLabel
            control={<Checkbox {...field} checked={field.value} />}
            label="Limit One Response"
          />
        )}
      />

        <Box display="flex" justifyContent="space-between" mt={2}>
            <Button variant="outlined" onClick={() => navigate("/forms")}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary">
              Create
            </Button>
          </Box>
    </Box>
  );
};

export default CreateForm;
