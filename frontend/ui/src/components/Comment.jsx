import { Card, CardHeader, CardContent, Typography, Box } from "@mui/material";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { getPostById } from "../services/posts";
import PostPreview from "./PostPreview";
import { timeAgoFormatter } from "../services/globals.js";
import { CLIENT_URLS } from "../services/globals";
import GenericDialog from "./GenericDialog";

const COLOR = "#282828";
const paddingSides = "30px";

const Comment = ({ data }) => {
  return (
    <Card
      sx={{
        maxWidth: "70rem",
        minWidth: "15rem",
        margin: "2rem auto",
        backgroundColor: COLOR,
        borderRadius: "20px",
        padding: "10px 50px 10px 20px",
      }}
    >
      <CardContent sx={{ paddingRight: paddingSides, paddingLeft: paddingSides }}>
        <Typography sx={{ textAlign: "left" }} variant="body" color="text.primary">
          {data.content}
        </Typography>
      </CardContent>

      <Typography sx={{ textAlign: "right" }} variant="body2" color="text.secondary">
        Comentó {} Creado {`${data.timeCreated}${data.isEdited}`}
      </Typography>
    </Card>
  );
};

export default Comment;
