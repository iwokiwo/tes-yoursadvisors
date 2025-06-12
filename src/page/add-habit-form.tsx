import React from "react";
import { useDispatch } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import {
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  FormHelperText,
} from "@mui/material";
import { addHabit } from "../store/habit-slice";
import { AppDispatch } from "../store/store";

// Schema validasi Yup
const schema = Yup.object().shape({
  name: Yup.string().required("Habit name is required"),
  frequency: Yup.string()
    .oneOf(["daily", "weekly"], "Invalid frequency")
    .required("Frequency is required"),
});

type HabitFormData = {
  name: string;
  frequency: "daily" | "weekly";
};

const AddHabitForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<HabitFormData>({
    defaultValues: {
      name: "",
      frequency: "daily",
    },
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: HabitFormData) => {
    dispatch(addHabit(data));
    reset(); // Reset form after submission
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Habit Name"
              placeholder="Enter habit name"
              fullWidth
              error={!!errors.name}
              helperText={errors.name?.message}
            />
          )}
        />

        <Controller
          name="frequency"
          control={control}
          render={({ field }) => (
            <FormControl fullWidth error={!!errors.frequency}>
              <InputLabel>Frequency</InputLabel>
              <Select {...field} label="Frequency">
                <MenuItem value="daily">Daily</MenuItem>
                <MenuItem value="weekly">Weekly</MenuItem>
              </Select>
              <FormHelperText>{errors.frequency?.message}</FormHelperText>
            </FormControl>
          )}
        />

        <Button type="submit" variant="contained" color="primary">
          Add Habit
        </Button>
      </Box>
    </form>
  );
};

export default AddHabitForm;
