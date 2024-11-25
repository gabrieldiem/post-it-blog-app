import { Card, CardHeader, CardContent, Typography } from "@mui/material";
import { timeAgoFormatter } from "../services/globals.js";

import "./PostPreview.css";
const COLOR = "#282828";

const PostPreview = ({ post, userState }) => {
  const timeCreated = timeAgoFormatter.format(new Date(post.creation_date));
  const timeEdited = timeAgoFormatter.format(new Date(post.last_change_date));
  const commentCount = post.comments.length;

  const youString = userState.user ? "(You)" : "";
  const isEdited = post.creation_date != post.last_change_date ? ` , editado ${timeEdited}` : "";

  const paddingSides = "30px";

  return (
    <Card sx={{ maxWidth: "70rem", margin: "1rem auto", backgroundColor: COLOR, borderRadius: "20px", padding: "10px" }}>
      <CardHeader sx={{ textAlign: "center" }} title={post.title} subheader={`@${post.username} ${youString}`} />

      <Typography sx={{ textAlign: "center" }} variant="body2" color="text.secondary">
        Creado {`${timeCreated}${isEdited}`}
      </Typography>

      <CardContent sx={{ paddingRight: paddingSides, paddingLeft: paddingSides }}>
        <Typography sx={{ textAlign: "left"}} variant="body" color="text.primary">
          {post.content}
        </Typography>

        <br />
        <br />
        <Typography  sx={{ textAlign: "right"}} variant="body2" color="text.secondary">
          Comentarios: {commentCount}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default PostPreview;
