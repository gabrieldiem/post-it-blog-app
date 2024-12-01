import TimeAgo from "javascript-time-ago";
import TimeAgoEs from "javascript-time-ago/locale/es";

TimeAgo.addDefaultLocale(TimeAgoEs);

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
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
