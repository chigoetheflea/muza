const LOADING = `.js-loading`;
const LOADING_HIDDEN_CLASS = `loading--hidden`;

const initLoader = () => {
    setTimeout(() => {
        document.querySelector(LOADING).classList.add(LOADING_HIDDEN_CLASS);
    }, 300);
};

export {
    initLoader,
}