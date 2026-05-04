const TABS = `.js-tabs`;
const TABS_BUTTON = `.js-tabs-button`;
const TABS_CONTENT = `.js-tabs-content`;

const TAB_TARGET_ATTR = `data-tab-target`;
const TAB_CONTENT_ATTR = `data-tab-content`;

const BUTTON_ACTIVE_CLASS = `tabs__button--active`;
const CONTENT_ACTIVE_CLASS = `tabs__content--active`;

const initTabs = () => {
    const tabsList = document.querySelectorAll(TABS);

    if (!tabsList.length) return;

    tabsList.forEach(tabs => {
        const buttons = tabs.querySelectorAll(TABS_BUTTON);
        const contents = tabs.querySelectorAll(TABS_CONTENT);

        if (!buttons.length || !contents.length) return;

        buttons.forEach(button => {
            button.addEventListener(`click`, () => {
                const target = button.getAttribute(TAB_TARGET_ATTR);

                if (!target) return;

                const targetContent = tabs.querySelector(
                    `[${TAB_CONTENT_ATTR}="${target}"]`
                );

                if (!targetContent) return;

                buttons.forEach(currentButton => {
                    currentButton.classList.remove(BUTTON_ACTIVE_CLASS);
                });

                contents.forEach(content => {
                    content.classList.remove(CONTENT_ACTIVE_CLASS);
                });

                button.classList.add(BUTTON_ACTIVE_CLASS);
                targetContent.classList.add(CONTENT_ACTIVE_CLASS);
            });
        });
    });
};

export {
    initTabs,
};