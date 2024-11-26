import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { CLIENT_URLS } from "../services/globals";

const PageNotFound404 = () => {
  const navigate = useNavigate();

  const backHome = () => {
    navigate(CLIENT_URLS.HOME);
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        minHeight: "80vh",
      }}
    >
      <Typography variant="h1" style={{ color: "white" }}>
        404
      </Typography>
      <Typography variant="h6" style={{ color: "white" }}>
        La página que estás buscando no existe.
      </Typography>
      <Button sx={{ marginTop: "20px" }} variant="contained" onClick={backHome}>
        Volver al inicio
      </Button>
    </Box>
  );
};

export default PageNotFound404;
