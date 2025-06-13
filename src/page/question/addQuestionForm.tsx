import React from "react";
import {
  useForm,
  Controller,
  useWatch,
} from "react-hook-form";
import {
  TextField,
  Button,
  MenuItem,
  FormControlLabel,
  Checkbox,
  RadioGroup,
  Radio,
  Select,
  InputLabel,
  FormGroup,
  FormControl,
  Typography,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { choiceTypes, staticChoices } from "../../constants/form";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store/store";
import { createQuestionAsync } from "../../store/formSlice";

interface Props {
  open: boolean;
  onClose: () => void;
  formSlug: string;
}

type ChoiceType = (typeof choiceTypes)[number];

type FormValues = {
  name: string;
  choice_type: ChoiceType;
  is_required: boolean;
  choices?: any;
};

// --- Validation Schema ---
const schema = yup.object().shape({
  name: yup.string().required("Question name is required"),
  choice_type: yup
    .mixed<ChoiceType>()
    .oneOf(choiceTypes)
    .required("Choice type is required"),
  is_required: yup.boolean().required(),
});

const AddQuestionForm: React.FC<Props> = ({ open, onClose, formSlug }) => {
  const dispatch = useDispatch<AppDispatch>();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: "",
      choice_type: "short answer",
      is_required: false,
      choices: "",
    },
    resolver: yupResolver(schema),
  });

  const choiceType = useWatch({
    control,
    name: "choice_type",
  });

  const onSubmit = async (data: FormValues) => {
    dispatch(
      createQuestionAsync({
        formData: data, formSlug
      })
    );
    reset();
    onClose()
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Add New Question</DialogTitle>
      <DialogContent dividers>
      <Box sx={{ maxWidth: 600, mx: "auto" }}>
      <form
        onSubmit={handleSubmit(onSubmit)} 
        noValidate>
        <TextField
          fullWidth
          label="Question Name"
          margin="normal"
          {...register("name")}
          error={!!errors.name}
          helperText={errors.name?.message}
        />

        <TextField
          fullWidth
          select
          label="Choice Type"
          margin="normal"
          {...register("choice_type")}
          error={!!errors.choice_type}
          helperText={errors.choice_type?.message}
        >
          {choiceTypes.map((type) => (
            <MenuItem key={type} value={type}>
              {type}
            </MenuItem>
          ))}
        </TextField>

        <FormControlLabel
          control={<Checkbox {...register("is_required")} />}
          label="Required?"
        />

        <Box mt={1}>
          <Typography variant="subtitle1" gutterBottom>
            Choices
          </Typography>

          <Controller
            control={control}
            name="choices"
            render={({ field }) => {
              if (["multiple choice", "dropdown", "checkboxes"].includes(choiceType)) {
                if (choiceType === "multiple choice") {
                  return (
                    <RadioGroup {...field}>
                      {staticChoices.map((option) => (
                        <FormControlLabel
                          key={option}
                          value={option}
                          control={<Radio />}
                          label={option}
                        />
                      ))}
                    </RadioGroup>
                  );
                }

                if (choiceType === "dropdown") {
                  return (
                    <FormControl fullWidth>
                      <InputLabel>Dropdown</InputLabel>
                      <Select
                        multiple
                        label="Dropdown"
                        value={field.value || []}
                        onChange={(e) => field.onChange(e.target.value)}
                        renderValue={(selected) => (selected as string[]).join(", ")}
                      >
                        {staticChoices.map((option) => (
                          <MenuItem key={option} value={option}>
                            <Checkbox checked={field.value?.includes(option)} />
                            {option}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  );
                }

                if (choiceType === "checkboxes") {
                  return (
                    <FormGroup>
                      {staticChoices.map((option) => (
                        <FormControlLabel
                          key={option}
                          label={option}
                          control={
                            <Checkbox
                              checked={field.value?.includes(option) || false}
                              onChange={(e) => {
                                const newValue = e.target.checked
                                  ? [...(field.value || []), option]
                                  : (field.value || []).filter((v: string) => v !== option);
                                field.onChange(newValue);
                              }}
                            />
                          }
                        />
                      ))}
                    </FormGroup>
                  );
                }
              }

              // Default input for short answer, paragraph, or date
              if (choiceType === "short answer") {
                return <TextField fullWidth label="Short answer" {...field} />;
              }

              if (choiceType === "paragraph") {
                return (
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Paragraph"
                    {...field}
                  />
                );
              }

              if (choiceType === "date") {
                return (
                  <TextField
                    fullWidth
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    {...field}
                  />
                );
              }

              return <></>;
            }}
          />
        </Box>
        <Box display="flex" justifyContent="space-between" mt={2}>
          <Button variant="outlined" onClick={() => onClose()}>
            Cancel
          </Button>
          <Button type="submit" variant="contained">
            Submit Question
          </Button>
        </Box>
      </form>
    </Box>
    </DialogContent>
    </Dialog>
  );
}
export default AddQuestionForm