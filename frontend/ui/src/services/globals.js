import TimeAgo from "javascript-time-ago";
import TimeAgoEs from "javascript-time-ago/locale/es";

TimeAgo.addDefaultLocale(TimeAgoEs);

const timeAgoFormatter = new TimeAgo("es-AR");

const CLIENT_URLS = {
  HOME: "/",
  SIGNUP: "/signup",
  LOGIN: "/login",
  ACCOUNT: "/account",
  POST: "/post",
};

export { timeAgoFormatter, CLIENT_URLS };
