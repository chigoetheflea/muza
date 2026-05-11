const IMAGE_FIELD = `.js-muza-image-field`;
const IMAGE_ID = `.js-muza-image-id`;
const IMAGE_PREVIEW = `.js-muza-image-preview`;
const IMAGE_UPLOAD = `.js-muza-image-upload`;
const IMAGE_REMOVE = `.js-muza-image-remove`;

const MEDIUM_SIZE = `medium`;

const renderImage = (imageUrl) => `
  <img
    src="${imageUrl}"
    alt=""
    style="display:block;max-width:240px;height:auto;margin-bottom:12px;"
  >
`;

const onDocumentClick = (evt) => {
  const uploadButton = evt.target.closest(IMAGE_UPLOAD);
  const removeButton = evt.target.closest(IMAGE_REMOVE);

  if (uploadButton) {
    const field = uploadButton.closest(IMAGE_FIELD);

    if (!field || !window.wp?.media) {
      return;
    }

    const input = field.querySelector(IMAGE_ID);
    const preview = field.querySelector(IMAGE_PREVIEW);
    const remove = field.querySelector(IMAGE_REMOVE);

    const frame = window.wp.media({
      title: `Выберите изображение`,
      button: {
        text: `Использовать изображение`,
      },
      multiple: false,
    });

    frame.on(`select`, () => {
      const attachment = frame.state().get(`selection`).first().toJSON();
      const imageUrl = attachment.sizes?.[MEDIUM_SIZE]?.url || attachment.url;

      input.value = attachment.id;
      preview.innerHTML = renderImage(imageUrl);

      if (remove) {
        remove.style.display = ``;
      }
    });

    frame.open();

    return;
  }

  if (removeButton) {
    const field = removeButton.closest(IMAGE_FIELD);

    if (!field) {
      return;
    }

    const input = field.querySelector(IMAGE_ID);
    const preview = field.querySelector(IMAGE_PREVIEW);

    input.value = ``;
    preview.innerHTML = ``;
    removeButton.style.display = `none`;
  }
};

const initAdminImageField = () => {
  if (!document.querySelector(IMAGE_FIELD)) {
    return;
  }

  document.addEventListener(`click`, onDocumentClick);
};

export {
  initAdminImageField,
};