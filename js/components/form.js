const FORM = `.js-form`;
const FIELD = `.form__input`;
const STATUS = `.js-status`;
const AGREE = `.js-agree`;
const SUBMIT = `.js-submit`;
const RESULT = `.js-result`;

const FORM_URL = window.THEME?.mailer ?? ``;
const FORM_ACTION = `send_contact_form`;

const STATUS_ACTIVE_CLASS = `form__message--active`;
const STATUS_ERROR_CLASS = `form__message--error`;
const STATUS_SUCCESS_CLASS = `form__message--success`;

const SUBMIT_DISABLED_CLASS = `form__button--disabled`;
const SUBMIT_SENDING_CLASS = `form__button--sending`;

const RESULT_ACTIVE_CLASS = `form__result--active`;
const RESULT_ERROR_CLASS = `form__result--error`;
const RESULT_SUCCESS_CLASS = `form__result--success`;
const RESULT_SHOW_TIME = 3000;

const REQUIRED_ATTR = `data-required`;
const MASK_ATTR = `data-mask`;

const MASK_EMAIL = `email`;
const MASK_PHONE_TG = `phone-tg`;

const PHONE_MIN_DIGITS = 6;

let MESSAGE_REQUIRED = `Заполните поле`;
let MESSAGE_EMAIL = `Введите корректный email`;
let MESSAGE_PHONE_TG = `Введите телефон или @telegram`;
let MESSAGE_SUCCESS = `✓`;
let MESSAGE_FORM_SUCCESS = `Форма успешно отправлена`;
let MESSAGE_FORM_ERROR = `Не удалось отправить форму. Попробуйте позже`;
let MESSAGE_FORM_INVALID = `Проверьте заполнение формы`;
let MESSAGE_FORM_CONFIG_ERROR = `Не настроен адрес обработчика формы`;

const PHONE_TG_REGEXP = /^(?:\+?[0-9\s\-()]{6,20}|@[A-Za-z0-9_]{5,32})$/;
const EMAIL_REGEXP = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const getForms = () => document.querySelectorAll(FORM);

const getFieldWrapper = (field) => field.closest(`.form__field-wrapper`);

const getFieldStatus = (field) => {
    const fieldWrapper = getFieldWrapper(field);

    if (!fieldWrapper) {
        return null;
    }

    return fieldWrapper.querySelector(STATUS);
};

const clearStatus = (statusNode) => {
    if (!statusNode) {
        return;
    }

    statusNode.textContent = ``;
    statusNode.classList.remove(
        STATUS_ACTIVE_CLASS,
        STATUS_ERROR_CLASS,
        STATUS_SUCCESS_CLASS,
    );
};

const setStatus = (statusNode, message, isError = false) => {
    if (!statusNode) {
        return;
    }

    statusNode.textContent = message;
    statusNode.classList.add(STATUS_ACTIVE_CLASS);

    if (isError) {
        statusNode.classList.remove(STATUS_SUCCESS_CLASS);
        statusNode.classList.add(STATUS_ERROR_CLASS);

        return;
    }

    statusNode.classList.remove(STATUS_ERROR_CLASS);
    statusNode.classList.add(STATUS_SUCCESS_CLASS);
};

const changeTranslate = () => {
    MESSAGE_REQUIRED = `Fill the field`;
    MESSAGE_EMAIL = `Enter correct email`;
    MESSAGE_PHONE_TG = `Enter your phone number or @telegram`;
    MESSAGE_SUCCESS = `✓`;
    MESSAGE_FORM_SUCCESS = `The form has been successfully submitted`;
    MESSAGE_FORM_ERROR = `The form could not be submitted. Try again later`;
    MESSAGE_FORM_INVALID = `Check the form completion`;
    MESSAGE_FORM_CONFIG_ERROR = `The form handler address is not configured`;
};

const normalizeValue = (value) => (value || ``).trim();

const isRequiredField = (field) => field.hasAttribute(REQUIRED_ATTR);

const getMaskType = (field) => field.getAttribute(MASK_ATTR);

const validateMask = (value, maskType) => {
    if (!maskType || !value) {
        return true;
    }

    if (maskType === MASK_EMAIL) {
        return EMAIL_REGEXP.test(value);
    }

    if (maskType === MASK_PHONE_TG) {
        if (value.startsWith(`@`)) {
            return PHONE_TG_REGEXP.test(value);
        }

        const digits = value.replace(/\D/g, ``);

        if (digits.length < PHONE_MIN_DIGITS) {
            return false;
        }

        return PHONE_TG_REGEXP.test(value);
    }

    return true;
};

const getMaskErrorMessage = (maskType) => {
    if (maskType === MASK_EMAIL) {
        return MESSAGE_EMAIL;
    }

    if (maskType === MASK_PHONE_TG) {
        return MESSAGE_PHONE_TG;
    }

    return MESSAGE_REQUIRED;
};

const validateField = (field, showSuccess = false) => {
    const value = normalizeValue(field.value);
    const statusNode = getFieldStatus(field);
    const maskType = getMaskType(field);

    clearStatus(statusNode);

    if (isRequiredField(field) && !value) {
        setStatus(statusNode, MESSAGE_REQUIRED, true);

        return false;
    }

    if (!validateMask(value, maskType)) {
        setStatus(statusNode, getMaskErrorMessage(maskType), true);

        return false;
    }

    if (showSuccess && value) {
        setStatus(statusNode, MESSAGE_SUCCESS, false);
    }

    return true;
};

const validateForm = (form, showSuccess = false) => {
    const fields = form.querySelectorAll(FIELD);

    return [...fields].every((field) => validateField(field, showSuccess));
};

const getAgreeContainer = (form) => form.querySelector(AGREE);

const getAgreeCheckboxes = (form) => {
    const agreeContainer = getAgreeContainer(form);

    if (!agreeContainer) {
        return [];
    }

    return agreeContainer.querySelectorAll(`input[type="checkbox"]`);
};

const isAgreeAccepted = (form) => {
    const checkboxes = getAgreeCheckboxes(form);

    if (!checkboxes.length) {
        return true;
    }

    return [...checkboxes].every((checkbox) => checkbox.checked);
};

const getSubmitButton = (form) => form.querySelector(SUBMIT);

const updateSubmitState = (form) => {
    const submitButton = getSubmitButton(form);
    const isAllowed = isAgreeAccepted(form);

    if (!submitButton) {
        return;
    }

    submitButton.disabled = !isAllowed;
    submitButton.classList.toggle(SUBMIT_DISABLED_CLASS, !isAllowed);
};

const getResultNode = (form) => form.querySelector(RESULT);

const clearResult = (form) => {
    const resultNode = getResultNode(form);

    if (!resultNode) {
        return;
    }

    resultNode.textContent = ``;
    resultNode.classList.remove(
        RESULT_ACTIVE_CLASS,
        RESULT_ERROR_CLASS,
        RESULT_SUCCESS_CLASS,
    );
};

const setResult = (form, message, isError = false) => {
    const resultNode = getResultNode(form);

    if (!resultNode) {
        return;
    }

    resultNode.textContent = message;
    resultNode.classList.add(RESULT_ACTIVE_CLASS);

    if (isError) {
        resultNode.classList.remove(RESULT_SUCCESS_CLASS);
        resultNode.classList.add(RESULT_ERROR_CLASS);

        return;
    }

    resultNode.classList.remove(RESULT_ERROR_CLASS);
    resultNode.classList.add(RESULT_SUCCESS_CLASS);

    setTimeout(() => {
        resultNode.classList.remove(
            RESULT_ACTIVE_CLASS,
            RESULT_SUCCESS_CLASS,
            RESULT_ERROR_CLASS,
        );
        resultNode.textContent = ``;
    }, RESULT_SHOW_TIME);
};

const setSubmitSending = (form, isSending) => {
    const submitButton = getSubmitButton(form);

    if (!submitButton) {
        return;
    }

    submitButton.classList.toggle(SUBMIT_SENDING_CLASS, isSending);
};

const clearFormStatuses = (form) => {
    const fields = form.querySelectorAll(FIELD);

    fields.forEach((field) => {
        clearStatus(getFieldStatus(field));
    });
};

const applyServerFieldErrors = (form, errors = {}) => {
    const fields = form.querySelectorAll(FIELD);

    fields.forEach((field) => {
        const fieldName = field.getAttribute(`name`);
        const statusNode = getFieldStatus(field);

        if (!fieldName || !errors[fieldName]) {
            return;
        }

        setStatus(statusNode, errors[fieldName], true);
    });
};

const getFormData = (form) => {
    const formData = new FormData(form);

    formData.append(`action`, FORM_ACTION);

    return formData;
};

const parseJsonSafely = (text) => {
    try {
        return JSON.parse(text);
    } catch (error) {
        return null;
    }
};

const logFormData = (formData) => {
    for (const [key, value] of formData.entries()) {
        console.log(`FormData: ${key} =`, value);
    }
};

const sendForm = (form) => new Promise((resolve, reject) => {
    if (!FORM_URL) {
        reject(new Error(MESSAGE_FORM_CONFIG_ERROR));
        return;
    }

    const formData = getFormData(form);
    const xhr = new XMLHttpRequest();

    logFormData(formData);

    xhr.open(`POST`, FORM_URL, true);
    xhr.setRequestHeader(`X-Requested-With`, `XMLHttpRequest`);
    xhr.timeout = 15000;

    xhr.onload = () => {
        const responseText = xhr.responseText;
        const responseJson = parseJsonSafely(responseText);

        console.log(`Form request status:`, xhr.status);
        console.log(`Form response text:`, responseText);
        console.log(`Form response json:`, responseJson);

        if (xhr.status < 200 || xhr.status >= 300) {
            reject({
                message: responseJson?.message || `Request failed with status ${xhr.status}`,
                errors: responseJson?.errors || null,
            });
            return;
        }

        if (!responseJson) {
            reject({
                message: `Сервер вернул не JSON`,
                errors: null,
            });
            return;
        }

        if (responseJson.success !== true) {
            reject({
                message: responseJson.message || MESSAGE_FORM_ERROR,
                errors: responseJson.errors || null,
            });
            return;
        }

        resolve(responseJson);
    };

    xhr.onerror = () => {
        reject({
            message: MESSAGE_FORM_ERROR,
            errors: null,
        });
    };

    xhr.ontimeout = () => {
        reject({
            message: `Сервер не ответил вовремя`,
            errors: null,
        });
    };

    xhr.send(formData);
});

const handleFieldInput = (event) => {
    const field = event.target;

    if (!field.matches(FIELD)) {
        return;
    }

    validateField(field, false);
};

const handleFieldBlur = (event) => {
    const field = event.target;

    if (!field.matches(FIELD)) {
        return;
    }

    validateField(field, true);
};

const handleAgreeChange = (form) => {
    updateSubmitState(form);
};

const handleSubmit = async (event) => {
    event.preventDefault();

    const form = event.currentTarget;
    const submitButton = getSubmitButton(form);

    clearResult(form);

    if (submitButton && submitButton.disabled) {
        return;
    }

    if (!isAgreeAccepted(form)) {
        updateSubmitState(form);
        return;
    }

    const isValid = validateForm(form, true);

    if (!isValid) {
        setResult(form, MESSAGE_FORM_INVALID, true);
        return;
    }

    try {
        if (submitButton) {
            submitButton.disabled = true;
        }

        setSubmitSending(form, true);

        const response = await sendForm(form);

        console.log(`Form success:`, response);

        setResult(form, response.message || MESSAGE_FORM_SUCCESS, false);
        form.reset();
        clearFormStatuses(form);
    } catch (error) {
        console.error(`Form error:`, error);

        if (error?.errors) {
            applyServerFieldErrors(form, error.errors);
        }

        setResult(form, error?.message || MESSAGE_FORM_ERROR, true);
    } finally {
        setSubmitSending(form, false);
        updateSubmitState(form);
    }
};

const initSingleForm = (form) => {
    const agreeCheckboxes = getAgreeCheckboxes(form);
    const isEnglish = form.dataset.lang === `en`;

    if (isEnglish) {
        changeTranslate();
    }

    updateSubmitState(form);
    clearResult(form);

    form.addEventListener(`input`, handleFieldInput);
    form.addEventListener(`focusout`, handleFieldBlur);
    form.addEventListener(`submit`, handleSubmit);

    agreeCheckboxes.forEach((checkbox) => {
        checkbox.addEventListener(`change`, () => handleAgreeChange(form));
    });
};

const initForms = () => {
    const forms = getForms();

    if (!forms.length) {
        return;
    }

    console.log(`THEME:`, window.THEME);
    console.log(`FORM_URL:`, FORM_URL);

    forms.forEach((form) => {
        initSingleForm(form);
    });
};

export {
    initForms,
};