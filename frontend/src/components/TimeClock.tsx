import React, { useState, useEffect } from "react";

interface TimeClockProps {
  startTime: string; // ISO string of when the session started
  eventTitle?: string;
}

const TimeClock: React.FC<TimeClockProps> = ({ startTime, eventTitle }) => {
  const [elapsedTime, setElapsedTime] = useState<number>(0);

  useEffect(() => {
    const calculateElapsed = () => {
      const start = new Date(startTime).getTime();
      const now = new Date().getTime();
      const elapsed = Math.max(0, Math.floor((now - start) / 1000)); // elapsed time in seconds
      setElapsedTime(elapsed);
    };

    // Calculate immediately
    calculateElapsed();

    // Update every second
    const interval = setInterval(calculateElapsed, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  const formatTime = (totalSeconds: number): string => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(seconds).padStart(2, "0")}`;
  };

  const hours = elapsedTime / 3600;

  return (
    <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
      <div className="text-center">
        <div className="text-sm font-medium mb-2 opacity-90">
          {eventTitle ? `Active Session: ${eventTitle}` : "Active Session"}
        </div>
        <div className="text-5xl font-bold font-mono mb-2">
          {formatTime(elapsedTime)}
        </div>
        <div className="text-sm opacity-75">
          {hours.toFixed(2)} hours elapsed
        </div>
        <div className="mt-4 flex items-center justify-center gap-2">
          <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
          <span className="text-sm font-medium">Clock Running</span>
        </div>
      </div>
    </div>
  );
};

export default TimeClock;

