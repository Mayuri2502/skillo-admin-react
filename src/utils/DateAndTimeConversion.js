import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import customParseFormat from "dayjs/plugin/customParseFormat";

export const timeAgo = (dateString) => {
  const now = new Date();
  const date = new Date(dateString);
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays}d ago`;
};

export const formatDateAndTimeUTCToLocal = (dateString) => {
  return new Date(dateString).toLocaleString();
};

// utils/date.ts

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);

/**
 * @param {string} value - backend datetime string
 * @param {string} format - output format
 * @param {Object} options
 * @param {string} options.timezone - optional timezone (e.g. "Asia/Kolkata")
 */

export const formateDate = (
  value,
  format = "DD MMM YYYY",
  { timezone: tz } = {},
) => {
  if (!value) return "-";

  const date = dayjs.utc(
    value,
    ["YYYY-MM-DD HH:mm:ssZZ", "YYYY-MM-DDTHH:mm:ssZZ"],
    true,
  );

  if (!date.isValid()) {
    console.error("Invalid date:", value);
    return "-";
  }

  return tz ? date.tz(tz).format(format) : date.format(format);
};
