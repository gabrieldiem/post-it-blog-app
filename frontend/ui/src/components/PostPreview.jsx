import { Card, CardHeader, CardContent, Typography, Box } from "@mui/material";
import { timeAgoFormatter } from "../services/globals.js";
import { useNavigate } from "react-router-dom";

import { CLIENT_URLS } from "../services/globals.js";
import "./select.css";
const VIOLET_PRIMARY = "#a757e4";
const COLOR = "#282828";
const YOU_STRING = "(Tú)";

const PostPreview = ({ post, userState }) => {
  const timeCreated = timeAgoFormatter.format(new Date(post.creation_date));
  const timeEdited = timeAgoFormatter.format(new Date(post.last_change_date));
  const commentCount = post.comments.length;

  const navigate = useNavigate();
  const goToPost = () => {
    navigate(`${CLIENT_URLS.POST}/${post.id}`);
  };

  const youString = userState.user != null && userState.user == post.username ? YOU_STRING : "";
  const isEdited = post.creation_date != post.last_change_date ? ` , editado ${timeEdited}` : "";

  const paddingSides = "30px";

  return (
    <Box
      sx={{
        padding: "0 30px",
      }}
    >
      <Card
        onClick={goToPost}
        className="cursor-hand"
        sx={{
          maxWidth: "70rem",
          minWidth: "15rem",
          margin: "2rem auto",
          backgroundColor: COLOR,
          borderRadius: "20px",
          padding: "10px",
          borderWidth: "2px",
          borderStyle: "solid",
          borderColor: "transparent",
          transition: "box-shadow 0.1s ease, border 0.1s ease",
          "&:hover": {
            borderColor: VIOLET_PRIMARY,
            boxShadow: "0 0 15px 5px rgba(255, 255, 255, 0.6)",
          },
          "&:active": {
            opacity: 0.8,
          },
        }}
      >
        <CardHeader sx={{ textAlign: "center" }} title={post.title} subheader={`@${post.username} ${youString}`} />

        <Typography sx={{ textAlign: "center" }} variant="body2" color="text.secondary">
          Creado {`${timeCreated}${isEdited}`}
        </Typography>

        <CardContent sx={{ paddingRight: paddingSides, paddingLeft: paddingSides }}>
          <Typography
            sx={{
              textAlign: "left",
              display: "-webkit-box",
              WebkitLineClamp: 5,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
            variant="body"
            color="text.primary"
          >
            {post.content}
          </Typography>

          <br />
          <br />
          <Typography sx={{ textAlign: "right" }} variant="body2" color="text.secondary">
            Comentarios: {commentCount}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default PostPreview;
