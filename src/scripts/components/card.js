import { likeCardApi, unlikeCardApi } from "./api.js";

export const createCardElement = (cardData, options) => {
  const cardTemplate = document.querySelector("#card-template").content;
  const cardElement = cardTemplate.cloneNode(true);
  const cardImage = cardElement.querySelector(".card__image");
  const cardTitle = cardElement.querySelector(".card__title");
  const likeButton = cardElement.querySelector(".card__like-button");
  const deleteButton = cardElement.querySelector(".card__control-button_type_delete");
  const infoButton = cardElement.querySelector(".card__control-button_type_info");
  const likeCountElement = cardElement.querySelector(".card__like-count"); // из шаблона

  // Заполнение данными
  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardTitle.textContent = cardData.name;
  likeCountElement.textContent = cardData.likes.length;

  if (cardData.likes.some(like => like._id === options.currentUserId)) {
    likeButton.classList.add("card__like-button_active");
  }

  // Обработчик лайка
  const handleLikeClick = () => {
    const isLiked = likeButton.classList.contains("card__like-button_active");
    const likeMethod = isLiked ? unlikeCardApi : likeCardApi;

    likeMethod(cardData._id)
      .then((updatedCard) => {
        likeCountElement.textContent = updatedCard.likes.length;
        likeButton.classList.toggle("card__like-button_active");
      })
      .catch(console.error);
  };

  likeButton.addEventListener("click", handleLikeClick);

  // Удаление карточки (с вызовом API)
  deleteButton.addEventListener("click", () => {
    options.deleteCardApi(cardData._id)
      .then(() => cardElement.remove())
      .catch(console.error);
  });

  // Кнопка статистики
  infoButton.addEventListener("click", () => {
    options.onInfoClick(cardData._id);
  });

  // Открытие изображения
  cardImage.addEventListener("click", () => {
    options.onPreviewPicture(cardData);
  });

  return cardElement;
};
