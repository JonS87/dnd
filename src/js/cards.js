import { saveState } from "./storage.js";

export const createCardElement = (title) => {
  const li = document.createElement("li");
  li.className = "issue-row";

  const div = document.createElement("div");
  div.className = "issue-block";
  div.innerHTML = `<span class="issue-name">${title}</span>`;

  const deleteButton = document.createElement("button");
  deleteButton.className = "delete-card";
  deleteButton.innerHTML = "&#xE951;";

  deleteButton.addEventListener("click", (e) => {
    e.stopPropagation();
    li.remove();
    saveState();
  });

  div.appendChild(deleteButton);
  li.appendChild(div);

  return li;
};

export const addCardToColumn = (column, cardTitle) => {
  const cardElement = createCardElement(cardTitle);
  const issueList = column.querySelector(".issue-list");
  issueList.appendChild(cardElement);
};
