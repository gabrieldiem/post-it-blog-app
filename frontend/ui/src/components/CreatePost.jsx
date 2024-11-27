import { useState } from "react";
import { Card, CardHeader, Typography, Box, Divider, FormControl, FormLabel, TextField, Button } from "@mui/material";
import { StatusCodes } from "http-status-codes";
import { useNavigate } from "react-router-dom";

import { createPost } from "../services/posts.js";
import GenericDialog from "./GenericDialog.jsx";
import { CLIENT_URLS } from "../services/globals.js";

const COLOR = "#282828";
const VIOLET_PRIMARY = "#a757e4";
const MAX_TITLE = 30;
const MAX_CONTENT = 30;
const paddingSides = "30px";

const CreatePost = ({ userState }) => {
  const [titleError, setTitleError] = useState(false);
  const [titleErrorMessage, setTitleErrorMessage] = useState("");

  const [contentError, setContentError] = useState(false);
  const [contentErrorMessage, setContentErrorMessage] = useState("");

  const [showDialog, setShowDialog] = useState(false);
  const navigate = useNavigate();

  const performPostCreation = async (title, content) => {
    try {
      const res = await createPost(title, content, userState.user.name);
      if (res) {
        setShowDialog(true);
      } else {
        setTitleError(true);
        setContentError(true);
        setTitleErrorMessage("Error de conexión con el servidor.");
        setContentErrorMessage("Error de conexión con el servidor.");
      }
    } catch (error) {
      setTitleError(true);
      setContentError(true);
      if (error.response && error.response.status == StatusCodes.NOT_FOUND) {
        setTitleErrorMessage("No se encontró el usuario");
        setContentErrorMessage("No se encontró el usuario");
        return;
      }
      setTitleErrorMessage("Error de conexión con el servidor.");
      setContentErrorMessage("Error de conexión con el servidor.");
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (titleError || contentError) {
      return;
    }

    const data = new FormData(event.currentTarget);
    const title = data.get("title");
    const content = data.get("content");
    performPostCreation(title, content);
  };

  const validateInputs = () => {
    const titleElement = document.getElementById("title");
    const contentElement = document.getElementById("content");

    const title = titleElement.value;
    const content = contentElement.value;

    let areValid = true;

    if (!title) {
      setTitleError(true);
      setTitleErrorMessage("Ingrese un título válido.");
      areValid = false;
    } else if (title.length == 0) {
      setTitleError(true);
      setTitleErrorMessage("Ingrese un título válido.");
      areValid = false;
    } else if (title.length > MAX_TITLE) {
      setTitleError(true);
      setTitleErrorMessage(`Ingrese un título de longitud menor a ${MAX_TITLE} caracteres.`);
      areValid = false;
    } else {
      setTitleError(false);
      setTitleErrorMessage("");
    }

    if (!content) {
      setContentError(true);
      setContentErrorMessage("Ingrese contenido válido.");
      areValid = false;
    } else if (content.length == 0) {
      setContentError(true);
      setContentErrorMessage("Ingrese contenido válido.");
      areValid = false;
    } else if (content.length > MAX_CONTENT) {
      setContentError(true);
      setContentErrorMessage(`Ingrese contenido de longitud menor a ${MAX_CONTENT} caracteres.`);
      areValid = false;
    } else {
      setContentError(false);
      setContentErrorMessage("");
    }

    return areValid;
  };

  return (
    <>
      {" "}
      {showDialog ? (
        <GenericDialog
          text="Post creado con éxito"
          reset={() => {
            setShowDialog(false);
            navigate(CLIENT_URLS.HOME);
          }}
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
          <CardHeader sx={{ textAlign: "left" }} title={<Typography sx={{ textAlign: "center", fontSize: "40px" }}>Crea un nuevo post</Typography>} />
          <Divider />

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
              marginTop: "20px",
            }}
          >
            <FormControl>
              <FormLabel htmlFor="title">Título</FormLabel>
              <TextField
                error={titleError}
                helperText={titleErrorMessage}
                id="title"
                type="title"
                name="title"
                placeholder="Título para tu post"
                autoFocus
                required
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  width: "100%",
                  gap: 2,
                }}
                variant="outlined"
                color={titleError ? "error" : "primary"}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="content">Contenido del post</FormLabel>
              <TextField
                error={contentError}
                helperText={contentErrorMessage}
                id="content"
                type="content"
                name="content"
                placeholder="Escribe aquí el contenido de tu post"
                required
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  width: "100%",
                  gap: 2,
                }}
                variant="outlined"
                fullWidth
                multiline
                minRows="6"
                color={contentError ? "error" : "primary"}
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
                Crear Post
              </Button>
            </Box>
          </Box>
        </Card>
      </Box>
    </>
  );
};

export default CreatePost;
