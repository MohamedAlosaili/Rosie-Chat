import { useEffect, useState, useRef } from "react";

import useStorage from "hooks/useStorage";

function useTimer(initialValue = 90) {
  const [getStorageCounter, setStorageCounter] = useStorage(
    "sessionStorage",
    "counter"
  );
  const [counter, setCounter] = useState(
    () => +getStorageCounter || initialValue
  );
  const [timer, setTimer] = useState(() => countDown());
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const interval = useRef(null);

  useEffect(() => {
    startTimer();
    return () => stopTimer();
  }, []);

  useEffect(() => {
    if (counter <= 0) stopTimer();

    setTimer(countDown());
    setStorageCounter(counter);
  }, [counter]);

  function startTimer() {
    counter === 0 && setCounter(initialValue);
    setIsTimerRunning(true);

    interval.current = setInterval(() => {
      setCounter((prevCounter) => prevCounter - 1);
    }, 1000);
  }

  function stopTimer() {
    setIsTimerRunning(false);
    clearInterval(interval.current);
    interval.current = null;
  }

  function countDown() {
    const min = Math.floor(counter / 60);
    const sec = counter % 60;

    return `0${min}:${sec < 10 ? "0" : ""}${sec}`;
  }

  return [timer, isTimerRunning, startTimer];
}

export default useTimer;
