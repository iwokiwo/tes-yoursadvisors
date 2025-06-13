import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { getFormByIdAsync, getResponsesAsync } from "../../store/formSlice";
import {
  Typography,
  Button,
  Box,
  Tabs,
  Tab,
  Tooltip,
  IconButton,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import QuestionList from "../question/questionList";
import ResponseList from "../responses/responseList";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

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
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const { selectedForm, errorCode, successMessage} = useSelector((state: RootState) => state.user);
  const [value, setValue] = React.useState(0);

  const [copied, setCopied] = React.useState(false);

  const formLink = id
    ? `${window.location.origin}/forms/detail/${id}`
    : "";

 const handleChange = (_: unknown, newValue: number) => {
    setValue(newValue);
  };

  useEffect(() => {
     if (!id) return;

    dispatch(getFormByIdAsync({ formSlug: id })).unwrap()
  }, [dispatch, successMessage]);

    useEffect(() => {
     if (!id) return;

    dispatch(getResponsesAsync({ formSlug: id })).unwrap()
  }, [dispatch, successMessage]);


  if(errorCode > 200)  navigate("/forms")
     
  return (
    <>
      <Box display="flex" justifyContent="space-between" mt={2}>
        <Typography variant="h6" sx={{ m: 1 }}>
          Detail
        </Typography>
              <Button variant="contained" color="warning" sx={{ m: 1 }} onClick={() => navigate("/forms")}>
          Back
        </Button>
      </Box>
      {id && (
        <Box display="flex" alignItems="center" gap={1} sx={{ m: 1 }}>
          <Typography variant="body2">Form link:</Typography>
          <Typography
            variant="body2"
            sx={{ wordBreak: "break-all", color: "primary.main" }}
          >
            {formLink}
          </Typography>
          <Tooltip title={copied ? "Copied!" : "Copy"}>
            <IconButton
              onClick={() => {
                navigator.clipboard.writeText(formLink);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              size="small"
            >
              <ContentCopyIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      )}
      {selectedForm && (
          <Box sx={{ p: 2, backgroundColor: "#f9f9f9", borderRadius: 2, mb: 2 }}>
            <Typography variant="h6" gutterBottom>Form Information</Typography>
            <Typography><strong>ID:</strong> {selectedForm.id}</Typography>
            <Typography><strong>Name:</strong> {selectedForm.name}</Typography>
            <Typography><strong>Slug:</strong> {selectedForm.slug}</Typography>
            <Typography><strong>Description:</strong> {selectedForm.description || "-"}</Typography>
            <Typography><strong>Limit One Response:</strong> {selectedForm.limit_one_response ? "Yes" : "No"}</Typography>
          <Typography><strong>Allowed Domains:</strong> {selectedForm.allowed_domains.join(", ") || "-"}</Typography>
        </Box>
        )}
        <Box sx={{ width: '100%', typography: 'body1' }}>
           <Tabs
        value={value}
        onChange={handleChange}
      >
        <Tab value={0} label="Question" />
        <Tab value={1} label="Response" />
      </Tabs>
      <TabPanel value={value} index={0} >
        <QuestionList formSlug={id!}/>
      </TabPanel>
      <TabPanel value={value} index={1} >
        <ResponseList formSlug={id!}/>
      </TabPanel>
    </Box>
    </>
  );
};

export default DetailForm;



