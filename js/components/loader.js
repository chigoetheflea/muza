const LOADING = `.js-loading`;
const LOADING_HIDDEN_CLASS = `loading--hidden`;
const LOADING_HIDE_DELAY = 300;

const initLoader = () => {
    const loader = document.querySelector(LOADING);

    if (!loader) {
        return;
    }

    setTimeout(() => {
        loader.classList.add(LOADING_HIDDEN_CLASS);
        
        console.log(`Loaded`);
    }, LOADING_HIDE_DELAY);
};

export {
    initLoader,
};