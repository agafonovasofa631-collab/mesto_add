/*
  Файл index.js является точкой входа в наше приложение
  и только он должен содержать логику инициализации нашего приложения
  используя при этом импорты из других файлов

  Из index.js не допускается что то экспортировать
*/

import { initialCards } from "./cards.js";
import { getCards, getUserInfo } from "./components/api.js";   // если у вас есть API-функции, или создайте их
import { openModalWindow, closeModalWindow, setCloseModalWindowEventListeners } from "./components/modal.js"; // уже есть, но убедитесь

import { createCardElement, deleteCard, likeCard } from "./components/card.js";
import { openModalWindow, closeModalWindow, setCloseModalWindowEventListeners } from "./components/modal.js";

// DOM узлы
const placesWrap = document.querySelector(".places__list");
const profileFormModalWindow = document.querySelector(".popup_type_edit");
const profileForm = profileFormModalWindow.querySelector(".popup__form");
const profileTitleInput = profileForm.querySelector(".popup__input_type_name");
const profileDescriptionInput = profileForm.querySelector(".popup__input_type_description");

const cardFormModalWindow = document.querySelector(".popup_type_new-card");
const cardForm = cardFormModalWindow.querySelector(".popup__form");
const cardNameInput = cardForm.querySelector(".popup__input_type_card-name");
const cardLinkInput = cardForm.querySelector(".popup__input_type_url");

const imageModalWindow = document.querySelector(".popup_type_image");
const imageElement = imageModalWindow.querySelector(".popup__image");
const imageCaption = imageModalWindow.querySelector(".popup__caption");

const openProfileFormButton = document.querySelector(".profile__edit-button");
const openCardFormButton = document.querySelector(".profile__add-button");

const profileTitle = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");
const profileAvatar = document.querySelector(".profile__image");

const avatarFormModalWindow = document.querySelector(".popup_type_edit-avatar");
const avatarForm = avatarFormModalWindow.querySelector(".popup__form");
const avatarInput = avatarForm.querySelector(".popup__input");
const infoModalWindow = document.querySelector(".popup_type_info");
const infoDefinitionList = document.querySelector(".popup-info__definition-list");
const infoUsersList = document.querySelector(".popup-info__users-list");
const infoDefinitionTemplate = document.querySelector("#popup-info-definition-template").content;
const infoUserTemplate = document.querySelector("#popup-info-user-preview-template").content;

const handlePreviewPicture = ({ name, link }) => {
  imageElement.src = link;
  imageElement.alt = name;
  imageCaption.textContent = name;
  openModalWindow(imageModalWindow);
};

const handleProfileFormSubmit = (evt) => {
  evt.preventDefault();
  profileTitle.textContent = profileTitleInput.value;
  profileDescription.textContent = profileDescriptionInput.value;
  closeModalWindow(profileFormModalWindow);
};

const handleAvatarFromSubmit = (evt) => {
  evt.preventDefault();
  profileAvatar.style.backgroundImage = `url(${avatarInput.value})`;
  closeModalWindow(avatarFormModalWindow);
};

const handleCardFormSubmit = (evt) => {
  evt.preventDefault();
  placesWrap.prepend(
    createCardElement(
      {
        name: cardNameInput.value,
        link: cardLinkInput.value,
      },
      {
        onPreviewPicture: handlePreviewPicture,
        onLikeIcon: likeCard,
        onDeleteCard: deleteCard,
      }
    )
  );

  closeModalWindow(cardFormModalWindow);
};

// EventListeners
profileForm.addEventListener("submit", handleProfileFormSubmit);
cardForm.addEventListener("submit", handleCardFormSubmit);
avatarForm.addEventListener("submit", handleAvatarFromSubmit);

openProfileFormButton.addEventListener("click", () => {
  profileTitleInput.value = profileTitle.textContent;
  profileDescriptionInput.value = profileDescription.textContent;
  openModalWindow(profileFormModalWindow);
});

profileAvatar.addEventListener("click", () => {
  avatarForm.reset();
  openModalWindow(avatarFormModalWindow);
});

openCardFormButton.addEventListener("click", () => {
  cardForm.reset();
  openModalWindow(cardFormModalWindow);
});

// отображение карточек
// Загружаем карточки с сервера
getCards()
  .then((cards) => {
    cards.forEach((card) => {
      placesWrap.append(
        createCardElement(card, {
          onPreviewPicture: handlePreviewPicture,
          onLikeIcon: likeCard,
          onDeleteCard: deleteCard,
          onInfoClick: handleInfoClick,
        })
      );
    });
  })
  .catch((err) => console.error("Ошибка загрузки карточек:", err));

//настраиваем обработчики закрытия попапов
const allPopups = document.querySelectorAll(".popup");
allPopups.forEach((popup) => {
  setCloseModalWindowEventListeners(popup);
});

// Модальное окно статистики
const infoModalWindow = document.querySelector(".popup_type_info");
const infoDefinitionList = document.querySelector(".popup-info__definition-list");
const infoUsersList = document.querySelector(".popup-info__users-list");
const infoDefinitionTemplate = document.querySelector("#popup-info-definition-template").content;
const infoUserTemplate = document.querySelector("#popup-info-user-preview-template").content;
// Форматирование даты
const formatDate = (date) =>
  date.toLocaleDateString("ru-RU", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

// Создание строки "термин: значение"
const createInfoString = (label, value) => {
  const element = infoDefinitionTemplate.cloneNode(true);
  element.querySelector(".popup__info-term").textContent = label;
  element.querySelector(".popup__info-description").textContent = value;
  return element;
};

// Создание элемента пользователя
const createUserPreview = (user) => {
  const element = infoUserTemplate.cloneNode(true);
  const avatar = element.querySelector(".popup-info__user-avatar");
  const nameSpan = element.querySelector(".popup-info__user-name");
  avatar.src = user.avatar || "./src/images/avatar.jpg";
  avatar.alt = user.name;
  nameSpan.textContent = user.name;
  return element;
};
const handleInfoClick = (cardId) => {
  // Получаем актуальный список карточек с сервера
  getCards()   // предполагается, что у вас есть такая функция, возвращающая Promise
    .then((cards) => {
      const cardData = cards.find(card => card._id === cardId);
      if (!cardData) throw new Error("Карточка не найдена");

      // Очищаем контейнеры
      infoDefinitionList.innerHTML = "";
      infoUsersList.innerHTML = "";

      // Заполняем основную информацию
      infoDefinitionList.append(
        createInfoString("Название:", cardData.name),
        createInfoString("Дата создания:", formatDate(new Date(cardData.createdAt))),
        createInfoString("Количество лайков:", cardData.likes.length.toString())
      );

      // Заполняем список лайкнувших пользователей
      cardData.likes.forEach(user => {
        infoUsersList.append(createUserPreview(user));
      });

      openModalWindow(infoModalWindow);
    })
    .catch((err) => console.error("Ошибка загрузки статистики:", err));
};
const formatDate = (date) =>
  date.toLocaleDateString("ru-RU", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

const createInfoString = (label, value) => {
  const element = infoDefinitionTemplate.cloneNode(true);
  element.querySelector(".popup__info-term").textContent = label;
  element.querySelector(".popup__info-description").textContent = value;
  return element;
};

const createUserPreview = (user) => {
  const element = infoUserTemplate.cloneNode(true);
  const avatar = element.querySelector(".popup-info__user-avatar");
  const nameSpan = element.querySelector(".popup-info__user-name");
  avatar.src = user.avatar || "./src/images/avatar.jpg";
  avatar.alt = user.name;
  nameSpan.textContent = user.name;
  return element;
};