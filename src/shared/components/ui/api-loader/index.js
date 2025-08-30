import { Alert, Box, CircularProgress } from "@mui/material";

const ApiLoader = ({ loading, error, children, h }) => {
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={h ? h : "50vh"}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" width={"100%"}>
        <Alert sx={{ width: "100%" }} severity="error">
          {error.message || "Something went wrong!"}
        </Alert>
      </Box>
    );
  }

  return <>{children}</>;
};

export default ApiLoader;
