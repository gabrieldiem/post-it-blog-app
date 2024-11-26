import axios from "axios";
const BACKEND_SERVER_PORT = 3001;
const backendUrl = `http://localhost:${BACKEND_SERVER_PORT}`;

function parseUserInfo(userInfo) {
  return {
    id: userInfo.user_id,
    name: userInfo.user_name,
    creation_date: userInfo.user_creation_date,
  };
}

async function getUserInfo(username) {
  console.log("Validating username");
  const usernameEncoded = encodeURIComponent(username);
  const getUserUrl = `${backendUrl}/user?username=${usernameEncoded}`;
  const userRes = await axios.get(getUserUrl);

  if(userRes.data && userRes.data[0]){
    const userFetched = userRes.data[0];
    console.log(userFetched);
    return parseUserInfo(userFetched);
  }

  return userRes.data;
}

async function createNewUser(username) {
  console.log("Creating new user");
  const usernameEncoded = encodeURIComponent(username);
  const getUserUrl = `${backendUrl}/user?username=${usernameEncoded}`;
  const userRes = await axios.post(getUserUrl);

  if(userRes.data && userRes.data[0]){
    const userFetched = userRes.data[0];
    console.log(userFetched);
    return parseUserInfo(userFetched);
  }

  return userRes.data;
}

function isUserLogged(user){
  if (!user) {
    return false;
  }

  if (!user.name) {
    return false;
  }

  if (!user.creation_date) {
    return false;
  }

  return true;
}

export {getUserInfo};
export {createNewUser};
export {isUserLogged};
