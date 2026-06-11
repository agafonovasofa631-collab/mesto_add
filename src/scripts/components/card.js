// Импорт API-функций для лайка (прямо в модуль карты)
import { likeCardApi, unlikeCardApi } from "./api.js";

export const createCardElement = (cardData, options) => {
  const cardTemplate = document.querySelector("#card-template").content;
  const cardElement = cardTemplate.cloneNode(true);
  const cardImage = cardElement.querySelector(".card__image");
  const cardTitle = cardElement.querySelector(".card__title");
  const likeButton = cardElement.querySelector(".card__like-button");
  const deleteButton = cardElement.querySelector(".card__control-button_type_delete");
  const infoButton = cardElement.querySelector(".card__control-button_type_info");
  const likeCountElement = cardElement.querySelector(".card__like-count"); // уже есть в шаблоне

  // Заполняем данные карточки
  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardTitle.textContent = cardData.name;
  likeCountElement.textContent = cardData.likes.length;

  // Устанавливаем активное состояние кнопки лайка
  if (cardData.likes.some(like => like._id === options.currentUserId)) {
    likeButton.classList.add("card__like-button_active");
  }

  // Функция-обработчик лайка (создаётся один раз на карточку, но логика вынесена в отдельную функцию)
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

  // Навешиваем обработчики событий
  likeButton.addEventListener("click", handleLikeClick);

  deleteButton.addEventListener("click", () => {
    options.deleteCardApi(cardData._id)
      .then(() => cardElement.remove())
      .catch(console.error);
  });

  infoButton.addEventListener("click", () => {
    options.onInfoClick(cardData._id);
  });

  cardImage.addEventListener("click", () => {
    options.onPreviewPicture(cardData);
  });

  return cardElement;
};
