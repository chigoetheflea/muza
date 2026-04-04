const MAP = `map`;
const MAP_HINT = ``;
const MAP_BALLOON_CONTENT = ``;
const ZOOM = 17;
const MARKER_URL = `./public/images/marker.svg`;
const COORDS = [55.779172, 37.581128];

const CurrentMarkerSize = {
    width: 60,
    height: 82,
};

const MAP_FILTER = `grayscale(1)`;

const applyMapStyles = (map) => {
    const mapContainer = map.container.getElement();

    if (!mapContainer) {
        return;
    }

    const apply = () => {
        const groundPane = mapContainer.querySelector(`[class*="ground-pane"]`);
        const placesPane = mapContainer.querySelector(`[class*="places-pane"]`);

        if (groundPane) {
            groundPane.style.filter = MAP_FILTER;

            groundPane.style.webkitFilter = MAP_FILTER;
        }

        // На всякий случай явно убираем фильтр с маркеров
        if (placesPane) {
            placesPane.style.filter = `none`;

            placesPane.style.webkitFilter = `none`;
        }
    };

    apply();

    setTimeout(apply, 150);
    setTimeout(apply, 400);
    setTimeout(apply, 800);

    map.events.add(`boundschange`, () => {
        setTimeout(apply, 50);
        
        setTimeout(apply, 200);
    });

    const observer = new MutationObserver(() => {
        apply();
    });

    observer.observe(mapContainer, {
        childList: true,
        subtree: true,
        attributes: true,
    });
};

const initMap = () => {
    const mapContainer = document.querySelector(`#${MAP}`);

    if (mapContainer) {
        ymaps.ready(() => {
            const map = new ymaps.Map(
                MAP,
                {
                    center: COORDS,
                    zoom: ZOOM,
                    controls: [],
                },
                {
                    suppressMapOpenBlock: true,
                    yandexMapDisablePoiInteractivity: true,
                }
            );

            const zoomControl = new ymaps.control.ZoomControl({
                options: {
                    size: `small`,
                    position: {
                        right: 20,
                        bottom: 40,
                    },
                },
            });

            map.controls.add(zoomControl);

            const marker = new ymaps.Placemark(
                COORDS,
                {
                    hintContent: MAP_HINT,
                    balloonContent: MAP_BALLOON_CONTENT,
                },
                {
                    iconLayout: `default#image`,
                    iconImageHref: MARKER_URL,
                    iconImageSize: [CurrentMarkerSize.width, CurrentMarkerSize.height],
                    iconImageOffset: [
                        -1 * CurrentMarkerSize.width / 2,
                        -1 * CurrentMarkerSize.height,
                    ],
                }
            );

            map.behaviors.disable(`scrollZoom`);
            map.geoObjects.add(marker);

            applyMapStyles(map);
        });
    }
};

export {
    initMap,
};