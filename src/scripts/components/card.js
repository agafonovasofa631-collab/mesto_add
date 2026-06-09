export const likeCard = (likeButton) => {
  likeButton.classList.toggle("card__like-button_is-active");
};

export const deleteCard = (cardElement) => {
  cardElement.remove();
};

const getTemplate = () => {
  return document
    .getElementById("card-template")
    .content.querySelector(".card")
    .cloneNode(true);
};

export const createCardElement = (
  data,
  { onPreviewPicture, onLikeIcon, onDeleteCard }
) => {
  const cardElement = getTemplate();
  const likeButton = cardElement.querySelector(".card__like-button");
  const deleteButton = cardElement.querySelector(".card__control-button_type_delete");
  const cardImage = cardElement.querySelector(".card__image");

  cardImage.src = data.link;
  cardImage.alt = data.name;
  cardElement.querySelector(".card__title").textContent = data.name;

  if (onLikeIcon) {
    likeButton.addEventListener("click", () => onLikeIcon(likeButton));
  }

  if (onDeleteCard) {
    deleteButton.addEventListener("click", () => onDeleteCard(cardElement));
  }

  if (onPreviewPicture) {
    cardImage.addEventListener("click", () => onPreviewPicture({name: data.name, link: data.link}));
  }

  return cardElement;
};
export const initialCards = [
  {
    _id: "1",
    name: "Архыз",
    link: "https://pictures.s3.yandex.net/frontend-developer/cards-compressed/arkhyz.jpg",
    createdAt: "2024-02-10T12:00:00Z",
    likes: [
      { _id: "u1", name: "Иван Петров", avatar: "https://i.pravatar.cc/150?img=1" },
      { _id: "u2", name: "Мария Сидорова", avatar: "https://i.pravatar.cc/150?img=2" }
    ]
  },
  {
    _id: "2",
    name: "Челябинская область",
    link: "https://pictures.s3.yandex.net/frontend-developer/cards-compressed/chelyabinsk-oblast.jpg",
    createdAt: "2024-02-15T14:30:00Z",
    likes: [
      { _id: "u3", name: "Алексей Смирнов", avatar: "https://i.pravatar.cc/150?img=3" }
    ]
  },
  // ... остальные карточки аналогично добавьте поля
];