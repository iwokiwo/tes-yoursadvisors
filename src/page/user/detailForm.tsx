import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { getUseAsync, setSelectedForm } from "../../store/userSlice";
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
  Tabs,
  Tab,
} from "@mui/material";
import { UserData } from "../../services/userService";
import { useNavigate } from "react-router-dom";
import AddQuestionForm from "./addQuestionForm";

interface TabPanelProps {
  children?: React.ReactNode;
  dir?: string;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

const DetailForm: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { selectedForm} = useSelector((state: RootState) => state.user);
  const [data, setData] = React.useState<UserData[]>([]);
  const [value, setValue] = React.useState(0);

 const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  useEffect(() => {
    dispatch(getUseAsync())
      .unwrap()
      .then((data) => setData(data))
      .catch(() => { });
  }, [dispatch]);

  return (
    <>
      <Box display="flex" justifyContent="space-between" mt={2}>
        <Typography variant="h6" sx={{ m: 1 }}>
          Detail
        </Typography>
        <Button variant="contained" sx={{ m: 1 }} onClick={() => navigate("/forms")}>
          Back
        </Button>
      </Box>
        <Box sx={{ width: '100%', typography: 'body1' }}>
           <Tabs
        value={value}
        onChange={handleChange}
      >
        <Tab value={0} label="Item One" />
        <Tab value={1} label="Item Two" />
      </Tabs>
      <TabPanel value={value} index={0} >
        <AddQuestionForm formSlug={selectedForm!.slug}/>
      </TabPanel>
      <TabPanel value={value} index={1} >
        Item Two
      </TabPanel>
    </Box>
    </>
  );
};

export default DetailForm;



