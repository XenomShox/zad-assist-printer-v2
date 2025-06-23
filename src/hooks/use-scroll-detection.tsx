import { type RefObject, useEffect, useRef } from "react";

interface UseScrollDetectionProps<T> {
  onTop?: (ref: RefObject<T | null>) => void;
  onBottom?: (ref: RefObject<T | null>) => void;
}

const useScrollDetection = <T extends HTMLDivElement>({
  onTop,
  onBottom,
}: UseScrollDetectionProps<T>) => {
  const scrollRef = useRef<T | null>(null);

  useEffect(() => {
    const element = scrollRef.current;

    if (!element) return;

    const handleScroll = async () => {
      const { scrollTop, scrollHeight, clientHeight } = element;

      if (scrollTop === 0) onTop?.(scrollRef);
      if (scrollTop + clientHeight >= scrollHeight) onBottom?.(scrollRef);
    };

    element.addEventListener("scroll", handleScroll);
    return () => element.removeEventListener("scroll", handleScroll);
  }, [scrollRef.current, onTop, onBottom]);

  return scrollRef;
};

export default useScrollDetection;
