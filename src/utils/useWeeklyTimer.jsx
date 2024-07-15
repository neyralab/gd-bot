import { useState, useEffect, useCallback } from 'react';
import moment from 'moment';

const useWeeklyTimer = () => {
  // Calculate time left until next Monday at 11 am Kyiv time
  const calculateTimeLeft = useCallback(() => {
    const n = moment.utc(); //.toDate();
    const m = moment
      .utc()
      .add(7, 'day')
      .set({ hour: 8, minutes: 0, seconds: 0 }); //.toDate();
    console.log({ n, m });

    const d = moment.duration(m.diff(n)); //.asDays();
    console.log({ d: d.toString() });

    return `${d.days() % 7 || '00'} : ${d.hours().toString().padStart(2, '0')} : ${d.minutes().toString().padStart(2, '0')} : ${d.seconds().toString().padStart(2, '0')}`;

    const now = new Date();
    const nextMonday = new Date(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate() + ((1 + 7 - now.getUTCDay()) % 7 || 7),
      11, // Set the hour to 11 am
      0,
      0,
      0
    );

    const diff = nextMonday - now;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24)) % 7 || '00';
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / 1000 / 60) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    return `${days} : ${hours.toString().padStart(2, '0')} : ${minutes.toString().padStart(2, '0')} : ${seconds.toString().padStart(2, '0')}`;
  }, []);

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [calculateTimeLeft]);

  return timeLeft;
};

export default useWeeklyTimer;
