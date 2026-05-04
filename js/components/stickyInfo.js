const INFO = `.js-info`;
const ATTS = `.js-atts`;

const STICKY_ACTIVE_CLASS = `project-single__sticky`;

const TOP_OFFSET = 100;
const BOTTOM_OFFSET = 40;
const DESKTOP_WIDTH = 1024;

const initSmartSticky = () => {
  const infoBlocks = document.querySelectorAll(INFO);

  if (!infoBlocks.length) return;

  const updateSticky = () => {
    const isDesktop = window.innerWidth >= DESKTOP_WIDTH;
    const availableHeight = window.innerHeight - TOP_OFFSET - BOTTOM_OFFSET;

    infoBlocks.forEach(info => {
      const atts = info.querySelector(ATTS);

      info.classList.remove(STICKY_ACTIVE_CLASS);
      atts?.classList.remove(STICKY_ACTIVE_CLASS);

      if (!isDesktop) return;

      const infoHeight = info.scrollHeight;

      if (infoHeight <= availableHeight) {
        info.style.setProperty(`--sticky-top`, `${TOP_OFFSET}px`);
        info.classList.add(STICKY_ACTIVE_CLASS);

        return;
      }

      if (!atts) return;

      const attsHeight = atts.scrollHeight;

      if (attsHeight <= availableHeight) {
        atts.style.setProperty(`--sticky-top`, `${TOP_OFFSET}px`);
        atts.classList.add(STICKY_ACTIVE_CLASS);
      }
    });
  };

  updateSticky();

  window.addEventListener(`resize`, updateSticky);
};

export {
    initSmartSticky,
};