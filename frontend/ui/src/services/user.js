import axios from "axios";

const BACKEND_SERVER_PORT = 8081;
const VITE_BASE_PATH_BACKEND_SERVER = import.meta.env.VITE_BASE_PATH_BACKEND_SERVER;
const backendUrl = `http://${VITE_BASE_PATH_BACKEND_SERVER}:${BACKEND_SERVER_PORT}`;
console.log(backendUrl)

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

async function updateUsername(oldUsername, newUsername){
  console.log("Updating username");
  const oldUsernameEncoded = encodeURIComponent(oldUsername);
  const newUsernameEncoded = encodeURIComponent(newUsername);
  const getUserUrl = `${backendUrl}/user?old_username=${oldUsernameEncoded}&new_username=${newUsernameEncoded}`;
  const userRes = await axios.put(getUserUrl);
  
  if(userRes.data && userRes.data[0]){
    const userFetched = userRes.data[0];
    console.log(userFetched);
    return parseUserInfo(userFetched);
  }

  return userRes.data;
}

async function deleteUser(username) {
  console.log("Deleting user");
  const usernameEncoded = encodeURIComponent(username);
  const getUserUrl = `${backendUrl}/user?username=${usernameEncoded}`;
  const userRes = await axios.delete(getUserUrl);

  const res = userRes.data;
  console.log(res)
  return res == "OK";
}

export {getUserInfo};
export {createNewUser};
export {isUserLogged};
export {updateUsername};
export {deleteUser};
