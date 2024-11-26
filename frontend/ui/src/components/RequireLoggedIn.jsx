import ModalNotLogged from "./ModalNotLogged";
import { isUserLogged } from "../services/user";

const RequireLoggedIn = ({ userState, children }) => {
  return <>{isUserLogged(userState.user) ? children : <ModalNotLogged />}</>;
};

export default RequireLoggedIn;
