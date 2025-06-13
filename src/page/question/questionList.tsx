import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { deleteQuestionAsync } from "../../store/formSlice";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
  Alert,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  IconButton,
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import AddQuestionForm from "./addQuestionForm";



export default function QuestionList({ formSlug }: { formSlug: string }) {
  const dispatch = useDispatch<AppDispatch>();
  const { selectedForm, loading, errorMessage, successMessage } = useSelector((state: RootState) => state.user);
  const [openModal, setOpenModal] = React.useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = React.useState(false);
  const [questionToDelete, setQuestionToDelete] = React.useState<any>(null);

  const handleDeleteClick = (question: any) => {
    setQuestionToDelete(question)
    setDeleteConfirmOpen(true);
  };

    const confirmDelete = () => {
    if (questionToDelete) {
      dispatch(deleteQuestionAsync({ id: questionToDelete.id, formSlug }));
    }
    setDeleteConfirmOpen(false);
    setQuestionToDelete(null);
  };

  return (
    <>
      <Box display="flex" justifyContent="space-between" mt={2}>

        <Typography variant="h6" sx={{ m: 1 }}>
          Question List
        </Typography>
        <Button variant="contained" sx={{ m: 1 }} onClick={() => setOpenModal(true)}>
          Add Question
        </Button>
      </Box>
      <TableContainer component={Paper} sx={{ mt: 4 }}>

        {loading && <CircularProgress sx={{ m: 2 }} />}

        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
        {successMessage && <Alert severity="success">{successMessage}</Alert>}

        {!loading && selectedForm?.questions.length > 0 && (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Slug</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Limit One Response</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {selectedForm?.questions.map((form: any) => (
                <TableRow key={form.id}>
                  <TableCell>{form.name}</TableCell>
                  <TableCell>{form.choice_type}</TableCell>
                  <TableCell>{form.choices || "-"}</TableCell>
                  <TableCell>{form.is_required ? "Yes" : "No"}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="secondary"
                      sx={{ m: 1 }}
                      onClick={() => {
                        handleDeleteClick(form)
                      }}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        {!loading && selectedForm?.questions.length === 0 && (
          <Typography sx={{ m: 2 }}>No forms found.</Typography>
        )}
      </TableContainer>

      
      <AddQuestionForm
        open={openModal}
        onClose={() => setOpenModal(false)}
        formSlug={formSlug}
      />

        {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
         <DialogTitle sx={{ m: 0, p: 2 }}>
            Delete Question
            <IconButton
              aria-label="close"
              onClick={() => setDeleteConfirmOpen(false)}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the question ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
          <Button onClick={confirmDelete} variant="contained" color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

