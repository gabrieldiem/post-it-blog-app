import { Card, CardHeader, CardContent, Typography, Box, IconButton, Tooltip, List, Collapse, ListItem, Button, CardMedia, FormControlLabel, Checkbox, ListItemText, Avatar, Grid2, FormControl, FormLabel, TextField } from "@mui/material";

import { Grid2 as Grid } from "@mui/material";
import { TransitionGroup } from "react-transition-group";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AddCommentIcon from "@mui/icons-material/AddComment";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { StatusCodes } from "http-status-codes";

import { deletePost, getPostById, updatePost, getImageSrcUrl } from "../services/posts";
import PostPreview from "./PostPreview";
import { timeAgoFormatter } from "../services/globals.js";
import { CLIENT_URLS } from "../services/globals";
import GenericDialog from "./GenericDialog";
import DragDrop from "./CreatePostFileUploader.jsx";
import Comment from "./Comment.jsx";

import "./select.css";
import CreateComment from "./CreateComment.jsx";
const VIOLET_PRIMARY = "#a757e4";
const COLOR = "#282828";
const YOU_STRING = "(Tú)";
const paddingSides = "30px";
const MAX_TITLE = 30;
const MAX_CONTENT = 2000;

const Post = ({ userState }) => {
  const [post, setPost] = useState(null);
  const [extras, setExtras] = useState(null);
  const [errorDialog, setErrorDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isUser, setIsUser] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [file, setFile] = useState(null);
  const [deleteImgChecked, setDeleteImgChecked] = useState(false);
  const navigate = useNavigate();

  const [showDeleteDialogSucess, setShowDeleteDialogSucess] = useState(false);

  const { post_id } = useParams();

  const [createComment, setCreateComment] = useState(false);

  const deletePostHandler = async () => {
    try {
      const res = await deletePost(post ? post.id : null, userState && userState.user && userState.user.name ? userState.user.name : null);
      if (res) {
        setShowDeleteDialogSucess(true);
      } else {
        setErrorMessage("Error al borrar el post");
        setErrorDialog(true);
      }
    } catch (error) {
      setErrorMessage("Error al borrar el post");
      setErrorDialog(true);
    }
  };

  const switchToEditMode = async () => {
    setEditMode(true);
  };

  const handleShowCreateComment = () => {
    setCreateComment((prev) => !prev);
  };

  const createCommentComponentTransitioned = (
    <List sx={{ mt: 1 }}>
      <TransitionGroup>
        {createComment ? (
          <Collapse>
            <ListItem>
              <CreateComment userState={userState} postId={post.id} refresh={fetchPost} />
            </ListItem>
          </Collapse>
        ) : null}
      </TransitionGroup>
    </List>
  );

  async function fetchPost() {
    try {
      const post = await getPostById(post_id);
      setPost(post);

      const timeCreated = timeAgoFormatter.format(new Date(post.creation_date));
      const timeEdited = timeAgoFormatter.format(new Date(post.last_change_date));

      setExtras({
        timeCreated: timeCreated,
        timeEdited: timeEdited,
        isEdited: post.creation_date != post.last_change_date ? `, editado ${timeEdited}` : "",
        youString: userState.user != null && userState.user == post.username ? YOU_STRING : "",
      });
    } catch (error) {
      console.log(error);
      setErrorMessage("Error al cargar el post");
      setErrorDialog(true);
    }
  }

  useEffect(() => {
    fetchPost();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (userState && userState.user && post && userState.user.id === post.user_id) {
      setIsUser(true);
    }
  }, [userState, post]);

  const [titleError, setTitleError] = useState(false);
  const [titleErrorMessage, setTitleErrorMessage] = useState("");

  const [contentError, setContentError] = useState(false);
  const [contentErrorMessage, setContentErrorMessage] = useState("");

  const performPostUpdate = async (title, content) => {
    try {
      const res = await updatePost(post ? post.id : null, title, content, userState.user.name, file, deleteImgChecked);
      if (res) {
        setEditMode(false);
        fetchPost();
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
    performPostUpdate(title, content);
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

  const PostEditMode = (
    <>
      {post ? (
        <>
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
                defaultValue={post.title}
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
                defaultValue={post.content}
              />
            </FormControl>

            <FormControlLabel htmlFor="post_img_checkbox" control={<Checkbox checked={deleteImgChecked} onChange={(event) => setDeleteImgChecked(event.target.checked)} />} label="Eliminar imagen" />

            <FormControl>
              <FormLabel htmlFor="post_img">Subir nueva imagen para el post</FormLabel>
              <DragDrop setFile={setFile} formName="post_img" />
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
                Actualizar post
              </Button>
            </Box>
          </Box>
        </>
      ) : null}
    </>
  );

  const PostNormalMode = (
    <>
      {post ? (
        <>
          <CardHeader sx={{ textAlign: "center" }} title={post.title} titleTypographyProps={{ variant: "h4" }} subheader={`@${post.username} ${extras.youString}`} />

          <Typography sx={{ textAlign: "center" }} variant="body2" color="text.secondary">
            Creado {`${extras.timeCreated}${extras.isEdited}`}
          </Typography>

          <CardContent sx={{ paddingRight: paddingSides, paddingLeft: paddingSides }}>
            <Typography sx={{ textAlign: "left" }} variant="body" color="text.primary">
              {post.content}
            </Typography>

            <br />
            <br />

            {post.attachment && post.attachment != undefined && post.attachment != "undefined" && post.attachment != "NULL" ? (
              <CardMedia sx={{ padding: "1em 1em 0 1em", objectFit: "contain", maxHeight: "500px" }} component="img" image={getImageSrcUrl(post.attachment)} />
            ) : null}

            <Grid2 container spacing={1}>
              <Grid2 size={2}>
                {isUser ? (
                  <>
                    <Tooltip title="Eliminar post">
                      <IconButton aria-label="delete" onClick={deletePostHandler}>
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Editar post" onClick={switchToEditMode}>
                      <IconButton aria-label="edit">
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                  </>
                ) : null}
              </Grid2>
              <Grid2 size={10} sx={{ alignContent: "center" }}>
                <Typography sx={{ textAlign: "right" }} variant="body2" color="text.secondary">
                  Comentarios: {post.comments.length}
                </Typography>
              </Grid2>
            </Grid2>
          </CardContent>
        </>
      ) : null}
    </>
  );

  return (
    <>
      {errorDialog ? (
        <GenericDialog
          text={errorMessage}
          reset={() => {
            setErrorDialog(false);
          }}
        />
      ) : null}

      {showDeleteDialogSucess ? (
        <GenericDialog
          text="Post eliminado exitosamente"
          reset={() => {
            setShowDeleteDialogSucess(false);
            navigate(CLIENT_URLS.HOME);
          }}
        />
      ) : null}

      {post ? (
        <Box
          sx={{
            padding: "0 30px",
            marginBottom: "50px",
          }}
        >
          <Card
            sx={{
              maxWidth: "70rem",
              minWidth: "15rem",
              margin: "2rem auto",
              backgroundColor: COLOR,
              borderRadius: "20px",
              padding: "10px",
              borderWidth: "2px",
              borderColor: "#4b2669",
              borderStyle: "solid",
            }}
          >
            {editMode ? PostEditMode : PostNormalMode}
          </Card>
          <Typography
            sx={{
              maxWidth: "70rem",
              minWidth: "15rem",
              margin: "2rem auto",
              marginBottom: "0rem",
            }}
            variant="h5"
            color="text.primary"
          >
            Comentarios{" "}
            {userState && userState.user ? (
              <Tooltip title="Agregar comentario">
                <IconButton onClick={handleShowCreateComment}>
                  <AddCommentIcon />
                </IconButton>
              </Tooltip>
            ) : (
              <Tooltip title="Debes iniciar sesión para agregar un comentario">
                <span>
                  <IconButton disabled>
                    <AddCommentIcon />
                  </IconButton>
                </span>
              </Tooltip>
            )}
          </Typography>

          {createCommentComponentTransitioned}

          {post.comments
            .sort((a, b) => new Date(b.creation_date) - new Date(a.creation_date))
            .map((comment, i) => {
              return <Comment key={i} userState={userState} comment={comment} setPost={setPost} postId={post.id} refresh={fetchPost} />;
            })}
        </Box>
      ) : null}
    </>
  );
};

export default Post;
