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
const config = {
  baseUrl: "https://mesto.nomoreparties.co/v1/cohort-61", // замените 61 на номер вашей группы
  headers: {
    authorization: "6754474d-5b84-47e5-9e34-4ed66ebc5fbc",
    "Content-Type": "application/json",
  },
};

// ... остальной код без изменений
