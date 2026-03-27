import '../scss/main.scss';
import.meta.glob(`../scss/components/*.scss`, { eager: true });

import {initHeroSlider} from './components/sliderHero';
import {initLineSlider} from './components/sliderLine';
import {initScrollAnimation} from './components/scrollAnimation';

document.addEventListener(`DOMContentLoaded`, () => {
  initHeroSlider();
  initLineSlider();
  initScrollAnimation();
});