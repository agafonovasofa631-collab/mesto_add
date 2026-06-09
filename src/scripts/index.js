import { getCurrentUser, getCards, addCard, updateUser, updateAvatar, deleteCardApi, likeCardApi, unlikeCardApi } from "../components/api.js";
import { createCardElement } from "../components/card.js";
import { openModalWindow, closeModalWindow, setCloseModalWindowEventListeners } from "../components/modal.js";

// DOM элементы
const placesWrap = document.querySelector(".places__list");
const profileFormModalWindow = document.querySelector(".popup_type_edit");
const profileForm = profileFormModalWindow.querySelector(".popup__form");
const profileTitleInput = profileForm.querySelector(".popup__input_type_name");
const profileDescriptionInput = profileForm.querySelector(".popup__input_type_description");
const profileTitle = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");
const profileAvatar = document.querySelector(".profile__image");

const cardFormModalWindow = document.querySelector(".popup_type_new-card");
const cardForm = cardFormModalWindow.querySelector(".popup__form");
const cardNameInput = cardForm.querySelector(".popup__input_type_card-name");
const cardLinkInput = cardForm.querySelector(".popup__input_type_url");

const imageModalWindow = document.querySelector(".popup_type_image");
const imageElement = imageModalWindow.querySelector(".popup__image");
const imageCaption = imageModalWindow.querySelector(".popup__caption");

const avatarFormModalWindow = document.querySelector(".popup_type_edit-avatar");
const avatarForm = avatarFormModalWindow.querySelector(".popup__form");
const avatarInput = avatarForm.querySelector(".popup__input");

const openProfileFormButton = document.querySelector(".profile__edit-button");
const openCardFormButton = document.querySelector(".profile__add-button");

// Модальное окно статистики
const infoModalWindow = document.querySelector(".popup_type_info");
const infoDefinitionList = document.querySelector(".popup-info__definition-list");
const infoUsersList = document.querySelector(".popup-info__users-list");
const infoDefinitionTemplate = document.querySelector("#popup-info-definition-template").content;
const infoUserTemplate = document.querySelector("#popup-info-user-preview-template").content;

// Переменная для хранения ID текущего пользователя
let currentUserId = null;

// ---------- Вспомогательные функции для статистики ----------
const formatDate = (date) =>
  date.toLocaleDateString("ru-RU", { year: "numeric", month: "long", day: "numeric" });

const createInfoString = (label, value) => {
  const el = infoDefinitionTemplate.cloneNode(true);
  el.querySelector(".popup__info-term").textContent = label;
  el.querySelector(".popup__info-description").textContent = value;
  return el;
};

const createUserPreview = (user) => {
  const el = infoUserTemplate.cloneNode(true);
  const avatar = el.querySelector(".popup-info__user-avatar");
  const nameSpan = el.querySelector(".popup-info__user-name");
  avatar.src = user.avatar || "./src/images/avatar.jpg";
  avatar.alt = user.name;
  nameSpan.textContent = user.name;
  return el;
};

// ---------- Обработчик кнопки "i" ----------
const handleInfoClick = (cardId) => {
  getCards()
    .then((cards) => {
      const cardData = cards.find(card => card._id === cardId);
      if (!cardData) throw new Error("Карточка не найдена");
      infoDefinitionList.innerHTML = "";
      infoUsersList.innerHTML = "";
      infoDefinitionList.append(
        createInfoString("Название:", cardData.name),
        createInfoString("Дата создания:", formatDate(new Date(cardData.createdAt))),
        createInfoString("Количество лайков:", cardData.likes.length.toString())
      );
      cardData.likes.forEach(user => infoUsersList.append(createUserPreview(user)));
      openModalWindow(infoModalWindow);
    })
    .catch(console.error);
};

// ---------- Остальные обработчики ----------
const handlePreviewPicture = ({ name, link }) => {
  imageElement.src = link;
  imageElement.alt = name;
  imageCaption.textContent = name;
  openModalWindow(imageModalWindow);
};

const handleProfileFormSubmit = (evt) => {
  evt.preventDefault();
  const name = profileTitleInput.value;
  const about = profileDescriptionInput.value;
  updateUser(name, about)
    .then(() => {
      profileTitle.textContent = name;
      profileDescription.textContent = about;
      closeModalWindow(profileFormModalWindow);
    })
    .catch(console.error);
};

const handleAvatarSubmit = (evt) => {
  evt.preventDefault();
  updateAvatar(avatarInput.value)
    .then((user) => {
      profileAvatar.style.backgroundImage = `url(${user.avatar})`;
      closeModalWindow(avatarFormModalWindow);
    })
    .catch(console.error);
};

const handleCardFormSubmit = (evt) => {
  evt.preventDefault();
  const name = cardNameInput.value;
  const link = cardLinkInput.value;
  addCard(name, link)
    .then((newCard) => {
      const cardElement = createCardElement(newCard, {
        onPreviewPicture: handlePreviewPicture,
        onLike: likeCardApi,
        onUnlike: unlikeCardApi,
        onDelete: handleDeleteCard,
        onInfoClick: handleInfoClick,
        currentUserId,
      });
      placesWrap.prepend(cardElement);
      closeModalWindow(cardFormModalWindow);
      cardForm.reset();
    })
    .catch(console.error);
};

const handleDeleteCard = (cardId, cardElement) => {
  deleteCardApi(cardId)
    .then(() => cardElement.remove())
    .catch(console.error);
};

// ---------- Загрузка начальных данных ----------
Promise.all([getCurrentUser(), getCards()])
  .then(([user, cards]) => {
    currentUserId = user._id;
    profileTitle.textContent = user.name;
    profileDescription.textContent = user.about;
    profileAvatar.style.backgroundImage = `url(${user.avatar})`;

    cards.forEach((card) => {
      placesWrap.append(
        createCardElement(card, {
          onPreviewPicture: handlePreviewPicture,
          onLike: likeCardApi,
          onUnlike: unlikeCardApi,
          onDelete: handleDeleteCard,
          onInfoClick: handleInfoClick,
          currentUserId,
        })
      );
    });
  })
  .catch(console.error);

// ---------- Слушатели ----------
profileForm.addEventListener("submit", handleProfileFormSubmit);
cardForm.addEventListener("submit", handleCardFormSubmit);
avatarForm.addEventListener("submit", handleAvatarSubmit);

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

// Закрытие попапов
document.querySelectorAll(".popup").forEach(popup => setCloseModalWindowEventListeners(popup));