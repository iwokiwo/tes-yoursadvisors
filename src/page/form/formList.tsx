import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { getFormAsync, setSelectedForm } from "../../store/formSlice";
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
import { UserData } from "../../services/formService";
import { useNavigate } from "react-router-dom";

const FormList: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { loading, errorMessage } = useSelector((state: RootState) => state.user);
  const [data, setData] = React.useState<UserData[]>([]);

  useEffect(() => {
    dispatch(getFormAsync())
      .unwrap()
      .then((data) => setData(data))
      .catch(() => { });
  }, [dispatch]);

  return (
    <>
      <Box display="flex" justifyContent="space-between" mt={2}>
        <Typography variant="h6" sx={{ m: 1 }}>
          Form List
        </Typography>
        <Button variant="contained" sx={{ m: 1 }} onClick={() => navigate("/forms/new")}>
          Add Form
        </Button>
      </Box>
      <TableContainer component={Paper} sx={{ mt: 4 }}>

        {loading && <CircularProgress sx={{ m: 2 }} />}

        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

        {!loading && data.length > 0 && (
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
              {data.map((form: any) => (
                <TableRow key={form.id}>
                  <TableCell>{form.name}</TableCell>
                  <TableCell>{form.slug}</TableCell>
                  <TableCell>{form.description || "-"}</TableCell>
                  <TableCell>{form.limit_one_response ? "Yes" : "No"}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      sx={{ m: 1 }}
                      onClick={() => {
                        navigate(`/forms/detail/${form.slug}`);
                      }}
                    >
                      Detail
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        {!loading && data.length === 0 && (
          <Typography sx={{ m: 2 }}>No forms found.</Typography>
        )}
      </TableContainer>
    </>
  );
};

export default FormList;
