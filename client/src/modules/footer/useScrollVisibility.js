import { useState, useEffect } from "react";

export function useScrollVisibility(threshold = 100) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let rafId = null;

    const update = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        setIsVisible(document.body.scrollHeight > window.innerHeight && window.scrollY > threshold);
        rafId = null;
      });
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [threshold]);

  return isVisible;
}
