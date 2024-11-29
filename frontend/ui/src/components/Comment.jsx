import { useState, useEffect } from "react";
import { Card, CardContent, Typography, Box, IconButton, Grid2, Tooltip } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

import { useNavigate } from "react-router-dom";
import { CLIENT_URLS } from "../services/globals";
import GenericDialog from "./GenericDialog";
import { deleteComment, updateComment } from "../services/comment.js";
import { timeAgoFormatter } from "../services/globals";
import EditComment from "./EditComment.jsx";

const COLOR = "#282828";
const paddingSides = "30px";

const Comment = ({ userState, comment, setPost, postId, refresh }) => {
  const [isUser, setIsUser] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [checkIsUser, setCheckIsUser] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const timeCreated = timeAgoFormatter.format(new Date(comment.creation_date));
  const timeEdited = timeAgoFormatter.format(new Date(comment.last_change_date));
  const isEdited = comment.creation_date != comment.last_change_date ? `, editado ${timeEdited}` : "";

  const deleteCommentHandler = async () => {
    try {
      const res = await deleteComment(comment.id, userState.user.name);
      if (res) {
        setCheckIsUser(true);
        setIsUser(false);
        setPost((prev) => {
          const prevCopy = structuredClone(prev);
          prevCopy.comments = prevCopy.comments.filter((_comment) => comment.id !== _comment.id);
          return prevCopy;
        });
      } else {
        setShowDialog(true);
      }
    } catch (error) {
      setShowDialog(true);
    }
  };

  const switchToEditMode = async () => {
    setEditMode(true);
  };

  useEffect(() => {
    if (userState && userState.user && userState.user.id === comment.user_id) {
      setIsUser(true);
      if (checkIsUser) {
        setCheckIsUser(false);
      }
    }
  }, [userState, checkIsUser, comment]);

  const CommentReadMode = (
    <Card
      sx={{
        maxWidth: "70rem",
        minWidth: "15rem",
        margin: "0.25rem auto",
        backgroundColor: COLOR,
        padding: "10px 50px 10px 20px",
      }}
    >
      <CardContent sx={{ paddingRight: paddingSides, paddingLeft: paddingSides }}>
        <Typography sx={{ textAlign: "left" }} variant="body" color="text.primary">
          {comment.content}
        </Typography>
      </CardContent>

      <Grid2 container spacing={1}>
        <Grid2 size={2}>
          {isUser ? (
            <>
              <Tooltip title="Eliminar comentario">
                <IconButton aria-label="delete" onClick={deleteCommentHandler}>
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Editar comentario" onClick={switchToEditMode}>
                <IconButton aria-label="edit">
                  <EditIcon />
                </IconButton>
              </Tooltip>
            </>
          ) : null}
        </Grid2>
        <Grid2 size={10} sx={{ alignContent: "center" }}>
          <Typography sx={{ textAlign: "right" }} variant="body2" color="text.secondary">
            {`@${comment.username} ${timeCreated}${isEdited}`}
          </Typography>
        </Grid2>
      </Grid2>
    </Card>
  );

  const CommentEditMode = (
    <EditComment
      userState={userState}
      comment={comment}
      refresh={() => {
        setEditMode(false);
        refresh();
      }}
    />
  );

  return (
    <>
      {showDialog ? (
        <GenericDialog
          text="Error al eliminar el comentario"
          reset={() => {
            setShowDialog(false);
          }}
        />
      ) : null}
      {editMode ? CommentEditMode : CommentReadMode}
    </>
  );
};

export default Comment;
