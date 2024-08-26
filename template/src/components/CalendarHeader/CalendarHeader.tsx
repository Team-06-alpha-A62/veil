import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import dayjs from 'dayjs';
import CreateMeetingButton from '../CreateMeetingButton/CreateMeetingButton.tsx';
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
    <header className="px-4 py-2 flex flex-row-reverse items-center gap-4">
      <CalendarModal selectedDay={selectedDay} />
      <button
        className="px-3 py-1 rounded-3xl border mr-5 text-sm font-semibold hover:bg-primary hover:border-primary hover:text-neutral"
        onClick={handleReset}
      >
        Today
      </button>
      <button
        className="flex justify-center p-2 border rounded-full btn-outline hover:bg-primary hover:border-primary"
        onClick={handleNextMonth}
      >
        <FaChevronRight />
      </button>
      <button
        className="flex justify-center p-2 border rounded-full btn-outline hover:bg-primary hover:border-primary"
        onClick={handlePrevMonth}
      >
        <FaChevronLeft />
      </button>
      <h2 className="text-xl font-bold">{formattedMonth}</h2>
    </header>
  );
};

export default CalendarHeader;
