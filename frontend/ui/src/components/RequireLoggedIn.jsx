import ModalNotLogged from "./ModalNotLogged";

const RequireLoggedIn = ({ userState, children }) => {
  const isLogged = () => {
    if (!userState.user) {
      return false;
    }

    if (!userState.user.name) {
      return false;
    }

    if (!userState.user.creation_date) {
      return false;
    }

    return true;
  };

  return <>{isLogged() ? children : <ModalNotLogged />}</>;
};

export default RequireLoggedIn;
