import { Card, CardHeader, CardContent, Typography, Box } from "@mui/material";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { getPostById } from "../services/posts";
import PostPreview from "./PostPreview";
import { timeAgoFormatter } from "../services/globals.js";
import { CLIENT_URLS } from "../services/globals";
import GenericDialog from "./GenericDialog";

import Comment from "./Comment.jsx";

import "./select.css";
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
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchPost() {
      try {
        const post = await getPostById(post_id);
        setPost(post);

        const timeCreated = timeAgoFormatter.format(new Date(post.creation_date));
        const timeEdited = timeAgoFormatter.format(new Date(post.last_change_date));

        setExtras({
          timeCreated: timeCreated,
          timeEdited: timeEdited,
          isEdited: post.creation_date != post.last_change_date ? ` , editado ${timeEdited}` : "",
          youString: userState.user != null && userState.user == post.username ? YOU_STRING : "",
        });
      } catch (error) {
        setErrorMessage("Error al cargar el post");
        setErrorDialog(true);
      }
    }

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
          {post.comments.map((comment, i) => {
            return <Comment key={i} data={comment} />;
          })}
        </Box>
      ) : null}
    </>
  );
};

export default Post;
