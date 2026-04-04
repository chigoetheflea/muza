const FORM = `.js-form`;
const FIELD = `.form__input`;
const STATUS = `.js-status`;
const AGREE = `.js-agree`;
const SUBMIT = `.js-submit`;
const RESULT = `.js-result`;

const FORM_URL = ``;

const STATUS_ACTIVE_CLASS = `form__message--active`;
const STATUS_ERROR_CLASS = `form__message--error`;
const STATUS_SUCCESS_CLASS = `form__message--success`;

const SUBMIT_DISABLED_CLASS = `form__button--disabled`;

const RESULT_ACTIVE_CLASS = `form__result--active`;
const RESULT_ERROR_CLASS = `form__result--error`;
const RESULT_SUCCESS_CLASS = `form__result--success`;
const RESULT_SHOW_TIME = 3000;

const REQUIRED_ATTR = `data-required`;
const MASK_ATTR = `data-mask`;

const MASK_EMAIL = `email`;
const MASK_PHONE_TG = `phone-tg`;

const PHONE_MIN_DIGITS = 6;

const MESSAGE_REQUIRED = `Заполните поле`;
const MESSAGE_EMAIL = `Введите корректный email`;
const MESSAGE_PHONE_TG = `Введите телефон или @telegram`;
const MESSAGE_SUCCESS = `✓`;
const MESSAGE_FORM_SUCCESS = `Форма успешно отправлена`;
const MESSAGE_FORM_ERROR = `Не удалось отправить форму. Попробуйте позже`;
const MESSAGE_FORM_INVALID = `Проверьте заполнение формы`;

const SUBMIT_SENDING_CLASS = `form_button--sending`;

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
        // telegram
        if (value.startsWith(`@`)) {
            return PHONE_TG_REGEXP.test(value);
        }

        // телефон → считаем только цифры
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
        resultNode.classList.remove(RESULT_SUCCESS_CLASS);
        resultNode.classList.remove(RESULT_ACTIVE_CLASS);
        resultNode.innerText = ``;
    },
    RESULT_SHOW_TIME);
};

const setSubmitSending = (form, isSending) => {
    const submitButton = getSubmitButton(form);

    if (!submitButton) {
        return;
    }

    submitButton.classList.toggle(SUBMIT_SENDING_CLASS, isSending);
};

const getFormData = (form) => new FormData(form);

const sendForm = (form) => new Promise((resolve, reject) => {
    const formData = getFormData(form);
    const xhr = new XMLHttpRequest();

    xhr.open(`POST`, FORM_URL, true);

    xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
            resolve(xhr.responseText);

            return;
        }

        reject(new Error(`Request failed with status ${xhr.status}`));
    };

    xhr.onerror = () => {
        reject(new Error(`Network error`));
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

        await sendForm(form);

        setResult(form, MESSAGE_FORM_SUCCESS, false);
        form.reset();

        const fields = form.querySelectorAll(FIELD);

        fields.forEach((field) => {
            const statusNode = getFieldStatus(field);

            clearStatus(statusNode);
        });
    } catch (error) {
        setResult(form, MESSAGE_FORM_ERROR, true);
    } finally {
        setSubmitSending(form, false);
        updateSubmitState(form);
    }
};

const initSingleForm = (form) => {
    const agreeCheckboxes = getAgreeCheckboxes(form);

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

    forms.forEach((form) => {
        initSingleForm(form);
    });
};

export {
    initForms,
};