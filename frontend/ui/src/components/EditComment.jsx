import { Button, Box, FormLabel, FormControl, Link, TextField, Typography, Stack, Card, CardContent } from "@mui/material";
import MuiCard from "@mui/material/Card";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { StatusCodes } from "http-status-codes";

import { createComment, updateComment } from "../services/comment";
import { CLIENT_URLS } from "../services/globals";

const COLOR = "#282828";
const paddingSides = "30px";

const MAX_CONTENT = 2000;

const EditComment = ({userState, comment, refresh }) => {
  const [contentError, setContentError] = useState(false);
  const [contentErrorMessage, setContentErrorMessage] = useState("");

  const commentContentKey = `comment_content_edit_${comment.id}`;

  const performCommentUpdate = async (content) => {
    try {
      const resOk = await updateComment(content, comment.id, userState.user.id);
      console.log(resOk)
      if (resOk) {
        refresh();
      } else {
        setContentError(true);
        setContentErrorMessage("Error de conexión con el servidor.");
      }
    } catch (error) {
      setContentError(true);
      if (error.response && error.response.status == StatusCodes.NOT_FOUND) {
        setContentErrorMessage("No se encontró el usuario o el post.");
        return;
      }
      setContentErrorMessage("Error de conexión con el servidor.");
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (contentError || !userState || !(userState.user) ) {
      return;
    }

    const data = new FormData(event.currentTarget);
    const content = data.get(commentContentKey);
    performCommentUpdate(content);
  };

  const validateInputs = () => {
    const contentElement = document.getElementById(commentContentKey);
    const content = contentElement.value;

    let isValid = true;

    if (!content) {
      setContentError(true);
      setContentErrorMessage("Ingrese un comentario válido.");
      isValid = false;
    } else if (content.length == 0) {
      setContentError(true);
      setContentErrorMessage("Ingrese un comentario válido.");
      isValid = false;
    } else if (content.length > MAX_CONTENT) {
      setContentError(true);
      setContentErrorMessage(`Ingrese un comentario de longitud menor a ${MAX_CONTENT} caracteres.`);
      isValid = false;
    } else {
      setContentError(false);
      setContentErrorMessage("");
    }

    return isValid;
  };

  return (
    <Card
      variant="outlined"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignSelf: "center",
        backgroundColor: COLOR,
        borderRadius: "20px",
        width: "100%",
        padding: 2,
        gap: 2,
        margin: "2rem auto",
        marginTop: "0.5rem",
        marginButtom: "0.5rem",
        maxWidth: "70rem",
        minWidth: "15rem",
      }}
    >
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
          <FormLabel htmlFor={commentContentKey}>Comentario</FormLabel>
          <TextField
            error={contentError}
            helperText={contentErrorMessage}
            id={commentContentKey}
            type={commentContentKey}
            name={commentContentKey}
            placeholder={comment.content}
            autoComplete={comment.content}
            autoFocus
            required
            fullWidth
            multiline
            variant="outlined"
            color={contentError ? "error" : "primary"}
            defaultValue={comment.content}
          />
        </FormControl>

          <Button
            type="submit"
            sx={{
              width: "40%",
            }}
            variant="contained"
            onClick={validateInputs}
          >
            Actualizar comentario
          </Button>
      </Box>
    </Card>
  );
};

export default EditComment;
