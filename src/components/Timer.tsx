import Container from './UI/Container.tsx';
import { Timer as TimerProps } from '../store/timers-context.tsx';
import { useEffect, useState, useRef } from 'react';
import { useTimersContext } from '../store/timers-context.tsx';

export default function Timer({ name, duration }: TimerProps) {
  const [remainigTime, setRemainingTime] = useState(duration * 1000)
  const interval = useRef<number | null>(null);
  const { isRunning } = useTimersContext();

  if (remainigTime <= 0 && interval.current) {
    clearInterval(interval.current);
  }

  useEffect(() => {
    let timer: number;
    if (isRunning) {
      timer = setInterval(function () {
        setRemainingTime(prev => {
          if (prev <= 0) {
            return prev;
          }
          return prev - 50
        });
      }, 50);
      interval.current = timer;

    } else if (interval.current) {
      clearInterval(interval.current);
    }

    return () => clearInterval(timer);
  }, [isRunning]);

  const formattedRemainingTime = (remainigTime / 1000).toFixed(2);

  return (
    <Container as="article">
      <h2>{name}</h2>
      <p><progress max={duration * 1000} value={remainigTime} /></p>
      <p>{formattedRemainingTime}</p>
    </Container>
  );
}
