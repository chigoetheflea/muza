import Swiper from 'swiper';
import { Navigation } from 'swiper/modules';

const SLIDER = `.js-slider-line`;
const SLIDER_PREV = `.js-slider-prev`;
const SLIDER_NEXT = `.js-slider-next`;

const SLIDES_PER_VIEW_MOBILE = 1.15;
const SLIDES_PER_VIEW_TABLET = 2.15;
const SLIDES_PER_VIEW_DESKTOP = 3.15;
const SLIDES_PER_VIEW_HD = 4;

const SLIDES_PER_GROUP = 1;

const SPACE_BETWEEN_MOBILE = 0;
const SPACE_BETWEEN_TABLET = 0;
const SPACE_BETWEEN_DESKTOP = 0;
const SPACE_BETWEEN_HD = 0;

const BREAKPOINT_TABLET = 768;
const BREAKPOINT_DESKTOP = 1024;
const BREAKPOINT_HD = 1440;

const SLIDE_SPEED = 700;
const SWIPE_THRESHOLD = 8;
const TOUCH_RATIO = 1;
const RESISTANCE_RATIO = 0.85;
const LONG_SWIPES_RATIO = 0.2;
const LONG_SWIPES_MS = 200;
const INITIAL_SLIDE_INDEX = 4;

const getInitialIndex = () => {
    
};

const fixInitialLoopPosition = (swiper) => {
  requestAnimationFrame(() => {
    swiper.update();
    swiper.slideToLoop(INITIAL_SLIDE_INDEX, 0, false);
  });
};

const initLineSlider = () => {
  const sliders = document.querySelectorAll(SLIDER);

  if (!sliders.length) return;

  sliders.forEach((slider) => {
    const sliderSection = slider.closest(`section`) || slider.parentElement;
    const prevButton = sliderSection.querySelector(SLIDER_PREV);
    const nextButton = sliderSection.querySelector(SLIDER_NEXT);

    if (!prevButton || !nextButton) return;

    new Swiper(slider, {
      modules: [Navigation],
      loop: true,
      speed: SLIDE_SPEED,
      slidesPerView: SLIDES_PER_VIEW_MOBILE,
      slidesPerGroup: SLIDES_PER_GROUP,
      spaceBetween: SPACE_BETWEEN_MOBILE,
      navigation: {
        prevEl: prevButton,
        nextEl: nextButton,
      },
      followFinger: true,
      touchRatio: TOUCH_RATIO,
      threshold: SWIPE_THRESHOLD,
      resistance: true,
      resistanceRatio: RESISTANCE_RATIO,
      longSwipes: true,
      longSwipesRatio: LONG_SWIPES_RATIO,
      longSwipesMs: LONG_SWIPES_MS,
      watchOverflow: true,
      observer: true,
      observeParents: true,
      on: {
        init() {
          fixInitialLoopPosition(this);
        },
      },
      breakpoints: {
        [BREAKPOINT_TABLET]: {
          slidesPerView: SLIDES_PER_VIEW_TABLET,
          spaceBetween: SPACE_BETWEEN_TABLET,
        },
        [BREAKPOINT_DESKTOP]: {
          slidesPerView: SLIDES_PER_VIEW_DESKTOP,
          spaceBetween: SPACE_BETWEEN_DESKTOP,
        },
        [BREAKPOINT_HD]: {
          slidesPerView: SLIDES_PER_VIEW_HD,
          spaceBetween: SPACE_BETWEEN_HD,
        },
      },
    });
  });
};

export {
  initLineSlider,
};