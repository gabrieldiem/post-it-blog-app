import TimeAgo from "javascript-time-ago";
import TimeAgoEs from "javascript-time-ago/locale/es";

TimeAgo.addDefaultLocale(TimeAgoEs);

const BACKEND_SERVER_PORT = 8081;
const VITE_BASE_PATH_BACKEND_SERVER = import.meta.env.VITE_BASE_PATH_BACKEND_SERVER;
const BACKEND_URL = `http://${VITE_BASE_PATH_BACKEND_SERVER}:${BACKEND_SERVER_PORT}`;
console.log(BACKEND_URL)

const timeAgoFormatter = new TimeAgo("es-AR");

const CLIENT_URLS = {
  HOME: "/",
  SIGNUP: "/signup",
  LOGIN: "/login",
  ACCOUNT: "/account",
  POST: "/post",
  CREATE_POST: "/create",
};

export { timeAgoFormatter, CLIENT_URLS, BACKEND_URL };
