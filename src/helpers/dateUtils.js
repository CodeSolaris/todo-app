export const formatDateTime = (dateString, isShort = false) => {
  const date = new Date(dateString);
  const now = new Date();
  const isThisYear = date.getFullYear() === now.getFullYear();

  return date.toLocaleString("en-US", {
    day: "numeric",
    month: isShort ? "short" : "long",
    year: isThisYear && isShort ? undefined : "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};
