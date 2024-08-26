import dayjs from 'dayjs';

export const getMonth = (month = dayjs().month()) => {
  const year = dayjs().year();
  const firstDayOfTheMonth = (dayjs(new Date(year, month, 1)).day() + 6) % 7;
  const daysInMonth = dayjs(new Date(year, month)).daysInMonth();
  let currentMonthCount = 0 - firstDayOfTheMonth;

  const totalDaysInGrid = firstDayOfTheMonth + daysInMonth;
  const weeksInGrid = Math.ceil(totalDaysInGrid / 7);

  const daysMatrix = Array.from({ length: weeksInGrid }, () =>
    Array.from({ length: 7 }, () => {
      currentMonthCount++;
      return dayjs(new Date(year, month, currentMonthCount));
    })
  );

  return daysMatrix;
};
