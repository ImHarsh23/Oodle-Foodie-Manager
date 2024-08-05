import { useRef } from "react";

const useDebounce = () => {
  let timeoutRef = useRef();
  return (func, delay) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    return (arg) => {
      timeoutRef.current = setTimeout(() => {
        func(arg);
      }, delay);
    };
  };
};

export default useDebounce;
