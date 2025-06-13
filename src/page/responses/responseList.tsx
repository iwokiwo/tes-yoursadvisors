import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import {
  Table,
  TableBody,
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
  const { responses, loading, errorMessage, successMessage } = useSelector((state: RootState) => state.user);
  const [openModal, setOpenModal] = React.useState(false);

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

