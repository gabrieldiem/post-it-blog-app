import { useState } from "react";
import { Card, CardHeader, CardContent, Typography, Box, Divider, FormControl, FormLabel, TextField, Button } from "@mui/material";
import { CLIENT_URLS, timeAgoFormatter } from "../services/globals.js";
import { StatusCodes } from "http-status-codes";
import {useNavigate} from "react-router-dom";

import { updateUsername, deleteUser } from "../services/user.js";
import GenericDialog from "./GenericDialog.jsx";

const COLOR = "#282828";
const VIOLET_PRIMARY = "#a757e4";
const MAX_USERNAME = 30;

const Account = ({ userState }) => {
  const [usernameError, setUsernameError] = useState(false);
  const [usernameErrorMessage, setUsernameErrorMessage] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const timeJoined = timeAgoFormatter.format(new Date(userState.user.creation_date));
  const paddingSides = "30px";
  const navigate = useNavigate();

  const deleteAccountHandlerAux = async () => {
    try {
      const res = await deleteUser(userState.user.name);
      if (res) {
        userState.setUser(null);
        setShowDeleteDialog(true);
      } else {
        setUsernameError(true);
        setUsernameErrorMessage("Error de conexión con el servidor.");
      }
    } catch (error) {
      setUsernameError(true);
      setUsernameErrorMessage("Error de conexión con el servidor.");
    }
  };

  const deleteAccountHandler = () => {
    deleteAccountHandlerAux();
  };

  const performUpdate = async (username) => {
    try {
      const data = await updateUsername(userState.user.name, username);
      if (data && data.name) {
        userState.setUser(data);
        console.log(userState);
        setShowDialog(true);
      } else {
        setUsernameError(true);
        setUsernameErrorMessage("Error de conexión con el servidor.");
      }
    } catch (error) {
      setUsernameError(true);
      if (error.response && error.response.status == StatusCodes.CONFLICT) {
        setUsernameErrorMessage("El nombre de usuario ya existe.");
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
    performUpdate(username);
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

  return (
    <>
      {showDialog ? (
        <GenericDialog
          reset={() => {
            setShowDialog(false);
          }}
          text="Cambios aplicados correctamente"
        />
      ) : null}
      {showDeleteDialog ? (
        <GenericDialog
          reset={() => {
            setShowDeleteDialog(false);
            navigate(CLIENT_URLS.HOME);
          }}
          text="Usuario eliminado con éxito"
        />
      ) : null}
      <Box sx={{ padding: "0 30px" }}>
        <Card
          sx={{
            maxWidth: "70rem",
            minWidth: "15rem",
            margin: "2rem auto",
            backgroundColor: COLOR,
            borderRadius: "20px",
            padding: "10px",
          }}
        >
          <CardHeader
            sx={{ textAlign: "left" }}
            title={
              <Typography sx={{ textAlign: "center", fontSize: "40px" }}>
                Configura tu cuenta{" "}
                <Typography variant="string" sx={{ textAlign: "inherit", fontSize: "40px", color: VIOLET_PRIMARY }}>
                  {userState.user.name}
                </Typography>
              </Typography>
            }
          />
          <Divider />

          <CardContent sx={{ paddingRight: paddingSides, paddingLeft: paddingSides }}>
            <Typography sx={{ textAlign: "left" }} variant="body" color="text.primary">
              Te uniste a PostIt {timeJoined}
            </Typography>
          </CardContent>

          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              gap: 2,
              padding: "0px 30px 30px 30px",
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
                placeholder={userState.user.name}
                autoFocus
                required
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  width: "30%",
                  gap: 2,
                }}
                variant="outlined"
                color={usernameError ? "error" : "primary"}
              />
            </FormControl>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignContent: "center",
                alignItems: "center",
                width: "100%",
                marginTop: "20px",
              }}
            >
              <Button
                sx={{
                  width: "40%",
                }}
                type="submit"
                variant="contained"
                onClick={validateInputs}
              >
                Actualizar datos
              </Button>
            </Box>
          </Box>
          <Divider />
          <CardHeader sx={{ textAlign: "left" }} title={<Typography sx={{ textAlign: "left", fontSize: "30px", marginLeft: "10px" }}>Eliminar cuenta</Typography>} />
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignContent: "center",
              alignItems: "center",
              width: "100%",
              marginTop: "20px",
              paddingBottom: "30px",
            }}
          >
            <Button
              sx={{
                width: "40%",
              }}
              variant="contained"
              color="error"
              onClick={deleteAccountHandler}
            >
              Eliminar cuenta
            </Button>
          </Box>
        </Card>
      </Box>
    </>
  );
};

export default Account;
