const COOKIE = `.js-cookie`;
const COOKIE_ACCEPT = `.js-cookie-accept`;

const COOKIE_NAME = `cookie_accepted`;
const COOKIE_VALUE = `yes`;
const COOKIE_EXPIRE_DAYS = 30;

const HIDDEN_ATTR = `hidden`;

const getCookie = (name) => {
  const cookies = document.cookie ? document.cookie.split(`; `) : [];

  const cookie = cookies.find((item) => item.startsWith(`${name}=`));

  if (!cookie) {
    return ``;
  }

  return decodeURIComponent(cookie.split(`=`)[1]);
};

const setCookie = (name, value, days) => {
  const date = new Date();

  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);

  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${date.toUTCString()}; path=/; SameSite=Lax`;
};

const initCookie = () => {
  const cookie = document.querySelector(COOKIE);

  if (!cookie) {
    return;
  }

  const acceptButton = cookie.querySelector(COOKIE_ACCEPT);

  if (getCookie(COOKIE_NAME) === COOKIE_VALUE) {
    return;
  }

  cookie.removeAttribute(HIDDEN_ATTR);

  if (!acceptButton) {
    return;
  }

  acceptButton.addEventListener(`click`, () => {
    setCookie(COOKIE_NAME, COOKIE_VALUE, COOKIE_EXPIRE_DAYS);

    cookie.setAttribute(HIDDEN_ATTR, ``);
  });
};

export {
  initCookie,
};