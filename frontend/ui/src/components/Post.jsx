import { Card, CardHeader, CardContent, Typography, Box, IconButton, Tooltip, List, Collapse, ListItem, ListItemText } from "@mui/material";
import { Grid2 as Grid } from "@mui/material";
import { TransitionGroup } from "react-transition-group";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AddCommentIcon from "@mui/icons-material/AddComment";

import { getPostById } from "../services/posts";
import PostPreview from "./PostPreview";
import { timeAgoFormatter } from "../services/globals.js";
import { CLIENT_URLS } from "../services/globals";
import GenericDialog from "./GenericDialog";

import Comment from "./Comment.jsx";

import "./select.css";
import CreateComment from "./CreateComment.jsx";
const VIOLET_PRIMARY = "#a757e4";
const COLOR = "#282828";
const YOU_STRING = "(Tú)";
const paddingSides = "30px";

const Post = ({ userState }) => {
  const [post, setPost] = useState(null);
  const [extras, setExtras] = useState(null);
  const [errorDialog, setErrorDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { post_id } = useParams();

  const [createComment, setCreateComment] = useState(false);

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
      setErrorMessage("Error al cargar el post");
      setErrorDialog(true);
    }
  }

  useEffect(() => {
    fetchPost();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
            <CardHeader sx={{ textAlign: "center" }} title={post.title} subheader={`@${post.username} ${extras.youString}`} />

            <Typography sx={{ textAlign: "center" }} variant="body2" color="text.secondary">
              Creado {`${extras.timeCreated}${extras.isEdited}`}
            </Typography>

            <CardContent sx={{ paddingRight: paddingSides, paddingLeft: paddingSides }}>
              <Typography sx={{ textAlign: "left" }} variant="body" color="text.primary">
                {post.content}
              </Typography>

              <br />
              <br />
              <Typography sx={{ textAlign: "right" }} variant="body2" color="text.secondary">
                Comentarios: {post.comments.length}
              </Typography>
            </CardContent>
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
