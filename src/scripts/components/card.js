export const createCardElement = (cardData, options) => {
  const cardTemplate = document.querySelector("#card-template").content;
  const cardElement = cardTemplate.cloneNode(true);
  const cardImage = cardElement.querySelector(".card__image");
  const cardTitle = cardElement.querySelector(".card__title");
  const likeButton = cardElement.querySelector(".card__like-button");
  const deleteButton = cardElement.querySelector(".card__control-button_type_delete");
  const infoButton = cardElement.querySelector(".card__control-button_type_info");

  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardTitle.textContent = cardData.name;

  likeButton.addEventListener("click", () => {
    options.onLikeIcon(likeButton, cardData._id);
  });

  deleteButton.addEventListener("click", () => {
    options.onDeleteCard(cardElement, cardData._id);
  });

  infoButton.addEventListener("click", () => {
    options.onInfoClick(cardData._id);
  });

  cardImage.addEventListener("click", () => {
    options.onPreviewPicture(cardData);
  });

  return cardElement;
};

export const likeCard = (likeButton) => {
  likeButton.classList.toggle("card__like-button_active");
};

export const deleteCard = (cardElement) => {
  cardElement.remove();
};