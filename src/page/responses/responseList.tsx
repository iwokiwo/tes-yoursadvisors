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
  TableCell,
} from "@mui/material";
import AddResponse from "./addResponse";

export default function ResponseList({ formSlug }: { formSlug: string }) {
  const { responses, loading, errorMessage, successMessage } = useSelector((state: RootState) => state.user);
  const [openModal, setOpenModal] = React.useState(false);
  
  const questionKeys = React.useMemo(() => {
    if (!responses || responses.length === 0) return [];
 
    const allKeys = new Set<string>();
    responses.forEach((res: any) => {
      Object.keys(res.answers || {}).forEach((key) => allKeys.add(key));
    });
    return Array.from(allKeys);
  }, [responses]);

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
                <TableCell>User</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Date</TableCell>
                {questionKeys.map((question) => (
                  <TableCell key={question}>{question}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {responses.map((response: any, index: any) => (
                <TableRow key={index}>
                  <TableCell>{response.user.name}</TableCell>
                  <TableCell>{response.user.email}</TableCell>
                  <TableCell>
                    {new Date(response.date).toLocaleDateString("id-ID", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </TableCell>
                  {questionKeys.map((question) => (
                    <TableCell key={question}>
                      {response.answers[question] || "-"}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
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

