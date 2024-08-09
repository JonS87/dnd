import { addCardToColumn } from "./cards.js";
import { saveState } from "./storage.js";

export const createCardForm = (column) => {
  const formContainer = document.createElement("div");
  formContainer.className = "form-container";

  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = "Enter a title for this card...";

  const saveButton = document.createElement("button");
  saveButton.className = "add-card";
  saveButton.textContent = "Add Card";

  saveButton.addEventListener("click", () => {
    const title = input.value.trim();
    if (title) {
      addCardToColumn(column, title);
      formContainer.remove();
      saveState();
    }
  });

  formContainer.appendChild(input);
  formContainer.appendChild(saveButton);

  return formContainer;
};
