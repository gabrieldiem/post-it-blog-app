import TimeAgo from "javascript-time-ago";
import TimeAgoEs from "javascript-time-ago/locale/es";

TimeAgo.addDefaultLocale(TimeAgoEs);

const timeAgoFormatter = new TimeAgo("es-AR");

export { timeAgoFormatter };
