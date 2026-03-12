export function initBackToTop(selector = ".usa-footer__return-to-top", threshold = 100) {
  const backToTop = document.querySelector(selector);
  if (!backToTop) return () => {};

  const toggleBackToTop = () => {
    if (document.body.scrollHeight <= window.innerHeight) {
      backToTop.style.display = "none";
      return;
    }
    backToTop.style.display = window.scrollY > threshold ? "flex" : "none";
  };

  toggleBackToTop();
  window.addEventListener("scroll", toggleBackToTop);
  window.addEventListener("resize", toggleBackToTop);

  return () => {
    window.removeEventListener("scroll", toggleBackToTop);
    window.removeEventListener("resize", toggleBackToTop);
  };
}
