import Swiper from 'swiper';
import { Autoplay, Navigation } from 'swiper/modules';

const SLIDER = `.js-slider-wide`;
const SLIDE_IMAGE = `.js-slider-wide-img`;
const SLIDE_INFO = `.js-slider-wide-info`;
const SLIDER_PREV = `.js-slider-prev`;
const SLIDER_NEXT = `.js-slider-next`;

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

const DEFAULT_SLIDE_COLOR = `#f0f0f0`;
const COLOR_SAMPLE_SIZE = 100;
const COLOR_BUCKET_SIZE = 24;
const EDGE_WIDTH = 10;

const getEdgeColor = (image) => {
  if (!image.naturalWidth || !image.naturalHeight) {
    return DEFAULT_SLIDE_COLOR;
  }

  const canvas = document.createElement(`canvas`);
  const context = canvas.getContext(`2d`, {
    willReadFrequently: true,
  });

  if (!context) return DEFAULT_SLIDE_COLOR;

  canvas.width = COLOR_SAMPLE_SIZE;
  canvas.height = COLOR_SAMPLE_SIZE;

  try {
    context.drawImage(image, 0, 0, canvas.width, canvas.height);

    const { data } = context.getImageData(
      0,
      0,
      canvas.width,
      canvas.height,
    );

    const colors = new Map();

    for (let y = 0; y < COLOR_SAMPLE_SIZE; y++) {
      for (let x = 0; x < COLOR_SAMPLE_SIZE; x++) {
        const isEdge =
          x < EDGE_WIDTH ||
          x >= COLOR_SAMPLE_SIZE - EDGE_WIDTH ||
          y < EDGE_WIDTH ||
          y >= COLOR_SAMPLE_SIZE - EDGE_WIDTH;

        if (!isEdge) continue;

        const i = (y * COLOR_SAMPLE_SIZE + x) * 4;

        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const a = data[i + 3];

        if (a < 128) continue;

        const key = [
          Math.floor(r / COLOR_BUCKET_SIZE),
          Math.floor(g / COLOR_BUCKET_SIZE),
          Math.floor(b / COLOR_BUCKET_SIZE),
        ].join(`,`);

        if (!colors.has(key)) {
          colors.set(key, {
            count: 0,
            r: 0,
            g: 0,
            b: 0,
          });
        }

        const color = colors.get(key);

        color.count++;
        color.r += r;
        color.g += g;
        color.b += b;
      }
    }

    let dominant = null;

    colors.forEach((color) => {
      if (!dominant || color.count > dominant.count) {
        dominant = color;
      }
    });

    if (!dominant) return DEFAULT_SLIDE_COLOR;

    const r = Math.round(dominant.r / dominant.count);
    const g = Math.round(dominant.g / dominant.count);
    const b = Math.round(dominant.b / dominant.count);

    return `rgb(${r}, ${g}, ${b})`;
  } catch (error) {
    return DEFAULT_SLIDE_COLOR;
  }
};

const setSlideBackgroundColors = (slider) => {
  const slides = slider.querySelectorAll(`.swiper-slide`);

  slides.forEach((slide) => {
    const image = slide.querySelector(SLIDE_IMAGE);

    if (!image) return;

    const applyColor = () => {
      slide.style.backgroundColor = getEdgeColor(image);
    };

    if (image.complete) {
      applyColor();
    } else {
      image.addEventListener(`load`, applyColor, { once: true });

      image.addEventListener(`error`, () => {
        slide.style.backgroundColor = DEFAULT_SLIDE_COLOR;
      }, { once: true });
    }
  });
};

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
    const prevButton = slider.querySelector(SLIDER_PREV);
    const nextButton = slider.querySelector(SLIDER_NEXT);

    if (!dots.length) return;

    setSlideBackgroundColors(slider);

    let previousSlideIndex = INITIAL_SLIDE_INDEX;

    const swiper = new Swiper(slider, {
      modules: [Autoplay, Navigation],
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
          if (this.realIndex === previousSlideIndex) return;

          previousSlideIndex = this.realIndex;

          setActiveDot(dots, this.realIndex);
          clearAnimatedImages(images);
          clearActiveInfos(infos);
        },

        slideChangeTransitionEnd() {
          setActiveSlideState(this);
        },

        resize() {
          clearAnimatedImages(images);
          clearActiveInfos(infos);
          setActiveSlideState(this);
        },
      },
      navigation: {
        prevEl: prevButton,
        nextEl: nextButton,
      },
    });

    bindDotsClickEvents(dots, swiper);
  });
};

export {
  initHeroSlider,
};