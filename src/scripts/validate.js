// validate.js
export const enableValidation = (config) => {
  const forms = document.querySelectorAll(config.formSelector);
  forms.forEach((form) => {
    const inputs = form.querySelectorAll(config.inputSelector);
    const button = form.querySelector(config.submitButtonSelector);
    inputs.forEach((input) => {
      input.addEventListener('input', () => {
        checkInputValidity(form, input, config);
        toggleButtonState(inputs, button, config);
      });
    });
  });
};

const checkInputValidity = (form, input, config) => { ... };
const toggleButtonState = (inputList, button, config) => { ... };
