export const getWeekNumber = (startDate) => {
  const currentDate = new Date();

  // Find the most recent Monday 11 AM Kyiv time
  const kyivTime = new Date(currentDate.getTime() + 3 * 60 * 60 * 1000); // Kyiv is UTC+3
  kyivTime.setHours(11, 0, 0, 0); // Set to 11:00:00.000
  while (kyivTime.getDay() !== 1 || kyivTime > currentDate) {
    kyivTime.setDate(kyivTime.getDate() - 1);
  }

  const diff = kyivTime - startDate;
  const weekNumber = Math.floor(diff / (7 * 24 * 60 * 60 * 1000));

  return weekNumber + 1;
};
