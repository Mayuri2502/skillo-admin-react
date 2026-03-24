export const formatLabelsByLocale = (labels, locale) => {
  return labels?.map((label) => {
    const date = new Date(`1970-01-01 ${label}`);

    if (isNaN(date.getTime())) {
      return label;
    }

    return new Intl.DateTimeFormat(locale, {
      hour: "2-digit",
      minute: "2-digit",
      hour12: locale === "en-US",
    }).format(date);
  });
};
