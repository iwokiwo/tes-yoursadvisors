import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { deleteQuestionAsync, setSelectedForm } from "../../store/formSlice";
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
} from "@mui/material";
import AddResponse from "./addResponse";



export default function ResponseList({ formSlug }: { formSlug: string }) {
  const dispatch = useDispatch<AppDispatch>();
  const { selectedForm, responses, loading, errorMessage, successMessage } = useSelector((state: RootState) => state.user);
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
 console.log("responses", responses)
  return (
    <>
      <Box display="flex" justifyContent="space-between" mt={2}>

        <Typography variant="h6" sx={{ m: 1 }}>
          Responses List
        </Typography>
        <Button variant="contained" sx={{ m: 1 }} onClick={() => setOpenModal(true)}>
          Add Responses
        </Button>
      </Box>
      <TableContainer component={Paper} sx={{ mt: 4 }}>

        {loading && <CircularProgress sx={{ m: 2 }} />}

        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
        {successMessage && <Alert severity="success">{successMessage}</Alert>}

        {!loading && responses?.length > 0 && (
          <Table>
            <TableHead>
              <TableRow>

              </TableRow>
            </TableHead>
            <TableBody>
       
            </TableBody>
          </Table>
        )}

        {!loading && responses?.length === 0 && (
          <Typography sx={{ m: 2 }}>No forms found.</Typography>
        )}
      </TableContainer>

      
      <AddResponse
        open={openModal}
        onClose={() => setOpenModal(false)}
        formSlug={formSlug}
      />
    </>
  );
};

