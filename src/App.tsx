import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  Button,
} from "@mui/material";
import LoginForm from "./page/loginForm";
import { RootState, AppDispatch } from "./store/store";
import { logout } from "./store/authSlice";
import { Navigate, Route, Routes } from "react-router-dom";
import DetailForm from "./page/form/detailForm";
import FormList from "./page/form/formList";
import CreateForm from "./page/form/CreateForm";

const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser?.accessToken) {
        dispatch({
          type: "auth/loginAsync/fulfilled",
          payload: parsedUser,
        });
      }
    }
  }, [dispatch]);

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Form
          </Typography>
          {isAuthenticated && (
            <Button color="inherit" onClick={() => dispatch(logout())}>
              Logout
            </Button>
          )}
        </Toolbar>
      </AppBar>

      <Container maxWidth="md">
        <Box sx={{ my: 4 }}>
          {!isAuthenticated ? (
            <LoginForm />
          ) : (
            <>
          <Routes>
            <Route path="/" element={<Navigate to="/forms" />} />
            <Route path="/forms" element={<FormList />} />
            <Route path="/forms/new" element={<CreateForm />} />
            <Route path="/forms/detail/:id" element={<DetailForm />} />
          </Routes>
            </>
          )}
        </Box>
      </Container>
    </>
  );
};

export default App;
