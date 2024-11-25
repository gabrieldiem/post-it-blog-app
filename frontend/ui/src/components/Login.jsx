import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";

const VIOLET_PRIMARY = "#a757e4";
const username = "MixerPippin";

const Login = ({ userState }) => {
  const navigate = useNavigate();

  const logUser = () => {
    userState.setUser(username);
    navigate("/");
  };

  return (
    <>
      <Button onClick={logUser} sx={{ my: 2, color: VIOLET_PRIMARY }}>
        Login as {username}
      </Button>
    </>
  );
};

export default Login;
