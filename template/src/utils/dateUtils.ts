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

export const generateTimeOptions = (selectedDay: dayjs.Dayjs): number[] => {
  const times: number[] = [];
  const startOfDay = selectedDay?.startOf('day'); // Get the start of the selected day

  for (let i = 0; i < 48; i++) {
    const time = startOfDay.add(i * 30, 'minute').valueOf(); // Increment by 30 minutes
    times.push(time);
  }

  return times;
};

export const isMeetingStartingSoon = (meetingStartTime: number): boolean => {
  const currentTime = dayjs();
  const startTime = dayjs(meetingStartTime);
  return startTime.diff(currentTime, 'minute') <= 15;
};
