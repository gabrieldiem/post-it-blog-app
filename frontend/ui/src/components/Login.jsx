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
import { useState } from "react";

import AlreadyLogedIn from "./AlreadyLogedIn";

import getUserInfo from "../services/username";

const VIOLET_PRIMARY = "#a757e4";
const MAX_USERNAME = 30;
const COLOR = "#282828";

const Login = ({ userState }) => {
  const navigate = useNavigate();

  const [usernameError, setUsernameError] = useState(false);
  const [usernameErrorMessage, setUsernameErrorMessage] = useState("");

  const fetchUserInfo = async (username) => {
    try{
      const data = await getUserInfo(username);
      if(data && data.name){
        userState.setUser(data);
        console.log(userState)
        navigate("/");
      } else {
        setUsernameError(true);
        setUsernameErrorMessage("Error de conexión con el servidor.");
      }
    } catch(error){
      setUsernameError(true);
      if(error.response && error.response.status == 404){
        setUsernameErrorMessage("No se encontró el usuario.");
        return;
      }
      setUsernameErrorMessage("Error de conexión con el servidor.");
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (usernameError) {
      return;
    }

    const data = new FormData(event.currentTarget);
    const username = data.get("username");
    fetchUserInfo(username);
  };

  const validateInputs = () => {
    const usernameElement = document.getElementById("username");
    const username = usernameElement.value;

    let isValid = true;

    if (!username) {
      setUsernameError(true);
      setUsernameErrorMessage("Ingrese un nombre de usuario válido.");
      isValid = false;
    } else if (username.length == 0) {
      setUsernameError(true);
      setUsernameErrorMessage("Ingrese un nombre de usuario válido.");
      isValid = false;
    } else if (username.length > MAX_USERNAME) {
      setUsernameError(true);
      setUsernameErrorMessage(`Ingrese un nombre de usuario de longitud menor a ${MAX_USERNAME} caracteres.`);
      isValid = false;
    } else {
      setUsernameError(false);
      setUsernameErrorMessage("");
    }

    return isValid;
  };

  if (userState.user) {
    return <AlreadyLogedIn userState={userState} />;
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
          Iniciar Sesión
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          noValidate
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            gap: 2,
          }}
        >
          <FormControl>
            <FormLabel htmlFor="username">Username</FormLabel>
            <TextField
              error={usernameError}
              helperText={usernameErrorMessage}
              id="username"
              type="username"
              name="username"
              placeholder="username"
              autoComplete="username"
              autoFocus
              required
              fullWidth
              variant="outlined"
              color={usernameError ? "error" : "primary"}
            />
          </FormControl>
          <Button type="submit" fullWidth variant="contained" onClick={validateInputs}>
            Iniciar Sesión
          </Button>
        </Box>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Typography sx={{ textAlign: "center" }}>
            ¿Todavía no tienes cuenta?{" "}
            <Link href="/material-ui/getting-started/templates/sign-in/" variant="body2" sx={{ alignSelf: "center" }}>
              Registrarse
            </Link>
          </Typography>
        </Box>
      </MuiCard>
    </Stack>
  );
};

export default Login;
