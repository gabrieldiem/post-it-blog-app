import { Card, CardHeader, CardContent, Typography } from "@mui/material";
import { timeAgoFormatter } from "../services/globals.js";

const PostPreview = ({ post }) => {
  const timeCreated = timeAgoFormatter.format(new Date(post.creation_date));
  const timeEdited = timeAgoFormatter.format(new Date(post.last_change_date));
  const commentCount = post.comments.length;

  return (
    <Card sx={{ maxWidth: "150rem", margin: "1rem auto" }}>
      <CardHeader title={post.title} subheader={`@${post.username}`} />

      <Typography variant="body2" color="text.secondary">
        Creado {`${timeCreated}`}
        <br />
        Editado {`${timeEdited}`}
      </Typography>

      <CardContent>
        <Typography variant="body" color="text.primary">
          {post.content}
        </Typography>

        <Typography variant="body2" color="text.secondary">
          Comentarios: {commentCount}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default PostPreview;
