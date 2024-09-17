import moment from "moment";

export const getLastMonth = () => {
  const currentDate = moment();

  currentDate.date(1);
  const last6Months: string[] = [];
  const last12Months: string[] = [];

  for (let i = 0; i < 12; i++) {
    const monthDate = currentDate.clone().subtract(i, "months");
    const monthName = monthDate.format("MMMM");
    if (i < 6) last6Months.unshift(monthName);
    last12Months.unshift(monthName);
  }

  return {
    last12Months,
    last6Months,
  };
};
