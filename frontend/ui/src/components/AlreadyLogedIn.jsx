import { Button, Typography, Stack } from "@mui/material";
import MuiCard from "@mui/material/Card";
import { useNavigate } from "react-router-dom";

import { CLIENT_URLS } from "../services/globals";

const COLOR = "#282828";

const AlreadyLogedIn = ({ userState }) => {
  const username = userState.user;
  const navigate = useNavigate();

  const backToHome = () => {
    navigate(CLIENT_URLS.HOME);
  };

  return (
    <Stack
      direction="column"
      justifyContent="space-between"
      sx={{
        height: "80vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: { xs: 2, sm: 4 },
        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          zIndex: -1,
          inset: 0,
        },
      }}
    >
      <MuiCard
        variant="outlined"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignSelf: "center",
          backgroundColor: COLOR,
          borderRadius: "20px",
          width: "100%",
          padding: 4,
          gap: 2,
          margin: "auto",
          maxWidth: { sm: "450px" },
        }}
      >
        <Typography component="h1" variant="h4" sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}>
          ¡Ya has iniciado sesión {username}!
        </Typography>
        <Button fullWidth variant="contained" onClick={backToHome}>
          Volver al Inicio
        </Button>
      </MuiCard>
    </Stack>
  );
};

export default AlreadyLogedIn;
