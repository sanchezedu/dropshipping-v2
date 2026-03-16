import { useState, useEffect } from 'react';

export default function CountdownTimer({ targetDate, onComplete }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        clearInterval(timer);
        if (onComplete) onComplete();
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate, onComplete]);

  return (
    <div className="flex gap-2 md:gap-4">
      {[
        { value: timeLeft.days, label: 'Días' },
        { value: timeLeft.hours, label: 'Horas' },
        { value: timeLeft.minutes, label: 'Min' },
        { value: timeLeft.seconds, label: 'Seg' }
      ].map((item, index) => (
        <div key={index} className="text-center">
          <div className="bg-red-600 text-white text-xl md:text-2xl font-bold px-2 md:px-4 py-2 rounded-lg">
            {String(item.value).padStart(2, '0')}
          </div>
          <div className="text-xs text-gray-500 mt-1">{item.label}</div>
        </div>
      ))}
    </div>
  );
}
