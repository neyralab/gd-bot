export const getWeekNumber = (startDate) => {
  const currentDate = new Date();
  const diff = currentDate - startDate;
  const weekNumber = Math.floor(diff / 604800000);
  return weekNumber + 1;
};
