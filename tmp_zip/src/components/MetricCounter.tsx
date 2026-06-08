import { useEffect, useRef, useState } from "react";

interface MetricCounterProps {
  value: number;
  start?: number;
  duration?: number;
  comma?: boolean;
  prefix?: string;
  suffix?: string;
}

export default function MetricCounter({
  value,
  start = 0,
  duration = 1400,
  comma = false,
  prefix = "",
  suffix = "",
}: MetricCounterProps) {
  const [count, setCount] = useState(start);
  const elementRef = useRef<HTMLSpanElement>(null);
  const animationTriggered = useRef(false);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    setCount(start);
    animationTriggered.current = false;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (!entry.isIntersecting || animationTriggered.current) {
          return;
        }

        animationTriggered.current = true;
        let startTimestamp: number | null = null;

        const step = (timestamp: number) => {
          if (startTimestamp === null) {
            startTimestamp = timestamp;
          }

          const progress = Math.min((timestamp - startTimestamp) / duration, 1);
          const easeProgress = 1 - Math.pow(1 - progress, 3);
          const nextCount = Math.round(start + easeProgress * (value - start));

          setCount(nextCount);

          if (progress < 1) {
            frameRef.current = requestAnimationFrame(step);
            return;
          }

          setCount(value);
          frameRef.current = null;
        };

        frameRef.current = requestAnimationFrame(step);
      },
      { threshold: 0.2 },
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      observer.disconnect();

      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
    };
  }, [duration, start, value]);

  const formatted = comma ? count.toLocaleString("en-GB") : count.toString();
  const safePrefix =
    prefix && (prefix.includes("Â£") || prefix.includes("Ã‚Â£") || prefix.includes("Ãƒ"))
      ? "GBP "
      : prefix;

  return (
    <span ref={elementRef} className="font-display font-bold">
      {safePrefix}
      {formatted}
      {suffix}
    </span>
  );
}
