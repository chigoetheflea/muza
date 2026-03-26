import '../scss/main.scss';
import.meta.glob(`../scss/components/*.scss`, { eager: true });

import {initHeroSlider} from './components/sliderHero';

document.addEventListener(`DOMContentLoaded`, () => {
  initHeroSlider();
});