import { likeCardApi, unlikeCardApi } from "./api.js";

export const createCardElement = (cardData, options) => {
  const cardTemplate = document.querySelector("#card-template").content;
  const cardElement = cardTemplate.cloneNode(true);
  const cardImage = cardElement.querySelector(".card__image");
  const cardTitle = cardElement.querySelector(".card__title");
  const likeButton = cardElement.querySelector(".card__like-button");
  const deleteButton = cardElement.querySelector(".card__control-button_type_delete");
  const infoButton = cardElement.querySelector(".card__control-button_type_info");
  const likeCountElement = cardElement.querySelector(".card__like-count");

  // Заполнение данными
  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardTitle.textContent = cardData.name;
  likeCountElement.textContent = cardData.likes.length;

  // ---------- ИСПРАВЛЕНИЕ 1: единый класс для активного лайка ----------
  const isLiked = cardData.likes.some(like => like._id === options.currentUserId);
  if (isLiked) {
    likeButton.classList.add("card__like-button_active");
  }

  // Обработчик лайка (используем тот же класс)
  const handleLikeClick = () => {
    const liked = likeButton.classList.contains("card__like-button_active");
    const likeMethod = liked ? unlikeCardApi : likeCardApi;

    likeMethod(cardData._id)
      .then((updatedCard) => {
        likeCountElement.textContent = updatedCard.likes.length;
        likeButton.classList.toggle("card__like-button_active");
      })
      .catch(console.error);
  };
  likeButton.addEventListener("click", handleLikeClick);

  // ---------- ИСПРАВЛЕНИЕ 2: показывать кнопку удаления только для своих карточек ----------
  if (cardData.owner._id === options.currentUserId) {
    deleteButton.addEventListener("click", () => {
      options.deleteCardApi(cardData._id)
        .then(() => cardElement.remove())
        .catch(console.error);
    });
  } else {
    deleteButton.remove(); // или deleteButton.style.display = "none";
  }

  // Кнопка статистики (без изменений)
  infoButton.addEventListener("click", () => {
    options.onInfoClick(cardData._id);
  });

  // Открытие изображения (без изменений)
  cardImage.addEventListener("click", () => {
    options.onPreviewPicture(cardData);
  });

  return cardElement;
};
