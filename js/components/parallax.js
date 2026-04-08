const PARALLAX = `.js-animated-bg`;
const IMAGE_SELECTOR = `img`;

const SPEED = 0.2;
const OFFSET_START = 0;
const AXIS = `y`;

const AXIS_Y = `y`;
const TRANSFORM_Y = (shift) => `translate3d(0, ${shift}px, 0)`;
const TRANSFORM_X = (shift) => `translate3d(${shift}px, 0, 0)`;

const getShift = (scrollTop, elementTop) => {
    return ((scrollTop - elementTop) * SPEED) + OFFSET_START;
};

const isVisible = (rect, viewportHeight) => {
    return rect.bottom > 0 && rect.top < viewportHeight;
};

const setTransform = (image, shift) => {
    image.style.transform = AXIS === AXIS_Y
        ? TRANSFORM_Y(shift)
        : TRANSFORM_X(shift);
};

const createParallaxItem = (container) => {
    const image = container.querySelector(IMAGE_SELECTOR);

    if (!image) {
        return null;
    }

    return {
        container,
        image,
    };
};

const initParallax = () => {
    const containers = document.querySelectorAll(PARALLAX);

    if (!containers.length) {
        return;
    }

    const items = Array.from(containers)
        .map(createParallaxItem)
        .filter(Boolean);

    if (!items.length) {
        return;
    }

    let isTicking = false;

    const updateParallax = () => {
        const scrollTop = window.scrollY;
        const viewportHeight = window.innerHeight;

        items.forEach(({ container, image }) => {
            const rect = container.getBoundingClientRect();

            if (!isVisible(rect, viewportHeight)) {
                return;
            }

            const elementTop = rect.top + scrollTop;
            const shift = getShift(scrollTop, elementTop);

            setTransform(image, shift);
        });

        isTicking = false;
    };

    const requestUpdate = () => {
        if (isTicking) {
            return;
        }

        isTicking = true;
        requestAnimationFrame(updateParallax);
    };

    window.addEventListener(`scroll`, requestUpdate, { passive: true });
    window.addEventListener(`resize`, requestUpdate);

    window.addEventListener(`load`, requestUpdate);

    requestUpdate();
};

export {
    initParallax,
};