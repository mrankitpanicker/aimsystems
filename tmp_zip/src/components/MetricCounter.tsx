import { useEffect, useState, useRef } from "react";

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

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !animationTriggered.current) {
          animationTriggered.current = true;
          let startTimestamp: number | null = null;
          
          const step = (timestamp: number) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            // Cubic ease-out
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(start + easeProgress * (value - start)));
            
            if (progress < 1) {
              requestAnimationFrame(step);
            }
          };
          
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.2 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, [value, start, duration]);

  const formatted = comma ? count.toLocaleString("en-GB") : count.toString();
  const safePrefix =
    prefix && (prefix.includes("£") || prefix.includes("Â£") || prefix.includes("Ã"))
      ? "GBP "
      : prefix;
  const normalizedPrefix = prefix === "Â£" ? "£" : prefix;

  return (
    <span ref={elementRef} className="font-display font-bold">
      {safePrefix}
      {formatted}
      {suffix}
    </span>
  );
}
