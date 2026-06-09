export const openModalWindow = (popup) => {
  popup.classList.add("popup_is-opened");
  document.addEventListener("keydown", closeByEscape);
};

export const closeModalWindow = (popup) => {
  popup.classList.remove("popup_is-opened");
  document.removeEventListener("keydown", closeByEscape);
};

const closeByEscape = (evt) => {
  if (evt.key === "Escape") {
    const openedPopup = document.querySelector(".popup_is-opened");
    if (openedPopup) closeModalWindow(openedPopup);
  }
};

export const setCloseModalWindowEventListeners = (popup) => {
  const closeButton = popup.querySelector(".popup__close");
  closeButton.addEventListener("click", () => closeModalWindow(popup));
  popup.addEventListener("click", (evt) => {
    if (evt.target === popup) closeModalWindow(popup);
  });
};