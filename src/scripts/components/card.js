export const createCardElement = (cardData, options) => {
  const cardTemplate = document.querySelector("#card-template").content;
  const cardElement = cardTemplate.cloneNode(true);
  const cardImage = cardElement.querySelector(".card__image");
  const cardTitle = cardElement.querySelector(".card__title");
  const likeButton = cardElement.querySelector(".card__like-button");
  const deleteButton = cardElement.querySelector(".card__control-button_type_delete");
  const infoButton = cardElement.querySelector(".card__control-button_type_info");
  const likeCountElement = document.createElement("p"); // для отображения числа лайков
  likeCountElement.classList.add("card__like-count");
  likeButton.parentNode.appendChild(likeCountElement);

  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardTitle.textContent = cardData.name;
  likeCountElement.textContent = cardData.likes.length;
  if (cardData.likes.some(like => like._id === options.currentUserId)) {
    likeButton.classList.add("card__like-button_active");
  }

  likeButton.addEventListener("click", () => {
    const isLiked = likeButton.classList.contains("card__like-button_active");
    (isLiked ? options.onUnlike : options.onLike)(cardData._id)
      .then((updatedCard) => {
        likeCountElement.textContent = updatedCard.likes.length;
        likeButton.classList.toggle("card__like-button_active");
      })
      .catch(console.error);
  });

  deleteButton.addEventListener("click", () => {
    options.onDelete(cardData._id, cardElement);
  });

  infoButton.addEventListener("click", () => {
    options.onInfoClick(cardData._id);
  });

  cardImage.addEventListener("click", () => {
    options.onPreviewPicture(cardData);
  });

  return cardElement;
};