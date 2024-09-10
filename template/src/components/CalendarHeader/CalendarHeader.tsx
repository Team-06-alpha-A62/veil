import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import dayjs from 'dayjs';
import CalendarModal from '../CreateMeetingModal/CreateMeetingModal.tsx';

interface CalendarHeaderProps {
  monthIndex: number;
  setMonthIndex: React.Dispatch<React.SetStateAction<number>>;
  selectedDay: dayjs.Dayjs;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  monthIndex,
  setMonthIndex,
  selectedDay,
}) => {
  const formattedMonth = dayjs(new Date(dayjs().year(), monthIndex)).format(
    'MMMM YYYY'
  );

  const handlePrevMonth = () => {
    setMonthIndex(monthIndex => monthIndex - 1);
  };

  const handleNextMonth = () => {
    setMonthIndex(monthIndex => monthIndex + 1);
  };

  const handleReset = () => {
    setMonthIndex(dayjs().month());
  };

  return (
    <header className="px-4 py-4 text-base-content flex flex-row-reverse items-center gap-4">
      <CalendarModal selectedDay={selectedDay} />
      <button
        className="px-3 py-1 rounded-3xl  bg-neutral  text-white 00 mr-5   text-sm font-semibold hover:bg-opacity-75"
        onClick={handleReset}
      >
        Today
      </button>
      <button
        className="flex justify-center bg-neutral text-white p-2  rounded-full  hover:bg-opacity-75 "
        onClick={handleNextMonth}
      >
        <FaChevronRight />
      </button>
      <button
        className="flex justify-center bg-neutral text-white p-2 rounded-full  hover:bg-opacity-75 "
        onClick={handlePrevMonth}
      >
        <FaChevronLeft />
      </button>
      <h2 className="text-xl font-bold">{formattedMonth}</h2>
    </header>
  );
};

export default CalendarHeader;
