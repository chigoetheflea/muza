import '../scss/main.scss';
import.meta.glob(`../scss/components/*.scss`, { eager: true });

import {initHeroSlider} from './components/sliderHero';
import {initLineSlider} from './components/sliderLine';
import {initScrollAnimation} from './components/scrollAnimation';
import {initMenu} from './components/menu';
import {initFilters} from './components/caseFilter';
import {initMap} from './components/map';
import {initForms} from './components/form';
import {initParallax} from './components/parallax';
import {initLoader} from './components/loader';
import {initSmartSticky} from './components/stickyInfo';
import {initTabs} from './components/tabs';

document.addEventListener(`DOMContentLoaded`, () => {
  initLoader();
  initHeroSlider();
  initLineSlider();
  initScrollAnimation();    
  initMenu();
  initFilters();
  initMap();
  initForms();
  initParallax();
  initSmartSticky();
  initTabs();
});