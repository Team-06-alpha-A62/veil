import React, { useState, useEffect, useRef } from 'react';
import { createNotification } from '../../services/notification.service';
import { useAuth } from '../../providers/AuthProvider';
import { NotificationType } from '../../enums/NotificationType';
import { NotificationMessageType } from '../../enums/NotificationMessageType';

interface PomodoroCircularTimerProps {
  defaultDuration?: number;
}

const PomodoroCircularTimer: React.FC<PomodoroCircularTimerProps> = ({
  defaultDuration = 25,
}) => {
  const { currentUser } = useAuth();

  const [duration, setDuration] = useState<number>(() =>
    parseInt(
      localStorage.getItem('pomodoroDuration') || `${defaultDuration * 60}`
    )
  );
  const [timeLeft, setTimeLeft] = useState<number>(duration);
  const [isActive, setIsActive] = useState<boolean>(
    () => localStorage.getItem('pomodoroIsActive') === 'true'
  );
  const [customMinutes, setCustomMinutes] = useState<number>(() =>
    parseInt(
      localStorage.getItem('pomodoroCustomMinutes') || `${defaultDuration}`
    )
  );

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const savedStartTime = localStorage.getItem('pomodoroStartTime');
    const onTimeComplete = async () => {
      await createNotification(
        currentUser.userData!.username,
        currentUser.userData!.username,
        NotificationType.TIMER,
        'Time is up.',
        NotificationMessageType.ALERT_WARNING
      );
    };
    if (savedStartTime && isActive) {
      const elapsed = Math.floor(
        (Date.now() - parseInt(savedStartTime)) / 1000
      );
      const newTimeLeft = duration - elapsed;
      setTimeLeft(newTimeLeft > 0 ? newTimeLeft : 0);
      if (newTimeLeft <= 0 && onTimeComplete) {
        onTimeComplete();
        setIsActive(false);
      }
    }

    let interval: NodeJS.Timeout | null = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        const elapsed = Math.floor(
          (Date.now() -
            parseInt(localStorage.getItem('pomodoroStartTime') || '0')) /
            1000
        );
        const newTimeLeft = duration - elapsed;
        setTimeLeft(newTimeLeft > 0 ? newTimeLeft : 0);
        if (newTimeLeft <= 0 && interval) {
          clearInterval(interval);
          setIsActive(false);
          if (onTimeComplete) {
            onTimeComplete();
          }
        }
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [isActive, timeLeft, duration]);

  useEffect(() => {
    localStorage.setItem('pomodoroTimeLeft', `${timeLeft}`);
    localStorage.setItem('pomodoroIsActive', `${isActive}`);
    localStorage.setItem('pomodoroDuration', `${duration}`);
    localStorage.setItem('pomodoroCustomMinutes', `${customMinutes}`);
  }, [timeLeft, isActive, duration, customMinutes]);

  const handleStartPause = () => {
    if (timeLeft > 0) {
      setIsActive(!isActive);
      if (!isActive) {
        localStorage.setItem('pomodoroStartTime', `${Date.now()}`);
      }
    }
  };

  const handleReset = () => {
    setIsActive(false);
    setTimeLeft(duration);
    localStorage.removeItem('pomodoroStartTime');
  };

  const handleCustomDurationChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newDuration = parseInt(e.target.value) || 0;
    setCustomMinutes(newDuration);
    setDuration(newDuration * 60);
    setTimeLeft(newDuration * 60);
    setIsActive(false);
    localStorage.removeItem('pomodoroStartTime');
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const calculateStrokeDashoffset = () => {
    const circleLength = 2 * Math.PI * 90;
    return circleLength - (timeLeft / duration) * circleLength;
  };

  return (
    <div className="p-4 flex flex-col gap-3 justify-center items-center">
      <div className="flex gap-4 font-semibold items-center justify-between">
        <h3>Pomodoro</h3>
        <input
          type="number"
          className="text-lg font-medium bg-base-300 text-base-content rounded w-20 text-center"
          value={customMinutes}
          onChange={handleCustomDurationChange}
          min={1}
        />
      </div>

      <div className="relative flex flex-col justify-center items-center w-48 h-48">
        <svg className="absolute w-full h-full pointer-events-none">
          <circle
            className="text-primary-content"
            strokeWidth="10"
            stroke="currentColor"
            fill="transparent"
            r="90"
            cx="50%"
            cy="50%"
          />
          <circle
            className="text-primary"
            strokeWidth="10"
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r="90"
            cx="50%"
            cy="50%"
            style={{
              strokeDasharray: `${2 * Math.PI * 90}px`,
              strokeDashoffset: calculateStrokeDashoffset(),
              transition: 'stroke-dashoffset 1s linear',
            }}
          />
        </svg>
        <div className="flex flex-col items-center">
          <span className="text-4xl font-bold ">{formatTime(timeLeft)}</span>
          <div className="flex space-x-4 mt-2">
            <button onClick={handleStartPause} className="text-lg font-medium ">
              {isActive ? 'Pause' : 'Start'}
            </button>
            <button onClick={handleReset} className="text-lg font-medium ">
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PomodoroCircularTimer;
