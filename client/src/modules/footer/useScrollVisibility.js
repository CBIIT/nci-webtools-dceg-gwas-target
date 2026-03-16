import { useState, useEffect } from "react";

export function useScrollVisibility(threshold = 100) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const update = () => {
      setIsVisible(document.body.scrollHeight > window.innerHeight && window.scrollY > threshold);
    };
    update();
    window.addEventListener("scroll", update);
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [threshold]);

  return isVisible;
}
