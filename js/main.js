import '../scss/main.scss';
import.meta.glob(`../scss/components/*.scss`, { eager: true });

import {initHeroSlider} from './components/sliderHero';
import {initLineSlider} from './components/sliderLine';
import {initScrollAnimation} from './components/scrollAnimation';
import {initMenu} from './components/menu';
import {initFilters} from './components/caseFilter';
import {initMap} from './components/map';
import {initForms} from './components/form';

document.addEventListener(`DOMContentLoaded`, () => {
  initHeroSlider();
  initLineSlider();
  initScrollAnimation();    
  initMenu();
  initFilters();
  initMap();
  initForms();
});