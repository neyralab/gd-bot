import { useState, useEffect } from 'react';

const useWeeklyTimer = () => {
  // Calculate time left until next Monday Central Time
  const calculateTimeLeft = () => {
    const now = new Date();
    const nextMonday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + ((1 + 7 - now.getDay()) % 7 || 7),
      0 - now.getTimezoneOffset() / 60 - 6, // Adjust for Central Time (UTC-6)
      0,
      0,
      0
    );

    const diff = nextMonday - now;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / 1000 / 60) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    return `${days} : ${hours.toString().padStart(2, '0')} : ${minutes.toString().padStart(2, '0')} : ${seconds.toString().padStart(2, '0')}`;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return timeLeft;
};

export default useWeeklyTimer;
