import { initializeBoardState, loadState } from "./storage.js";
import { createCardForm } from "./form.js";
import { enableDragAndDrop } from "./drag.js";
import { createCardElement } from "./cards.js";

initializeBoardState();
let boardState = loadState();

document.querySelectorAll(".column").forEach((column) => {
  const columnName = column.querySelector(".head-name").innerText;
  const issueList = column.querySelector(".issue-list");

  if (boardState[columnName]) {
    boardState[columnName].forEach((cardTitle) => {
      const cardElement = createCardElement(cardTitle);
      issueList.appendChild(cardElement);
    });
  }

  const addNewCardButton = column.querySelector(".add-new-card");
  addNewCardButton.addEventListener("click", () => {
    const form = createCardForm(column);
    issueList.appendChild(form);
  });
});

enableDragAndDrop();
