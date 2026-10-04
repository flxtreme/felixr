type DateInput = string | number | Date | null | undefined;

const parseDate = (value: DateInput) => {
  const date = value instanceof Date ? value : new Date(value ?? Number.NaN);
  return Number.isNaN(date.getTime()) ? null : date;
};

export const formatShortDate = (value: DateInput) => {
  if (typeof value === "string") {
    const yearMonth = /^(\d{4})-(\d{2})$/.exec(value.trim());
    if (yearMonth) {
      const year = Number(yearMonth[1]);
      const month = Number(yearMonth[2]);
      if (month >= 1 && month <= 12) {
        return new Intl.DateTimeFormat("en-US", {
          month: "short",
          year: "numeric",
          timeZone: "UTC",
        }).format(new Date(Date.UTC(year, month - 1, 1)));
      }
    }
  }

  const date = parseDate(value);
  if (!date) return "";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "numeric",
  }).format(date);
};

export const formatDate = (value: DateInput) => {
  const date = parseDate(value);
  if (!date) return "";

  const parts = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).formatToParts(date);
  const part = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((item) => item.type === type)?.value ?? "";

  return `${part("month")} ${part("day")}, ${part("year")} ${part("hour")}:${part("minute")} ${part("dayPeriod").toLowerCase()}`;
};
