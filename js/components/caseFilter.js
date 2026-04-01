const FILTERS = `.js-filters`;
const CASES = `.js-cases`;
const NO_POSTS = `.js-no-posts`;

const FILTER_BUTTON = `[data-filter]`;
const CASE_CARD = `[data-category]`;

const FILTERS_ACTIVE_CLASS = `filters__button--active`;
const CASE_HIDDEN_CLASS = `project-card--hidden`;
const CASE_FADE_IN_CLASS = `project-card--fade-in`;
const NO_POSTS_FADE_IN_CLASS = `no-posts--fade-in`;

const FILTER_ALL = `all`;

const CATEGORY_SEPARATOR = ` `;
const ZERO_DELAY = `0ms`;

const DELAY_STEP = 100;

const setActiveButton = (buttons, activeButton) => {
    buttons.forEach((button) => {
        button.classList.toggle(FILTERS_ACTIVE_CLASS, button === activeButton);
    });
};

const getCardCategories = (card) => {
    return (card.dataset.category || ``)
        .split(CATEGORY_SEPARATOR)
        .map((category) => category.trim())
        .filter(Boolean);
};

const resetCardAnimation = (card) => {
    card.classList.remove(CASE_FADE_IN_CLASS);
    card.style.animationDelay = ZERO_DELAY;
};

const restartCardAnimation = (card, delay) => {
    card.classList.remove(CASE_FADE_IN_CLASS);
    card.style.animationDelay = ZERO_DELAY;

    void card.offsetWidth;

    card.style.animationDelay = `${delay}ms`;
    card.classList.add(CASE_FADE_IN_CLASS);
};

const showNoPosts = (el) => {
    if (!el) return;

    el.classList.remove(NO_POSTS_FADE_IN_CLASS);

    void el.offsetWidth;

    el.classList.add(NO_POSTS_FADE_IN_CLASS);
};

const hideNoPosts = (el) => {
    if (!el) return;

    el.classList.remove(NO_POSTS_FADE_IN_CLASS);
};

const filterCases = (cards, filterValue, noPostsElement) => {
    const visibleCards = [];

    cards.forEach((card) => {
        resetCardAnimation(card);

        const categories = getCardCategories(card);
        const isVisible = filterValue === FILTER_ALL || categories.includes(filterValue);

        if (isVisible) {
            card.classList.remove(CASE_HIDDEN_CLASS);
            visibleCards.push(card);

            return;
        }

        card.classList.add(CASE_HIDDEN_CLASS);
    });

    if (!visibleCards.length) {
        showNoPosts(noPostsElement);
        
        return;
    }

    hideNoPosts(noPostsElement);

    visibleCards.forEach((card, index) => {
        restartCardAnimation(card, index * DELAY_STEP);
    });
};

const initFilters = () => {
    const filtersContainer = document.querySelector(FILTERS);
    const casesContainer = document.querySelector(CASES);

    if (!(filtersContainer && casesContainer)) return;

    const noPostsElement = document.querySelector(NO_POSTS);

    const filterButtons = Array.from(
        filtersContainer.querySelectorAll(FILTER_BUTTON),
    );

    const cards = Array.from(
        casesContainer.querySelectorAll(CASE_CARD),
    );

    if (!filterButtons.length) return;

    const activeButton =
        filtersContainer.querySelector(`.${FILTERS_ACTIVE_CLASS}`) || filterButtons[0];

    if (activeButton) {
        setActiveButton(filterButtons, activeButton);
        filterCases(cards, activeButton.dataset.filter, noPostsElement);
    }

    filtersContainer.addEventListener(`click`, (event) => {
        const button = event.target.closest(FILTER_BUTTON);

        if (!button || !filtersContainer.contains(button)) return;

        event.preventDefault();

        if (button.classList.contains(FILTERS_ACTIVE_CLASS)) return;

        setActiveButton(filterButtons, button);
        filterCases(cards, button.dataset.filter, noPostsElement);
    });
};

export {
    initFilters,
};