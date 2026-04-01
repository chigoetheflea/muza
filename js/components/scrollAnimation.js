const ANIMATED_ELEMENT = `.js-animated`;
const ANIMATED_CLASS = `animated--complited`;
const DEFAULT_OFFSET = 100;

const getRootMargin = (offset) => {
 return `0px 0px ${-1*offset}px 0px`;
};

const initScrollAnimation = () => {
  const animatedElements = document.querySelectorAll(ANIMATED_ELEMENT);

  if (!animatedElements.length) return;

  animatedElements.forEach((element) => {
    const offset = Number(element.dataset.animationOffset) || DEFAULT_OFFSET;

    const observer = new IntersectionObserver(
      (entries, currentObserver) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add(ANIMATED_CLASS);
          currentObserver.unobserve(entry.target);
        });
      },
      {
        root: null,
        rootMargin: getRootMargin(offset),
        threshold: 0.2,
      }
    );

    observer.observe(element);
  });
};

export {
  initScrollAnimation,
};