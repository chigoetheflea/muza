const MENU_CONTROL = `.js-menu-control`;
const MENU = `.js-menu`;

const MENU_ACTIVE_CLASS = `menu__wrapper--active`;
const MENU_CONTROL_CLOSE_CLASS = `menu__control--close`;
const MENU_HEIGHT_CSS_VAR = `--menu-height`;

const setMenuHeight = (menu) => {
  if (!menu) return;

  menu.style.setProperty(MENU_HEIGHT_CSS_VAR, `${menu.scrollHeight}px`);
};

const openMenu = (menu, control) => {
  setMenuHeight(menu);

  menu.classList.add(MENU_ACTIVE_CLASS);
  
  control.classList.add(MENU_CONTROL_CLOSE_CLASS);
  control.setAttribute(`aria-expanded`, `true`);
};

const closeMenu = (menu, control) => {
  menu.classList.remove(MENU_ACTIVE_CLASS);

  control.classList.remove(MENU_CONTROL_CLOSE_CLASS);
  control.setAttribute(`aria-expanded`, `false`);
};

const toggleMenu = (menu, control) => {
  const isOpened = menu.classList.contains(MENU_ACTIVE_CLASS);

  if (isOpened) {
    closeMenu(menu, control);

    return;
  }

  openMenu(menu, control);
};

const initMenu = () => {
  const control = document.querySelector(MENU_CONTROL);
  const menu = document.querySelector(MENU);

  if (!control || !menu) return;

  setMenuHeight(menu);

  control.setAttribute(`aria-expanded`, `false`);

  control.addEventListener(`click`, (event) => {
    event.stopPropagation(); // важно

    toggleMenu(menu, control);
  });

  menu.addEventListener(`click`, (event) => {
    event.stopPropagation(); // чтобы клик внутри меню не закрывал его
  });

  document.addEventListener(`click`, (event) => {
    const isOpened = menu.classList.contains(MENU_ACTIVE_CLASS);

    if (!isOpened) return;

    const isClickInsideMenu = menu.contains(event.target);
    const isClickOnControl = control.contains(event.target);

    if (isClickInsideMenu || isClickOnControl) return;

    closeMenu(menu, control);
  });
};

export {
  initMenu,
};