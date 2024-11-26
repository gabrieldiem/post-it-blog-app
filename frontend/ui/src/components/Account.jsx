import { Card, CardHeader, CardContent, Typography, Box, Divider } from "@mui/material";
import { timeAgoFormatter } from "../services/globals.js";

const COLOR = "#282828";
const VIOLET_PRIMARY = "#a757e4";

const Account = ({ userState }) => {
  if (userState.user == null) {
    userState.user = {};
    userState.user.name = "test";
    userState.user.creation_date = Date.now();
  }
  const timeJoined = timeAgoFormatter.format(new Date(userState.user.creation_date));
  const paddingSides = "30px";

  return (
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
        <CardHeader
          sx={{ textAlign: "left" }}
          title={
            <Typography sx={{ textAlign: "center", fontSize: "40px" }}>
              Configura tu cuenta{" "}
              <Typography variant="string" sx={{ textAlign: "inherit", fontSize: "40px", color: VIOLET_PRIMARY }}>
                {userState.user.name}
              </Typography>
            </Typography>
          }
        />
        <Divider />

        <CardContent sx={{ paddingRight: paddingSides, paddingLeft: paddingSides }}>
          <Typography sx={{ textAlign: "left" }} variant="body" color="text.primary">
            Te uniste a PostIt {timeJoined}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Account;
