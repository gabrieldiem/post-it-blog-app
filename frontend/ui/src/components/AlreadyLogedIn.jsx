import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import MuiCard from "@mui/material/Card";
import { useNavigate } from "react-router-dom";

const COLOR = "#282828";

const AlreadyLogedIn = ({ userState }) => {
  const username = userState.user;
  const navigate = useNavigate();
  
  const backToHome = () => {
    navigate("/");
  }

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
