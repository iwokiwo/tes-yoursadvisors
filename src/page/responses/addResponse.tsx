import React from "react";
import {
  useForm,
  useFieldArray,
  Controller
} from "react-hook-form";
import {
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent
} from "@mui/material";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { questions } from "../../constants/form";
import { createResponsesAsync } from "../../store/formSlice";
import { AppDispatch } from "../../store/store";
import { useDispatch } from "react-redux";

interface Props {
  open: boolean;
  onClose: () => void;
  formSlug: string;
}

const schema = yup.object({
  answers: yup.array().of(
    yup.object().shape({
      question_id: yup.number().required(),
      value: yup.mixed().when("question_id", (qid, schema) => {
        const q = questions.find((q) => q.question_id === Number(qid));
        return q?.is_required
          ? schema.required("This field is required")
          : schema.notRequired();
      })
    })
  )
});

const AddResponse: React.FC<Props> = ({ open, onClose, formSlug }) => {
 const dispatch = useDispatch<AppDispatch>();

  const {
    handleSubmit,
    register,
    control,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: {
      answers: questions.map((q) => ({
        question_id: q.question_id,
        value: ""
      }))
    },
    resolver: yupResolver(schema)
  });

  const onSubmit = (data: any) => {
    console.log("Submitted:", data);
       dispatch(
         createResponsesAsync({
           formData: data, formSlug
         })
       );
       reset();
       onClose()
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Add New Responses</DialogTitle>
      <DialogContent dividers>
        <Box sx={{ maxWidth: 600, mx: "auto", mt: 4 }}>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            {questions.map((q, index) => (
              <Box key={q.question_id} mb={2}>
                <TextField
                  fullWidth
                  label={q.title}
                  {...register(`answers.${index}.value`)}
                  error={!!errors.answers?.[index]?.value}
                  helperText={
                    errors.answers?.[index]?.value?.message ?? ""
                  }
                />
                <input
                  type="hidden"
                  {...register(`answers.${index}.question_id`)}
                  value={q.question_id}
                />
              </Box>
            ))}
            <Box display="flex" justifyContent="space-between" mt={2}>
              <Button variant="outlined" onClick={() => onClose()}>
                Cancel
              </Button>
              <Button type="submit" variant="contained">
                Submit
              </Button>
            </Box>
          </form>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
export default AddResponse