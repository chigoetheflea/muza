import Swiper from 'swiper';
import { Autoplay } from 'swiper/modules';

const SLIDER = `.js-slider-wide`;
const SLIDE_IMAGE = `.js-slider-wide-img`;
const SLIDE_INFO = `.js-slider-wide-info`;

const DOTS_CONTAINER = `.js-slider-dots`;
const DOT = `.slider-wide__dot`;
const DOT_PROGRESS_ELEMENT = `span`;
const ACTIVE_DOT_CLASS = `slider-wide__dot--active`;

const ANIMATED_IMAGE_CLASS = `slider-wide__img--animated`;
const ACTIVE_INFO_CLASS = `slider-wide__info--active`;

const AUTOPLAY_DELAY = 5000;
const SLIDE_SPEED = 600;
const SLIDE_TO_LOOP_SPEED = SLIDE_SPEED;
const INITIAL_SLIDE_INDEX = 0;
const RESTART_ANIMATION_TIMEOUT = 20;

const clearActiveDots = (dots) => {
  dots.forEach((dot) => {
    dot.classList.remove(ACTIVE_DOT_CLASS);
  });
};

const clearAnimatedImages = (images) => {
  images.forEach((image) => {
    image.classList.remove(ANIMATED_IMAGE_CLASS);
  });
};

const clearActiveInfos = (infos) => {
  infos.forEach((info) => {
    info.classList.remove(ACTIVE_INFO_CLASS);
  });
};

const restartDotAnimation = (dot) => {
  const progressElement = dot.querySelector(DOT_PROGRESS_ELEMENT);

  if (!progressElement) return;

  progressElement.style.animation = `none`;
  void progressElement.offsetWidth;

  setTimeout(() => {
    progressElement.style.animation = ``;

    progressElement.style.setProperty(`--slider-autoplay-delay`, `${AUTOPLAY_DELAY}ms`);
  }, RESTART_ANIMATION_TIMEOUT);
};

const setActiveDot = (dots, index) => {
  clearActiveDots(dots);

  if (!dots[index]) return;

  dots[index].classList.add(ACTIVE_DOT_CLASS);
  restartDotAnimation(dots[index]);
};

const setActiveSlideState = (swiper) => {
  const activeSlide = swiper.slides[swiper.activeIndex];

  if (!activeSlide) return;

  const activeImage = activeSlide.querySelector(SLIDE_IMAGE);
  const activeInfo = activeSlide.querySelector(SLIDE_INFO);

  if (activeImage) {
    activeImage.classList.add(ANIMATED_IMAGE_CLASS);
  }

  if (activeInfo) {
    activeInfo.classList.add(ACTIVE_INFO_CLASS);
  }
};

const bindDotsClickEvents = (dots, swiper) => {
  dots.forEach((dot, index) => {
    dot.addEventListener(`click`, () => {
      swiper.slideToLoop(index, SLIDE_TO_LOOP_SPEED);
    });
  });
};

const initHeroSlider = () => {
  const sliders = document.querySelectorAll(SLIDER);

  if (!sliders.length) return;

  sliders.forEach((slider) => {
    const dotsContainer = slider.parentElement.querySelector(DOTS_CONTAINER);

    if (!dotsContainer) return;

    const dots = dotsContainer.querySelectorAll(DOT);
    const images = slider.querySelectorAll(SLIDE_IMAGE);
    const infos = slider.querySelectorAll(SLIDE_INFO);

    if (!dots.length) return;

    const swiper = new Swiper(slider, {
      modules: [Autoplay],
      loop: true,
      speed: SLIDE_SPEED,
      autoplay: {
        delay: AUTOPLAY_DELAY,
        disableOnInteraction: false,
        pauseOnMouseEnter: false,
      },
      on: {
        init() {
          setActiveDot(dots, INITIAL_SLIDE_INDEX);
          setActiveSlideState(this);
        },

        slideChange() {
          setActiveDot(dots, this.realIndex);
          clearAnimatedImages(images);
          clearActiveInfos(infos);
        },

        slideChangeTransitionEnd() {
          setActiveSlideState(this);
        },
      },
    });

    bindDotsClickEvents(dots, swiper);
  });
};

export {
  initHeroSlider,
};